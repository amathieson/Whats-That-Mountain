let lastRenderedPosition = [Number.MAX_VALUE,Number.MAX_VALUE];
let tiles = {};

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
    let latRound = Math.round(lat);
    let lonRound = Math.round(lon);
    return (latRound < 0 ? 's' : 'n') + ("0" + Math.abs(latRound)).slice(-2) + (lonRound < 0 ? 'w' : 'e') +
        ("00" + Math.abs(lonRound)).slice(-3);
}
function gps2XY(lat, lon) {
    return [
        Earth_Radius * Math.cos(lat*(Math.PI/180)) * Math.cos(lon*(Math.PI/180)),
        Earth_Radius * Math.cos(lat*(Math.PI/180)) * Math.sin(lon*(Math.PI/180))
    ];
}

function reRender(pos) {
    let tiles_to_load = [];
    let tile_range = {};
    let angle = 0;
    let rad = .5;
    while (angle < 360) {
        let y = Math.sin(angle)*rad + pos[0];
        let x = Math.cos(angle)*rad + pos[1];
        let tile_id = latlon2ne(y,x);
        if (tiles_to_load.indexOf(tile_id) === -1)
            tiles_to_load.push(tile_id)
        angle += 0.5;
    }

    tiles_to_load.forEach((id)=>{
        if (tiles[id]?.loaded || tiles[id]?.available === false || tiles[id]?.available === null)
            return;
        let tile_canvas = {
            canvas: new OffscreenCanvas(Tile_Dim, Tile_Dim),
            ctx: null,
            pois:[],
            loaded:false,
            available: null
        }
        tile_canvas.ctx = tile_canvas.canvas.getContext("2d");
        tiles[id] = tile_canvas;

        fetch_tile(id).then((data)=>{
            if (data === undefined || data.error !== undefined) {
                tile_canvas.available = false;
                return;
            }
            const imageData = tile_canvas.ctx.createImageData(Tile_Dim*3, Tile_Dim*3);
            for (let i = 0; i < data.data.length; i++) {
                let v = ((data.data[i]-data.valley)/(data.peak-data.valley))*255;
                imageData.data[(i * 4) + 0] = v;
                imageData.data[(i * 4) + 1] = v;
                imageData.data[(i * 4) + 2] = v;
                imageData.data[(i * 4) + 3] = 255;
            }
            tile_canvas.ctx.putImageData(imageData, 0, 0);
            tile_canvas.pois = data.pois;
            tile_canvas.loaded = true;
            tile_canvas.available = true;
        });
    })


    let loaded = true;
    tiles_to_load.forEach((id)=>{
        if (tiles[id] === undefined || (!tiles[id].loaded && tiles[id].available !== false))
            loaded = false;
    })

    if (loaded) {
        let outCanvas = new OffscreenCanvas(Tile_Dim, Tile_Dim);
        let ctx = outCanvas.getContext("2d");
        const grd = ctx.createLinearGradient(0, 0, 200, 0);
        grd.addColorStop(0, "red");
        grd.addColorStop(1, "white");
        ctx.fillStyle = grd;
        ctx.fillRect(64,64,1024,1024);
        let pois = [];
        lastRenderedPosition = pos;
        postMessage({
            method:"UPDATE_TERRAIN",
            data: {
                canvas:ctx.getImageData(0,0,Tile_Dim, Tile_Dim),
                pois,
                tile_origin: [pos[0]-0.5,pos[1]-0.5]
            }
        })
    }
}


const CDN_Route = "https://cdn.whats-that-mountain.site";
const Earth_Radius = 6371000;
const Tile_Dim = 3601;

async function fetch_tile(ne) {
    const pako = await import("pako");
    try {
        let d = await fetch(`${CDN_Route}/${ne}.hgt.gz`)
        if (d.ok) {
            let data = await d.arrayBuffer();
            let decompression = pako.inflate(data);
            const tmp = new Int16Array(decompression.length / 2);
            let peak = -32767;
            let valley = 32767;
            for (let i = 0; i < tmp.length; i++) {
                const byte1 = decompression[i * 2];
                const byte2 = decompression[i * 2 + 1];
                tmp[i] = (byte1 << 8) | byte2;
                peak = Math.max(peak, tmp[i]);
                valley = Math.min(valley, tmp[i]);
            }
            let pois = await (await fetch(`${CDN_Route}/markers/${ne}.json`)).json()

            return {"peak": peak, "valley": valley, "data": tmp, "pois": pois};
        }
        if (d.status === 404)
            return {error:"NOT_FOUND"}
    } catch (e) {
        console.error(e)
    }
}