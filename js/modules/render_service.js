import * as THREE from 'three';
import {Vector3} from "three";
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
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 100, 100000);

// Create a renderer
let renderer;

const rootStyles = getComputedStyle(document.documentElement);
const primaryColor = rootStyles.getPropertyValue('--primary-color');

// Animation/render loop
function animate() {
    if (renderer) {
        renderer.render(scene, camera);

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
    renderer = new THREE.WebGLRenderer();
    renderer.domElement.setAttribute("data-ref", "main_canvas");
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = false;
    renderer.domElement.addEventListener("touchstart", (e)=> {
        if (e.touches.length === 2) {
            pinching = true;
            dist = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY)
        }
    })
    renderer.domElement.addEventListener("touchmove", (e) =>{
        if (pinching) {
            let d = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY)
            let frac = (dist / d);
            if (frac < 1)
                camera.setFocalLength(camera.getFocalLength() + (1-frac)*15);
            else
                camera.setFocalLength(Math.max(5, camera.getFocalLength() - (frac)/1.3));

            dist = d;
        }
    })
    renderer.domElement.addEventListener("touchend", ()=>{
        pinching = false;
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
}