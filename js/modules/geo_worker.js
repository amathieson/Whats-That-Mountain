let lastRenderedPosition = [Number.MAX_VALUE,Number.MAX_VALUE];
let rendering = [Number.MAX_VALUE,Number.MAX_VALUE];
let tiles = {};
const DB_Name = "WTM";
const DB_Version = 2;
const Store_Name = "Tile_Cache";
const dbRequest = indexedDB.open(DB_Name, DB_Version);
const CDN_Route = "https://cdn.whats-that-mountain.site";
const Tile_Dim = 3601;
const TILE_RES = 256;
let db = null;


dbRequest.onerror = function(event) {
    console.error('[GEO_WORKER] - Failed to open database:', event.target.errorCode);
};

dbRequest.onupgradeneeded = function(event) {
    const db = event.target.result;

    // Create object store with autoIncrement key
    const store = db.createObjectStore(Store_Name, { autoIncrement: true });

    // Create index for latitude and longitude
    store.createIndex('latitude', 'latitude', { unique: false });
    store.createIndex('longitude', 'longitude', { unique: false });
};

dbRequest.onsuccess = function(event) {
    db = event.target.result;
};

function dist(lat1, lon1, lat2, lon2) {
    return Math.sqrt(Math.pow(lat1-lat2, 2) + Math.pow(lon1-lon2, 2))
}


onmessage = function(e) {
    if (e.data.method === undefined) {
        console.error("[GEO_WORKER] - Command Missing Method")
        return;
    }

    switch (e.data.method) {
        case "POS_UPDATE":
            if (dist(lastRenderedPosition[0], lastRenderedPosition[1], e.data.data[0], e.data.data[1]) > 0.25 &&
                (rendering[0] !== e.data.data[0] || rendering[1] !== e.data.data[1])) {
                rendering = e.data.data;
                reRender(e.data.data).then(()=>{
                    rendering = [Number.MAX_VALUE,Number.MAX_VALUE]
                }).catch(()=>{
                    rendering = [Number.MAX_VALUE,Number.MAX_VALUE]
                })
            }
            return;
        default:
            console.error(`[GEO_WORKER] - Unrecognised Method '${e.data.method}'`)
            return;

    }
}


function latlon2ne(lat, lon) {
    let latRound = Math.floor(lat);
    let lonRound = Math.floor(lon);
    return (latRound < 0 ? 's' : 'n') + ("0" + Math.abs(latRound)).slice(-2) + (lonRound < 0 ? 'w' : 'e') +
        ("00" + Math.abs(lonRound)).slice(-3);
}

function queryLocationsByProximity(latitude, longitude, maxDistance) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(Store_Name, 'readonly');
        const store = transaction.objectStore(Store_Name);

        // Open cursor within the range
        const request = store.index('latitude').getAll();
        request.onsuccess = function(event) {
            const allLocations = event.target.result;
            const results = allLocations.filter(location => {
                const distance = dist(latitude, longitude, location.latitude, location.longitude);
                return distance <= maxDistance;
            });
            resolve(results);
        };

        request.onerror = function(event) {
            reject('Error querying locations: ' + event.target.error);
        };
    });
}

async function reRender(pos) {
    if (db !== null) {
        let res = await queryLocationsByProximity(pos[0], pos[1], 0.25);
        if (res.length > 0) {
            postMessage({
                method:"UPDATE_TERRAIN",
                data: res[0].tile_data
            })
            lastRenderedPosition = res[0].tile_data.tile_origin;
            return;
        }
    }

    let tiles_to_load = [];
    let tile_radius = .5;



    let corners = [
        [pos[0] + tile_radius, pos[1] - tile_radius], // top left
        [pos[0] + tile_radius, pos[1] + tile_radius], // top right
        [pos[0] - tile_radius, pos[1] - tile_radius], // bottom left
        [pos[0] - tile_radius, pos[1] + tile_radius], // bottom right
    ];

    let corner_tiles = [
        latlon2ne(corners[0][0],corners[0][1]), // top left
        latlon2ne(corners[1][0],corners[1][1]), // top right
        latlon2ne(corners[2][0],corners[2][1]), // bottom left
        latlon2ne(corners[3][0],corners[3][1]), // bottom right
    ]

    tiles_to_load = corner_tiles;

    tiles_to_load.forEach((id)=>{
        if (tiles[id]?.loaded || tiles[id]?.available === false || tiles[id]?.available === null)
            return;
        postMessage({
            method:"LOADING_TILES",
            data: {
                tiles: tiles_to_load
            }
        })
        let tile_canvas = {
            pois:[],
            loaded:false,
            available: null,
            imageData: null
        }
        tiles[id] = tile_canvas;

        fetch_tile(id).then((data)=>{
            if (data === undefined || data.error !== undefined) {
                tile_canvas.available = false;
                return;
            }
            tile_canvas.pois = data.pois;
            tile_canvas.loaded = true;
            tile_canvas.available = true;
            tile_canvas.data = data.data;
        });
    })

    if (tiles_to_load.every(id =>
        tiles[id] !== undefined && (tiles[id].loaded || tiles[id].available === false))) {
        let new_heightmap = new Int16Array(Tile_Dim * Tile_Dim);
        let pois = [];

        {
            // Top Left
            let tile_id = corner_tiles[0];
            if (tiles[tile_id].available) {
                let x = Math.round(frac(corners[0][1]) * Tile_Dim);
                let y = Math.round((1-frac(corners[0][0])) * Tile_Dim);
                if (x < Tile_Dim && y < Tile_Dim) {
                    for (let readY = 0; readY < (Tile_Dim - y); readY++) {
                        for (let readX = 0; readX < (Tile_Dim - x); readX++) {
                            new_heightmap[(readY) * Tile_Dim + (readX)] = tiles[tile_id].data[(readY + y) * Tile_Dim + (readX + x)];
                        }
                    }
                }
            }

            // Top Right
            tile_id = corner_tiles[1];
            if (frac(corners[0][1]) !== 0 && tiles[tile_id].available) {
                let width = Math.round(frac(corners[1][1]) * Tile_Dim);
                let y = Math.round((1-frac(corners[1][0])) * Tile_Dim);
                if (width > 0 && y < Tile_Dim) {
                    for (let readY = 0; readY < (Tile_Dim - y); readY++) {
                        for (let readX = 0; readX < width; readX++) {
                            new_heightmap[(readY) * Tile_Dim + (readX + (Tile_Dim-width))] = tiles[tile_id].data[(readY + y) * Tile_Dim + (readX)];
                        }
                    }
                }
            }

            // Bottom Left
            tile_id = corner_tiles[2];
            if (frac(corners[0][0]) !== 0 && tiles[tile_id].available) {
                let x = Math.round(frac(corners[2][1]) * Tile_Dim);
                let height = Math.round((1-frac(corners[2][0])) * Tile_Dim);
                if (height > 0 && x < Tile_Dim) {
                    for (let readY = 0; readY < height; readY++) {
                        for (let readX = 0; readX < (Tile_Dim - x); readX++) {
                            new_heightmap[(readY + (Tile_Dim-height)) * Tile_Dim + (readX)] = tiles[tile_id].data[(readY) * Tile_Dim + (readX + x)];
                        }
                    }
                }
            }

            // Bottom Right
            tile_id = corner_tiles[3];
            if (frac(corners[0][1]) !== 0 && frac(corners[0][0]) !== 0 && tiles[tile_id].available) {
                let width = Math.round(frac(corners[3][1]) * Tile_Dim);
                let height = Math.round((1-frac(corners[3][0])) * Tile_Dim);
                if (height > 0 && 0 < width) {
                    for (let readY = 0; readY < height; readY++) {
                        for (let readX = 0; readX < width; readX++) {
                            new_heightmap[(readY + (Tile_Dim-height)) * Tile_Dim + (readX + (Tile_Dim - width))] = tiles[tile_id].data[(readY) * Tile_Dim + (readX)];
                        }
                    }
                }
            }
        }


        tiles_to_load.forEach((id)=>{
            if (tiles[id].available) {
                // Push the PoIs that are within range to the array
                tiles[id].pois.filter(point => Math.hypot(pos[0] - point.location.lat, pos[1] - point.location.lon) < tile_radius)
                    .forEach((point) => {
                        point.location.alt = new_heightmap[Math.round((point.location.lat - corners[0][0]) * Tile_Dim) + Math.round((point.location.lon - corners[0][1]) * Tile_Dim) * Tile_Dim] + 100
                        pois.push(point)
                    });
            }

        })

        if (db !== null) {
            const transaction = db.transaction(Store_Name, 'readwrite');
            const store = transaction.objectStore(Store_Name);

            const location = {latitude: pos[0], longitude: pos[1], tile_data:{
                    points_of_interest: pois,
                    tile_origin: [pos[0],pos[1]],
                    new_heightmap
                }};
            const request = store.add(location);

            request.onerror = function (event) {
                console.error('[GEO_WORKER] - Failed to cache tile:', event.target.error);
            };
        }


        postMessage({
            method:"UPDATE_TERRAIN",
            data: {
                points_of_interest: pois,
                tile_origin: [pos[0],pos[1]],
                new_heightmap
            }
        })

        lastRenderedPosition = pos;
    }
}

async function fetch_tile(ne) {
    const pako = await import("pako");
    try {
        // Attempt to fetch the tile from the CDN
        let d = await fetch(`${CDN_Route}/${ne}.hgt.gz`)
        if (d.ok) {
            // On Success inflate the received data
            let data = await d.arrayBuffer();
            let decompression = pako.inflate(data);
            const tmp = new Int16Array(decompression.length / 2);
            let peak = -32767;
            let valley = 32767;
            // Iterate over all the data flipping the bytes and appending them to a typed array,
            // computing the minima and maxima at the same time.
            for (let i = 0; i < tmp.length; i++) {
                const byte1 = decompression[i * 2];
                const byte2 = decompression[i * 2 + 1];
                tmp[i] = (byte1 << 8) | byte2;
                peak = Math.max(peak, tmp[i]);
                valley = Math.min(valley, tmp[i]);
            }
            // Fetch the points of interest for the tile
            let pois = [];
            let poisResp = await fetch(`${CDN_Route}/markers/${ne}.json`);
            if (poisResp.status === 200)
                pois = await poisResp.json()
            // Return a struct of all the tile's computed data
            return {"peak": peak, "valley": valley, "data": tmp, "pois": pois};
        }
        if (d.status === 404)
            return {error:"NOT_FOUND"}
    } catch (e) {
        console.error("[GEO_WORKER] - ", e)
    }
}


function frac(value) {
    return value - Math.floor(value);
}