import '../style/_core.scss'
import "css.gg/icons/icons.css"
import compass_service from "./modules/compass_service.js";
import pitch_service from "./modules/pitch_service.js";
import logger from "./modules/logger.js";
import location_service from "./modules/location_service.js";
import MenuBar from "./components/MenuBar.js"
import render_service from "./modules/render_service.js";
import lower_card from "./components/lower_card.js";
import popup_list from "./components/popup_list.js";
import {FloatType, Quaternion} from "three";
import geo_service from "./modules/geo_service.js";
import {isIOS} from "./modules/util.js";

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
    Rendering: <pre data-ref="fpsData"></pre>
    <canvas width="3601" height="3601" style="width: 30vw;" id="tile_debug"></canvas>
</div>
<menu-bar data-ref="menu-bar"></menu-bar>
<lower-card data-ref="lower-card">
    <div class="placeholder">More Coming Soon!</div>
</lower-card>
<popup-list data-ref="more-popup" pos="0,0">
<ul>
<li>Credits</li>
<li>Tourist Board</li>
</ul>
</popup-list>
`;
let output_gps = document.querySelector("[data-ref=gpsData]");
let output_compass = document.querySelector("[data-ref=compassData]");
let output_gravity = document.querySelector("[data-ref=gravityData]");
let output_fps = document.querySelector("[data-ref=fpsData]");
let menu_bar = document.querySelector("[data-ref=menu-bar]");
let lower_cardEl = document.querySelector("[data-ref=lower-card]");
let more_popup = document.querySelector("[data-ref=more-popup]");
let last_canvas = undefined;
menu_bar.addEventListener("action-button", Initialise_Modules);
lower_cardEl.addEventListener("close", Initialise_Modules);
menu_bar.addEventListener("button-click", (a)=>{
    if (a.detail.el.getAttribute("data-ref") !== "moreButton") {
        menu_bar.setAttribute("open", "")
        lower_cardEl.setAttribute("open", "")
    } else {
        more_popup.setAttribute("pos", `${a.detail.ev.pageX},${a.detail.ev.pageY}`)
        more_popup.setAttribute("open", "");
    }
});
logger.setLogLevel("ERROR");
customElements.define("menu-bar", MenuBar);
customElements.define("lower-card", lower_card);
customElements.define("popup-list", popup_list);
let lastFrame = 0;

// Add a click event listener to the document
document.addEventListener('click', function (event) {
    // Check if the clicked element is not inside the div
    if (more_popup.hasAttribute("open") && !more_popup.contains(event.target) && event.target !== more_popup) {
        if (`${event.pageX},${event.pageY}` !== more_popup.getAttribute("pos"))
            more_popup.removeAttribute("open");
    }
});

document.addEventListener("resize", ()=>{
    render_service.setSize(window.innerWidth, window.innerHeight);
});
screen.orientation.addEventListener("change", () =>{
    render_service.setSize(window.innerWidth, window.innerHeight);
});

let lastRenderPoint = [Number.MAX_VALUE,Number.MAX_VALUE];

(function draw() {
    if (compass_service.getOrientation()) {
        let euler = compass_service.getOrientation().getScreenAdjustedEuler();
        let quat = compass_service.getOrientation().getScreenAdjustedQuaternion()
        output_compass.textContent =  `alpha: ${Math.round( euler.alpha*100)/100}\n`;
        output_compass.textContent += `beta : ${Math.round(euler.beta*100)/100}\n`;
        output_compass.textContent += `gamma: ${Math.round(euler.gamma*100)/100}\n`;
        if (!isIOS) {
            switch (screen.orientation.type) {
                case "portrait-primary":
                case "portrait-secondary":
                    quat.rotateZ(Math.PI/2);
                    break;
                case "landscape-primary":
                case "landscape-secondary":
                    quat.rotateZ(-Math.PI/2);
                    break;
            }
        }
        render_service.setCameraRotation(new Quaternion(quat.x, quat.y, quat.z, quat.w));
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

        let [x,y] = geo_service.gps2XY(location.coords.latitude, location.coords.longitude);
        render_service.setCameraPosition({x:x,y:y,z:100})

        geo_service.update([location.coords.latitude, location.coords.longitude]);
    }
    render_service.animate();
    output_fps.textContent = `${Math.round(1000/(Date.now()-lastFrame) * 10) / 10} FPS`;
    lastFrame = Date.now();

    // Execute function on each browser animation frame
    requestAnimationFrame(draw);

})();


function Initialise_Modules() {
    menu_bar.removeAttribute("open");
    lower_cardEl.removeAttribute("open");
    compass_service.initHandlers();
    pitch_service.initHandlers();
    geo_service.initialize();
    location_service.initHandlers();
    if (last_canvas !== undefined)
        document.getElementById("app").removeChild(last_canvas);
    last_canvas = document.getElementById("app").appendChild(render_service.initialize());
}
