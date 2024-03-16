import '../style/_core.scss'
import "css.gg/icons/icons.css"
import compass_service from "./modules/compass_service.js";
import pitch_service from "./modules/pitch_service.js";
import logger from "./modules/logger.js";
import location_service from "./modules/location_service.js";
import lower_card_service from "./modules/lower_card_service.js";
import MenuBar from "./components/MenuBar.js"
import render_service from "./modules/render_service.js";
import lower_card from "./components/lower_card.js";
import popup_list from "./components/popup_list.js";
import {Quaternion} from "three";
import geo_service from "./modules/geo_service.js";
import {isiPad, toTitleCase} from "./modules/util.js";
import home_page from "./components/home_page.js";
import calibrate_page from "./components/calibrate_page.js";

document.getElementById("app").innerHTML = home_page.content;
document.getElementById("app").innerHTML += calibrate_page.content;
let output_gps = document.querySelector("[data-ref=gpsData]");
let output_compass = document.querySelector("[data-ref=compassData]");
let output_compass2 = document.querySelector("[data-ref=compassData2]");
let output_gravity = document.querySelector("[data-ref=gravityData]");
let output_fps = document.querySelector("[data-ref=fpsData]");
let menu_bar = document.querySelector("[data-ref=menu-bar]");
let lower_cardEl = document.querySelector("[data-ref=lower-card]");
let more_popup = document.querySelector("[data-ref=more-popup]");
let authorise_button = document.querySelector("[data-ref=authorise-button]");
authorise_button.addEventListener("click", Initialise_Modules);
let calibrate_button = document.querySelector("[data-ref=calibrate-button]");
let calibrating = false;
calibrate_button.addEventListener("click", ()=>{
    calibrating = true;
    calibrate_page.init(compass_service, location_service);
    document.querySelector(`[data-ref="calibrate-modal"]`).removeAttribute("visible");
    document.getElementsByClassName("calibrate-slider")[0].setAttribute("visible", true)
});
let last_canvas = undefined;
const debug_threshold = 1000;
let debug_clickCount = 0;
let debug_lastClickTime = 0;

let north_Calibration_factor = Number.NaN;
menu_bar.addEventListener("action-button", ()=>{

    const currentTime = new Date().getTime();

    if (currentTime - debug_lastClickTime < debug_threshold) {
        debug_clickCount++;

        if (debug_clickCount === 5) {
            // Button clicked 5 times in short succession
            document.getElementsByClassName("debug-overlay")[0].toggleAttribute("visible");
        }
    } else {
        // Reset the count if the time gap is longer than the threshold
        debug_clickCount = 1;
        handleMainClick();
    }

    // Update the last click time
    debug_lastClickTime = currentTime;
});
lower_cardEl.addEventListener("close", handleMainClick);
menu_bar.addEventListener("button-click", (a)=>{
    lower_card_service.page_transition('list', [{title:"Hi"}])
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
const BYPASS_CALIBRATE = false;
(function draw() {
    if (compass_service.getOrientation()) {
        let euler = compass_service.getOrientation().getScreenAdjustedEuler();
        let quat = compass_service.getAdjustedQuat()
        output_compass.textContent =  `alpha: ${Math.round( euler.alpha*100)/100}\n`;
        output_compass.textContent += `beta : ${Math.round(euler.beta*100)/100}\n`;
        output_compass.textContent += `gamma: ${Math.round(euler.gamma*100)/100}\n`;
        output_compass.textContent += `offsets: ${JSON.stringify(compass_service.getOffsets())}\n`;
        if (!isiPad) {
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
        if (!compass_service.getOrientation().isAbsolute() || north_Calibration_factor === Number.NaN) {
            let ev = compass_service.getOrientation().getLastRawEventData();
            output_compass2.textContent = `Head: ${ev.webkitCompassHeading}&degree;\nacc:${ev.webkitCompassAccuracy}`
            if (ev.webkitCompassHeading && ev.webkitCompassAccuracy < 20) {
            //     console.log(`I HAVE A COMPASS!!!!!! ${ev.webkitCompassHeading} : ${ev.webkitCompassAccuracy}`)
            } else {
                if (!BYPASS_CALIBRATE && !calibrating) {
                    document.querySelector(`[data-ref="calibrate-modal"]`).setAttribute("visible", "true");
                }
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
        render_service.setCameraPosition({x:x,y:y,z:500})


        geo_service.update([location.coords.latitude, location.coords.longitude]);
    }
    render_service.animate();
    let objs = render_service.visibleObjects();
    output_fps.textContent = `${Math.round(1000/(Date.now()-lastFrame) * 10) / 10} FPS\n${objs !== undefined ? objs.length : 0} Objects`;
    lastFrame = Date.now();

    // Execute function on each browser animation frame
    requestAnimationFrame(draw);

})();

const MAX_POINTS = 5000; // Soft limit for the number of visible objects

function handleMainClick() {
    if (menu_bar.hasAttribute("open")) {
        menu_bar.removeAttribute("open");
        lower_cardEl.removeAttribute("open");
    } else {
        let objects = render_service.visibleObjects();
        if (objects !== undefined) {
            if (objects.length > 0) {
                if (objects.length < MAX_POINTS) {
                    let list = objects.map((ob)=>{
                        if (!ob.userData.tags.name)
                            return null
                        const dist = location_service.dist2point(ob.userData.location.lat, ob.userData.location.lon);
                        return {
                            title: `${toTitleCase(ob.userData.tags?.name)}${(ob.userData.tags.ele ? (' - Altitude:' + ob.userData.tags.ele + 'm') : '')}`,
                            sub: `${toTitleCase(ob.userData.tags?.natural)} - ${Math.round(dist)}m away`,
                            id: ob.userData.id,
                            infoID: ob.userData.tags?.wikidata,
                            dist
                        }
                    }).filter(a=>a!==null).sort((ob1, ob2)=> ob1.dist - ob2.dist);
                    lower_card_service.page_transition('list', list)

                    menu_bar.setAttribute("open", "")
                    lower_cardEl.setAttribute("open", "")
                } else {
                    // alert("Too Many Objects")
                }
            } else {
                // alert("Cannot see any objects")
            }
        }
    }
}
document.querySelector(`[data-ref="authorise-modal"]`).setAttribute("visible", true);

function Initialise_Modules() {
    document.querySelector(`[data-ref="authorise-modal"]`).removeAttribute("visible");
    document.getElementsByClassName("loading-scroller")[0].setAttribute("visible", "true");
    document.getElementsByClassName("loading-scroller")[0].innerText = "Loading Tiles...";
    compass_service.initHandlers();
    pitch_service.initHandlers();
    geo_service.initialize();
    location_service.initHandlers();
    if (last_canvas !== undefined)
        document.getElementById("app").removeChild(last_canvas);
    last_canvas = document.getElementById("app").appendChild(render_service.initialize());
}
// const options = { frequency: 60, referenceFrame: "device" };
// const sensor = new AbsoluteOrientationSensor(options);
// Promise.all([
//     navigator.permissions.query({ name: "accelerometer" }),
//     navigator.permissions.query({ name: "magnetometer" }),
//     navigator.permissions.query({ name: "gyroscope" }),
// ]).then((results) => {
//     if (results.every((result) => result.state === "granted")) {
//         sensor.start();
//         console.log("Start")
//     } else {
//         console.log("No permissions to use AbsoluteOrientationSensor.");
//     }
// });
// sensor.addEventListener("error", (error) => {
//     if (event.error.name === "NotReadableError") {
//         output_compass2.textContent = ("Sensor is not available.");
//     }
// });
// sensor.addEventListener("reading", () => {
//     console.log(sensor)
//     // model is a Three.js object instantiated elsewhere.
//     output_compass2.textContent = `alpha: ${Math.round( sensor.quaternion[0]*100)/100}\n`;
//     output_compass2.textContent += `beta : ${Math.round(sensor.quaternion[1]*100)/100}\n`;
//     output_compass2.textContent += `gamma: ${Math.round(sensor.quaternion[2]*100)/100}\n`;
// });