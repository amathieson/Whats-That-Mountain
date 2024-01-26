import * as THREE from 'three';
import {CSS2DObject} from "three/addons/renderers/CSS2DRenderer.js";
import {WTMPlaneGeometry} from "../constructs/PlaneGeom.js"
import logger from "./logger.js";
import render_service from "./render_service.js";

export default {
    initialize,
    gps2XY,
    update
}

const Earth_Radius = 6371000;
const Tile_Dim = 3601;
let worker = null;
let lastPos = [];
let lastUpdate = 0;
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

                    render_service.setMeshData([]);
                    return;
                default:
                    logger.error(`Unrecognised Method '${e.data.method}'`, "GEO_SERVICE")
                    return;

            }
        }
    }
}
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