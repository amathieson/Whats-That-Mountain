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
let worker = null;
let lastUpdate = 0;
const valley = -100;
const peak = 5000;
function initialize() {
    if (window.Worker && worker == null) {
        worker = new Worker(import.meta.env.MODE === 'development' ? "js/modules/geo_worker.js" : "geo-worker.js");
        worker.onmessage = function(e) {
            if (e.data.method === undefined) {
                logger.error("Command Missing Method", "GEO_SERVICE")
                return;
            }

            switch (e.data.method) {
                case "UPDATE_TERRAIN":
                    let data = e.data.data;
                    const canvas = document.getElementById("tile_debug");
                    const ctx = canvas.getContext("2d");
                    ctx.putImageData(data.canvas, 0, 0);

                    let [lat, lon] = data.tile_origin;
                    let coord1 = gps2XY(lat-.5, lon-.5);
                    let coord2 = gps2XY(lat+.5, lon+.5);
                    const mountainGeom = new WTMPlaneGeometry(Math.abs(coord2[0]-coord1[0]), Math.abs(coord2[1]-coord1[1]),256, 256);


                    let tex = new THREE.CanvasTexture(canvas);
                    setTimeout(()=>{
                        tex.needsUpdate = true;
                    }, 50);
                    let tiles = [];
                    const rootStyles = getComputedStyle(document.documentElement);
                    const primaryColor = Number("0x" + standardize_color(rootStyles.getPropertyValue('--primary-color')).substring(1));
                    const secondaryColor = Number("0x" + standardize_color(rootStyles.getPropertyValue('--secondary-color')).substring(1));


                    const material = new THREE.MeshStandardMaterial( { wireframe: false,
                        side: THREE.FrontSide,
                        displacementMap: tex,
                        displacementScale: peak-valley,
                        displacementBias: valley,
                        // map: tex,
                        color: primaryColor,
                    } );

                    const mesh = new THREE.Mesh(mountainGeom, material);
                    let [posx,posy] = gps2XY(lat,lon);
                    mesh.position.set(posx,posy,0)
                    mesh.rotateZ(-Math.PI/2);
                    tiles.push(mesh);
                    //
                    // data.points_of_interest.push({
                    //     location: {
                    //         lat: lat,
                    //         lon: lon,
                    //     },
                    //     tags: {
                    //         name: "🟢 _CENTRE"
                    //     }
                    // })
                    //
                    // data.points_of_interest.push({
                    //     location: {
                    //         lat: lat + 0.2,
                    //         lon: lon,
                    //     },
                    //     tags: {
                    //         name: "🔴 +0.2 LAT - NORTH"
                    //     }
                    // })
                    //
                    // data.points_of_interest.push({
                    //     location: {
                    //         lat: lat - 0.2,
                    //         lon: lon,
                    //     },
                    //     tags: {
                    //         name: "🔵 -0.2 LAT - SOUTH"
                    //     }
                    // })
                    //
                    // data.points_of_interest.push({
                    //     location: {
                    //         lat: lat,
                    //         lon: lon + 0.2,
                    //     },
                    //     tags: {
                    //         name: "🔴 +0.2 LON - EAST"
                    //     }
                    // })
                    //
                    // data.points_of_interest.push({
                    //     location: {
                    //         lat: lat,
                    //         lon: lon - 0.2,
                    //     },
                    //     tags: {
                    //         name: "🔵 -0.2 LON - WEST"
                    //     }
                    // })
                    data.points_of_interest.forEach((point)=>{
                        const label = document.createElement( 'div' );
                        label.className = 'label';
                        label.textContent = point.tags.name;

                        const labelObj = new CSS2DObject( label );
                        labelObj.userData = point;
                        let [x,y] = gps2XY(point.location.lat, point.location.lon)

                        labelObj.position.set( x, y, 900 );
                        labelObj.center.set( 0, 1 );

                        tiles.push(labelObj);
                    })

                    const material2 = new THREE.MeshStandardMaterial( { wireframe: true,
                        side: THREE.FrontSide,
                        displacementMap: tex,
                        displacementScale: peak-valley,
                        displacementBias: valley,
                        // map: tex,
                        color: secondaryColor,
                    } );

                    const mesh2 = new THREE.Mesh(mountainGeom, material2);
                    mesh2.position.set(posx,posy,0)
                    mesh2.rotateZ(-Math.PI/2);
                    tiles.push(mesh2);

                    render_service.setMeshData(tiles);

                    document.getElementsByClassName("loading-scroller")[0].removeAttribute("visible");
                    document.querySelector("[data-ref=\"main_canvas\"]").setAttribute("data-ready", "true")
                    return;
                case "LOADING_TILES":
                    document.getElementsByClassName("loading-scroller")[0].setAttribute("visible", "true");
                    document.getElementsByClassName("loading-scroller")[0].innerText = "Loading Tiles...";
                    return;
                default:
                    logger.error(`Unrecognised Method '${e.data.method}'`, "GEO_SERVICE")
                    return;

            }
        }
    }
}
function update(position) {
    if (Math.abs(lastUpdate - Date.now()) > 1000) {
        lastUpdate = Date.now();
        worker.postMessage({
            method: "POS_UPDATE",
            data: position
        });
    }
}

function gps2XY(lat, lon) {
    return [
        Earth_Radius * -Math.cos(lat*(Math.PI/180)) * Math.cos(lon*(Math.PI/180)),
        Earth_Radius * -Math.cos(lat*(Math.PI/180)) * Math.sin(lon*(Math.PI/180))
    ];
}

// Based on https://stackoverflow.com/a/47355187
function standardize_color(str){
    let ctx = document.createElement("canvas").getContext("2d");
    ctx.fillStyle = str;
    return ctx.fillStyle;
}