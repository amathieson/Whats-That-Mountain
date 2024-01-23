import * as THREE from 'three';
import {CSS2DObject, CSS2DRenderer} from "three/addons/renderers/CSS2DRenderer.js";
export default {
    animate,
    initialize,
    setCamera,
    setMeshData,
    setSize
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

const rootStyles = getComputedStyle(document.documentElement);
const primaryColor = rootStyles.getPropertyValue('--primary-color');

// Animation/render loop
function animate() {
    if (renderer) {
        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);

    }
}

function setCamera(position, rotation) {
    camera.setRotationFromQuaternion(rotation);
    camera.position.x = position.x;
    camera.position.y = position.y;
    camera.position.z = position.z;
}

let pinching = false;
let dist = 0;

function initialize() {
    if (screen.orientation.lock !== undefined) {
        try {
            screen.orientation.lock("portrait");
            // document.documentElement.requestFullscreen().then(r => {
            //     renderer.setSize(window.innerWidth, window.innerHeight);
            // });
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
    document.body.appendChild( labelRenderer.domElement );

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
    renderer.setSize(width, height);
    camera.aspect = width / height;

    camera.updateProjectionMatrix();
    labelRenderer.setSize(width, height)
}