import '../style/_core.scss'
import "css.gg/icons/icons.css"
import compass_service from "./modules/compass_service.js";
import pitch_service from "./modules/pitch_service.js";
import logger from "./modules/logger.js";
import location_service from "./modules/location_service.js";
import MenuBar from "./components/MenuBar.js"

document.getElementById("app").innerHTML = `
Compass: <pre id="compassData"></pre>
<hr/>
CompassABS: <pre id="compassData2"></pre>
<hr/>
GPS: <code id="gpsData"></code>
<hr/>
Gravity: <pre id="gravityData"></pre>
<button id="btn">Start</button>
<menu-bar></menu-bar>
`;
let output_gps = document.getElementById("gpsData");
let output_compass = document.getElementById("compassData");
// let output_compass2 = document.getElementById("compassData2");
let output_gravity = document.getElementById("gravityData");
let btn = document.getElementById("btn");
btn.onclick = Initialise_Modules;
logger.setLogLevel("ERROR");
customElements.define("menu-bar", MenuBar);

(function draw() {
    if (compass_service.getOrientation()) {
        let euler = compass_service.getOrientation().getScreenAdjustedEuler();
        output_compass.textContent =  `alpha: ${Math.round( euler.alpha)}\n`;
        output_compass.textContent += `beta : ${Math.round(euler.beta)}\n`;
        output_compass.textContent += `gamma: ${Math.round(euler.gamma)}\n`;
    }

    if (pitch_service.getOrientation()) {
        let euler = pitch_service.getOrientation().euler;
        output_gravity.textContent =  `alpha: ${Math.round(euler.alpha)}\n`;
        output_gravity.textContent += `beta : ${Math.round(euler.beta)}\n`;
        output_gravity.textContent += `gamma: ${Math.round(euler.gamma)}\n`;
    }

    if (location_service.getLocation()) {
        let location = location_service.getLocation();
        output_gps.textContent = `${location.coords.latitude}/${location.coords.longitude}`;
    }

    // Execute function on each browser animation frame
    requestAnimationFrame(draw);

})();


function Initialise_Modules() {
    compass_service.initHandlers();
    pitch_service.initHandlers();
    location_service.initHandlers();
}
