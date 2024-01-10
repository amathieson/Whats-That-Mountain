import * as THREE from 'three';
export default {
    animate,
    initialize,
    setCamera,
    setMeshData
}
// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 100, 100000);
camera.position.z = 5;

// Create a renderer
let renderer;

// Create a plane geometry
const geometry = new THREE.PlaneGeometry(10, 10, 64, 64);

// Manipulate vertices based on your heightmap data
// Example: Set heights based on a 2D heightmap array
// const heightmap = Array.from({length: 64*64},(v, i) => 0)/* Your heightmap data */;
// for (let i = 0; i < geometry.vertices.length; i++) {
//     const height = heightmap[Math.floor(i / 65)][i % 65];
//     geometry.vertices[i].z = height;
// }

const rootStyles = getComputedStyle(document.documentElement);
const primaryColor = rootStyles.getPropertyValue('--primary-color');

// Animation/render loop
function animate() {
    if (renderer)
        renderer.render(scene, camera);
}

function setCamera(position, rotation) {
    camera.setRotationFromEuler(rotation);
    camera.position.x = position.x;
    camera.position.y = position.y;
    camera.position.z = position.z;
}

function initialize() {
    renderer = new THREE.WebGLRenderer();
    renderer.domElement.setAttribute("data-ref", "main_canvas");
    renderer.setSize(window.innerWidth, window.innerHeight);

    return renderer.domElement;
}

function setMeshData(meshs) {
    scene.clear();
    meshs.forEach((el)=>{
        scene.add(el);
    })
}