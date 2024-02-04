import * as THREE from 'three';
import {CSS2DRenderer} from "three/addons/renderers/CSS2DRenderer.js";

let visibleObjectsArray;
export default {
    animate,
    initialize,
    setCameraRotation,
    setCameraPosition,
    setMeshData,
    setSize,
    visibleObjects
}

function visibleObjects() {
    return visibleObjectsArray;
}
// Create a scene
const scene = new THREE.Scene();

const light = new THREE.AmbientLight( 0x404040, 100 ); // soft white light
light.castShadow = false;
light.receiveShadow = false;

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);

// Create a renderer
let renderer;
let labelRenderer;
let lastPointsTime = 0;

// Animation/render loop
function animate() {
    if (renderer) {
        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);

        if (Math.abs(Date.now() - lastPointsTime) > 50) {
            lastPointsTime = Date.now();
            const frustum = new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
            visibleObjectsArray = []

            scene.traverse(node => {
                if (node.isCSS2DObject && (frustum.containsPoint(node.position))) {
                    visibleObjectsArray.push(node)
                }
            })
        }


    }
}

function setCameraRotation(rotation) {
    camera.setRotationFromQuaternion(rotation);
}

function setCameraPosition(position) {
    camera.position.x = position.x;
    camera.position.y = position.y;
    camera.position.z = position.z;
}

let pinching = false;
let dist = 0;

function initialize() {
    if (screen.orientation.lock !== undefined) {
        try {
            document.documentElement.requestFullscreen().then(_ => {
                screen.orientation.lock("portrait");
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        } catch (e) {
            console.log(e);
        }
    }
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.domElement.setAttribute("data-ref", "main_canvas");
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = false;

    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize( window.innerWidth, window.innerHeight );
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    document.querySelector('[data-ref="label-container"]').appendChild( labelRenderer.domElement );

    let els = [renderer.domElement, labelRenderer.domElement];

els.forEach((el)=>{
    el.addEventListener("touchstart", (e)=> {
        if (e.touches.length === 2) {
            pinching = true;
            let w = window.innerWidth;
            let h = window.innerHeight;
            dist = Math.hypot(
                e.touches[0].pageX / w - e.touches[1].pageX / w,
                e.touches[0].pageY / h - e.touches[1].pageY / h)
        }
    })
    el.addEventListener("touchmove", (e) =>{
        if (pinching) {
            let w = window.innerWidth;
            let h = window.innerHeight;
            let d = Math.hypot(
                e.touches[0].pageX / w - e.touches[1].pageX / w,
                e.touches[0].pageY / h - e.touches[1].pageY / h)
            let delta = d - dist;
            camera.setFocalLength(Math.max(5,camera.getFocalLength() + delta * 50));
            dist = d;
        }
    })
    el.addEventListener("touchend", ()=>{
        pinching = false;
    })
})


    return renderer.domElement;
}

function setMeshData(meshs) {
    scene.clear();
    scene.add( light );
    meshs.forEach((el)=>{
        scene.add(el);
    })
}

function setSize(width, height) {
    if (renderer) {
        renderer.setSize(width, height);
        camera.aspect = width / height;

        camera.updateProjectionMatrix();
        labelRenderer.setSize(width, height)
    }
}