let lastRenderedPosition = [Number.MAX_VALUE,Number.MAX_VALUE];
let tiles = {};
let tile_meta = null;
onmessage = function(e) {
    if (e.data.method === undefined) {
        console.error("[GEO_WORKER] - Command Missing Method")
        return;
    }

    switch (e.data.method) {
        case "POS_UPDATE":
            if (Math.abs(lastRenderedPosition[0] - e.data.data[0]) > 0.25 || Math.abs(lastRenderedPosition[1] - e.data.data[1]) > 0.25) {
                reRender(e.data.data);
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

function reRender(pos) {
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
        let tile_canvas = {
            canvas: new OffscreenCanvas(Tile_Dim, Tile_Dim),
            ctx: null,
            pois:[],
            loaded:false,
            available: null,
            imageData: null
        }
        tile_canvas.ctx = tile_canvas.canvas.getContext("2d", {willReadFrequently:true});
        tiles[id] = tile_canvas;

        fetch_tile(id).then((data)=>{
            if (data === undefined || data.error !== undefined) {
                tile_canvas.available = false;
                return;
            }
            const imageData = tile_canvas.ctx.createImageData(Tile_Dim, Tile_Dim);
            console.time("DRAW_CANVAS_" + id)
            for (let i = 0; i < data.data.length; i++) {
                let v = ((data.data[i] - data.valley) / (data.peak - data.valley)) * 255;
                let index = i * 4;

                imageData.data[index] = imageData.data[index + 1] = imageData.data[index + 2] = v;
                imageData.data[index + 3] = 255;
            }
            tile_canvas.ctx.putImageData(imageData, 0, 0);
            console.timeEnd("DRAW_CANVAS_" + id)
            tile_canvas.imageData = imageData;
            tile_canvas.pois = data.pois;
            tile_canvas.loaded = true;
            tile_canvas.available = true;
        });
    })

    if (tiles_to_load.every(id =>
        tiles[id] !== undefined && (tiles[id].loaded || tiles[id].available === false))) {
        let outCanvas = new OffscreenCanvas(Tile_Dim, Tile_Dim);
        let ctx = outCanvas.getContext("2d");
        console.time("DRAW_CANVAS_MAIN")
        let pois = [];

        {

            // Top Left
            let tile_id = corner_tiles[0];
            if (tiles[tile_id].available) {
                let x = frac(corners[0][1]) * Tile_Dim;
                let y = (1-frac(corners[0][0])) * Tile_Dim;
                if (x < Tile_Dim && y < Tile_Dim)
                    ctx.putImageData(tiles[tile_id].ctx.getImageData(x,y,Tile_Dim - x,Tile_Dim - y),0,0);
            }

            // Top Right
            tile_id = corner_tiles[1];
            if (frac(corners[0][1]) !== 0 && tiles[tile_id].available) {
                let width = frac(corners[1][1]) * Tile_Dim;
                let y = (1-frac(corners[1][0])) * Tile_Dim;
                if (width > 0 && y < Tile_Dim)
                    ctx.putImageData(tiles[tile_id].ctx.getImageData(0,y,width,Tile_Dim - y),Tile_Dim - width,0);
            }

            // Bottom Left
            tile_id = corner_tiles[2];
            if (frac(corners[0][0]) !== 0 && tiles[tile_id].available) {
                let x = frac(corners[2][1]) * Tile_Dim;
                let height = (1-frac(corners[2][0])) * Tile_Dim;
                if (height > 0 && x < Tile_Dim)
                    ctx.putImageData(tiles[tile_id].ctx.getImageData(x,0,Tile_Dim - x,height),0,Tile_Dim-height);
            }

            // Bottom Right
            tile_id = corner_tiles[3];
            if (frac(corners[0][1]) !== 0 && frac(corners[0][0]) !== 0 && tiles[tile_id].available) {
                let width = frac(corners[3][1]) * Tile_Dim;
                let height = (1-frac(corners[3][0])) * Tile_Dim;
                if (height > 0 && 0 < width)
                    ctx.putImageData(tiles[tile_id].ctx.getImageData(0,0,width,height),Tile_Dim - width,Tile_Dim-height);
            }


        }
        console.timeEnd("DRAW_CANVAS_MAIN")
        tiles_to_load.forEach((id)=>{
            if (tiles[id].available)
                // Push the PoIs that are within range to the array
                tiles[id].pois.filter(point => Math.hypot(pos[0] - point.location.lat, pos[1] - point.location.lon) < tile_radius)
                    .forEach(point => pois.push(point));

        })

        postMessage({
            method:"UPDATE_TERRAIN",
            data: {
                canvas:ctx.getImageData(0,0,Tile_Dim, Tile_Dim),
                points_of_interest: pois,
                tile_origin: [pos[0],pos[1]]
            }
        })

        lastRenderedPosition = pos;
    }
}


const CDN_Route = "https://cdn.whats-that-mountain.site";
const Tile_Dim = 3601;

async function fetch_tile(ne) {
    if (tile_meta === null) {
        tile_meta = await (await fetch(`${CDN_Route}/compressed_tiles.json`)).json()
    }

    const pako = await import("pako");
    try {
        let d = await fetch(`${CDN_Route}/${ne}.hgt.gz`)
        if (d.ok) {
            let data = await d.arrayBuffer();
            console.time("DECOMPRESSION_" + ne)
            let decompression = pako.inflate(data);
            console.timeEnd("DECOMPRESSION_" + ne)
            const tmp = new Int16Array(decompression.length / 2);
            let peak = tile_meta[ne].peak;
            let valley = tile_meta[ne].valley;
            console.time("BYTE_SWAP_" + ne)
            for (let i = 0; i < tmp.length; i++) {
                const byte1 = decompression[i * 2];
                const byte2 = decompression[i * 2 + 1];
                tmp[i] = (byte1 << 8) | byte2;
            }
            console.timeEnd("BYTE_SWAP_" + ne)
            let pois = await (await fetch(`${CDN_Route}/markers/${ne}.json`)).json()

            return {"peak": peak, "valley": valley, "data": tmp, "pois": pois};
        }
        if (d.status === 404)
            return {error:"NOT_FOUND"}
    } catch (e) {
        console.error(e)
    }
}


function frac(value) {
    return value - Math.floor(value);
}