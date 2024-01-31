import * as fs from "fs"
const CDN_Route = "https://cdn.whats-that-mountain.site";
const Tile_Dim = 3601;

async function fetch_tile(ne) {
    const pako = await import("pako");
    try {
        let d = await fetch(`${CDN_Route}/${ne}.hgt.gz`)
        if (d.ok) {
            console.log(`\x1B[2;1HProcessing Tile: '${ne}'...` + " ".repeat(5));
            let data = await d.arrayBuffer();
            let decompression = pako.inflate(data);
            const tmp = new Int16Array(decompression.length / 2);
            let peak = -32767;
            let valley = 32767;
            let valleys = [];
            let peaks = [];
            for (let i = 0; i < decompression.length / 2; i++) {
                const byte1 = decompression[i * 2];
                const byte2 = decompression[i * 2 + 1];
                tmp[i] = (byte1 << 8) | byte2;
                if (tmp[i] > peak) {
                    if (peaks.length > 3)
                        peaks.shift();
                    peaks.push(tmp[i]);
                }
                if (tmp[i] < valley) {
                    if (valleys.length > 3)
                        valleys.shift();
                    valleys.push(tmp[i]);
                }
                peak = Math.max(peak, tmp[i]);
                valley = Math.min(valley, tmp[i]);
            }

            return {"peak": peak, "valley": valley, peaks, valleys};
        }
        if (d.status === 404)
            return {error:"NOT_FOUND"}
    } catch (e) {
        console.error(e)
    }
}
let counter = 0;
console.log("\x1B[2J");
let data = fs.readFileSync("processed_tiles.json", "utf8");
let metadata = JSON.parse(data)
fs.readFile("tiles.txt", 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    // Split the content into an array based on each line
    const tiles = data.split('\r\n');
    const fetchAllTilesSequentially = async () => {
        for (const tile of tiles) {
            counter++;
            if (Object.keys(metadata).includes(tile)) {
                console.log(`\x1B[1;1HSkipping Tile: '${tile}' - ${counter} / ${tiles.length} (${Math.round(counter/tiles.length*10000)/100}%)...` + " ".repeat(40));
                continue;
            }
            console.log(`\x1B[1;1HFetching Tile: '${tile}' - ${counter} / ${tiles.length} (${Math.round(counter/tiles.length*10000)/100}%)...` + " ".repeat(40));
            const d = await fetch_tile(tile);

            console.log(`\x1B[3;1HDone Tile: '${tile}'...` + " ".repeat(40));
            metadata[tile] = d;
            // console.log(`\x1B[8;8 - ${JSON.stringify(metadata)}` + " ".repeat(40));
            if (counter % 5 === 0)
                fs.writeFileSync("processed_tiles.json",JSON.stringify(metadata))
        }

        // Code here will be executed after all tiles have been fetched sequentially
        console.log("All tiles fetched!");
        fs.writeFileSync("processed_tiles.json",JSON.stringify(metadata))
    };

// Call the fetchAllTilesSequentially function
    fetchAllTilesSequentially();
});