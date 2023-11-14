import '../style/_core.scss'
import "css.gg/icons/icons.css"
import compass_service from "./modules/compass_service.js";
import pitch_service from "./modules/pitch_service.js";
import logger from "./modules/logger.js";
import location_service from "./modules/location_service.js";
import MenuBar from "./components/MenuBar.js"
import render_service from "./modules/render_service.js";
import {Euler} from "three";

document.getElementById("app").innerHTML = `
<div class="debug-overlay">
    Compass: <pre data-ref="compassData"></pre>
    <hr/>
    CompassABS: <pre data-ref="compassData2"></pre>
    <hr/>
    GPS: <pre data-ref="gpsData"></pre>
    <hr/>
    Gravity: <pre data-ref="gravityData"></pre>
    <hr/>
    FPS: <pre data-ref="fpsData"></pre>
</div>
<menu-bar data-ref="menu-bar"></menu-bar>
`;
let output_gps = document.querySelector("[data-ref=gpsData]");
let output_compass = document.querySelector("[data-ref=compassData]");
let output_gravity = document.querySelector("[data-ref=gravityData]");
let output_fps = document.querySelector("[data-ref=fpsData]");
let menu_bar = document.querySelector("[data-ref=menu-bar]");
menu_bar.addEventListener("action-button", Initialise_Modules);
logger.setLogLevel("ERROR");
customElements.define("menu-bar", MenuBar);
let lastFrame = 0;

(function draw() {
    if (compass_service.getOrientation()) {
        let euler = compass_service.getOrientation().getScreenAdjustedEuler();
        output_compass.textContent =  `alpha: ${Math.round( euler.alpha*100)/100}\n`;
        output_compass.textContent += `beta : ${Math.round(euler.beta*100)/100}\n`;
        output_compass.textContent += `gamma: ${Math.round(euler.gamma*100)/100}\n`;
    }

    if (pitch_service.getOrientation()) {
        let euler = pitch_service.getOrientation().euler;
        output_gravity.textContent =  `alpha: ${Math.round(euler.alpha*100)/100}\n`;
        output_gravity.textContent += `beta : ${Math.round(euler.beta*100)/100}\n`;
        output_gravity.textContent += `gamma: ${Math.round(euler.gamma*100)/100}\n`;
    }

    if (location_service.getLocation()) {
        let location = location_service.getLocation();
        output_gps.textContent =  `Loc: ${location.coords.latitude}/${location.coords.longitude}\n`;
        output_gps.textContent += `Alt: ${location.coords.altitude}m\n`;
        output_gps.textContent += `Acc: ${Math.round(location.coords.accuracy*100)/100}m/${Math.round(
            location.coords.altitudeAccuracy*100)/100}m`;
    }
    render_service.animate();
    render_service.setCamera({x:0,y:0,z:5},new Euler(0,0,Math.sin(Date.now()/1000), 'XYZ'));
    output_fps.textContent = Math.round(1000/(Date.now()-lastFrame) * 10) / 10;
    lastFrame = Date.now();

    // Execute function on each browser animation frame
    requestAnimationFrame(draw);

})();


function Initialise_Modules() {
    compass_service.initHandlers();
    pitch_service.initHandlers();
    location_service.initHandlers();
    document.getElementById("app").appendChild(render_service.initialize());
}
