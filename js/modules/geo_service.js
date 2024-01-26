import pako from "pako";
import * as THREE from 'three';
import {CSS2DObject} from "three/addons/renderers/CSS2DRenderer.js";
import {WTMPlaneGeometry} from "../constructs/PlaneGeom.js"
import logger from "./logger.js";

export default {
    initialize,
    gps2XY,
    update,
    latlon2ne
}

const CDN_Route = "https://cdn.whats-that-mountain.site";
const Earth_Radius = 6371000;
const Tile_Dim = 3601;
let LastLoc = [];
let tile_canvases = [];
let worker = null;
function initialize() {
    if (window.Worker && worker == null) {
        worker = new Worker("js/modules/geo_worker.js");
        worker.onmessage = function(e) {
            if (e.data.method === undefined) {
                logger.error("Command Missing Method", "GEO_SERVICE")
                return;
            }

            switch (e.data.method) {
                case "UPDATE_TERRAIN":
                    const canvas = document.getElementById("tile_debug");
                    const ctx = canvas.getContext("2d");
                    ctx.putImageData(e.data.data.canvas, 0, 0);
                    return;
                default:
                    logger.error(`Unrecognised Method '${e.data.method}'`, "GEO_SERVICE")
                    return;

            }
        }
    }
}

let lastPos = [];
let lastUpdate = 0;
function update(position) {
    if (Math.hypot(lastPos[0]-position[0], lastPos[1]-position[1]) || Math.abs(lastUpdate - Date.now()) > 500) {
        lastPos = position;
        lastUpdate = Date.now();
        worker.postMessage({
            method: "POS_UPDATE",
            data: position
        });
    }
}

function gps2XY(lat, lon) {
    return [
        Earth_Radius * Math.cos(lat*(Math.PI/180)) * Math.cos(lon*(Math.PI/180)),
        Earth_Radius * Math.cos(lat*(Math.PI/180)) * Math.sin(lon*(Math.PI/180))
    ];
}

async function fetch_radius(inlat, inlon, radius) {
    for (let tile in dirs)
    {
        let [lat, lon] = dirs[tile];
        let coord1 = gps2XY(lat, lon);
        let coord2 = gps2XY(lat+1, lon+1);
        const mountainGeom = new WTMPlaneGeometry(Math.abs(coord2[0]-coord1[0]), Math.abs(coord2[1]-coord1[1]),512, 512);
        const data = await fetch_tile(lat, lon);
        if (data === undefined)
            continue;
        const canvas = document.getElementById("tile_debug");
        canvas.style.height = Math.abs(30*(1-(coord2[1]-coord1[1])/(coord2[0]-coord1[0]))) + "vw";
        const ctx = canvas.getContext("2d");
        const id = ctx.createImageData(Tile_Dim*3, Tile_Dim*3);
        for (let i = 0; i < data.data.length; i++) {
            let v = ((data.data[i]-data.valley)/(data.peak-data.valley))*255;
            id.data[(i * 4) + 0] = v;
            id.data[(i * 4) + 1] = v;
            id.data[(i * 4) + 2] = v;
            id.data[(i * 4) + 3] = 255;
        }
        ctx.putImageData(id, 0, 0)
        let tex = new THREE.CanvasTexture(canvas);
        setTimeout(()=>{
            tex.needsUpdate = true;
        }, 50);
        const material = new THREE.MeshStandardMaterial( { wireframe: false,
            side: THREE.FrontSide,
            displacementMap: tex,
            displacementScale: data.peak-data.valley,
            displacementBias: data.valley,
            // map: tex,
            color: 0xff00ffff,
        } );

        const mesh = new THREE.Mesh(mountainGeom, material);
        let [posx,posy] = gps2XY(Math.round(lat) + 0.5, Math.round(lon) + 0.5);
        console.log(`tile: ${Math.round(lat)},${Math.round(lon)} - posx: ${posx} - posy: ${posy} - width: ${Math.abs(coord2[0]-coord1[0])} - height: ${Math.abs(coord2[1]-coord1[1])}`)
        mesh.position.set(posx,posy,0)
        tiles.push(mesh);

        data.pois.forEach((point)=>{
            const label = document.createElement( 'div' );
            label.className = 'label';
            label.textContent = point.tags.name;
            label.style.backgroundColor = 'red';

            const labelObj = new CSS2DObject( label );
            let [x,y] = gps2XY(point.location.lat, point.location.lon)

            labelObj.position.set( x, y, 900 );
            labelObj.center.set( 0, 1 );

            tiles.push(labelObj);
        })

        const material2 = new THREE.MeshStandardMaterial( { wireframe: true,
            side: THREE.FrontSide,
            displacementMap: tex,
            displacementScale: data.peak-data.valley,
            displacementBias: data.valley,
            // map: tex,
            color: 0xff0000ff,
        } );

        const mesh2 = new THREE.Mesh(mountainGeom, material2);
        mesh2.position.set(posx,posy,0)
        tiles.push(mesh2);
    }
    return tiles;
}

async function fetch_tile(ne) {
    try {
        let d = await fetch(`${CDN_Route}/${ne}.hgt.gz`)
        if (d.ok) {
            let data = await d.arrayBuffer();
            let decop = pako.inflate(data);
            const tmp = new Int16Array(decop.length / 2);
            let peak = -32767;
            let valley = 32767;
            for (let i = 0; i < tmp.length; i++) {
                const byte1 = decop[i * 2];
                const byte2 = decop[i * 2 + 1];
                tmp[i] = (byte1 << 8) | byte2;
                peak = Math.max(peak, tmp[i]);
                valley = Math.min(valley, tmp[i]);
            }
            let pois = await (await fetch(`${CDN_Route}/markers/${ne}.json`)).json()

            return {"peak": peak, "valley": valley, "data": tmp, "pois": pois};
        }
    } catch (e) {
    }
}

function latlon2ne(lat, lon) {
    let latRound = Math.round(lat);
    let lonRound = Math.round(lon);
    return (latRound < 0 ? 's' : 'n') + ("0" + Math.abs(latRound)).slice(-2) + (lonRound < 0 ? 'w' : 'e') +
        ("00" + Math.abs(lonRound)).slice(-3);
}