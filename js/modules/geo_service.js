import pako from "pako";
import * as THREE from 'three';
import {BufferGeometry} from "three";
import {hslToRgb} from "./util.js";

export default {
    initialize,
    fetch_radius,
    gps2XY
}

const CDN_Route = "https://cdn.whats-that-mountain.site";
const Earth_Radius = 6371000;
const Tile_Dim = 3601;
const Tile_Dim_Squared = Tile_Dim*Tile_Dim;
function initialize() {

}

function gps2XY(lat, lon) {
    return [
        Earth_Radius * Math.cos(lat*(Math.PI/180)) * Math.cos(lon*(Math.PI/180)),
        Earth_Radius * Math.cos(lat*(Math.PI/180)) * Math.sin(lon*(Math.PI/180))
    ];
}

async function fetch_radius(lat, lon, radius) {
    let tiles = [];
    let coord1 = gps2XY(lat, lon);
    let coord2 = gps2XY(lat+1, lon+1);
    const mountainGeom = new THREE.PlaneGeometry((coord2[0]-coord1[0]), (coord2[1]-coord1[1]),64, 64);
    // for ()
    {
        const data = await fetch_tile(lat, lon);

        const canvas = document.getElementById("tile_debug");
        canvas.style.height = Math.abs(30*(1-(coord2[1]-coord1[1])/(coord2[0]-coord1[0]))) + "vw";
        const ctx = canvas.getContext("2d");
        const id = ctx.createImageData(Tile_Dim, Tile_Dim);
        for (let i = 0; i < data.data.length; i++) {
            let v = (1-(data.data[i]-data.valley)/(data.peak-data.valley))*255;
            id.data[(i * 4) + 0] = v;
            id.data[(i * 4) + 1] = v;
            id.data[(i * 4) + 2] = v;
            id.data[(i * 4) + 3] = 255;
        }
        const material = new THREE.MeshStandardMaterial( { color: 0xff00ff, wireframe: true,
            displacementMap: new THREE.CanvasTexture(canvas),
            emissive: 0xffffff,
            emissiveIntensity: 0.5
        } );
        ctx.putImageData(id, 0, 0);

        const mesh = new THREE.Mesh(mountainGeom, material);
        tiles.push(mesh);
    }
    return tiles;
}

async function fetch_tile(lat, lon) {
    let d = await fetch(`${CDN_Route}/${latlon2ne(lat,lon)}.hgt.gz`)
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

    return {"peak":peak,"valley":valley,"data":tmp};
}

function latlon2ne(lat, lon) {
    let latRound = Math.round(lat);
    let lonRound = Math.round(lon);
    return (latRound < 0 ? 's' : 'n') + ("0" + Math.abs(latRound)).slice(-2) + (lonRound < 0 ? 'w' : 'e') +
        ("00" + Math.abs(lonRound)).slice(-3);
}