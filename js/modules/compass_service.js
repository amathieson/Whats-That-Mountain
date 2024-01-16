import "@hughsk/fulltilt/dist/fulltilt.js"
import "./logger.js"
import logger from "./logger.js";
export default {
    initHandlers,
    getOrientation,
    getHeading
}
let deviceOrientation;
function initHandlers() {
    logger.log("Starting Compass Service", "compass_service");
    try {
        DeviceOrientationEvent.requestPermission()
    } catch (e) {
        console.log(e);
    }
    FULLTILT.getDeviceOrientation({'type': 'world'})
        .then(function(controller) {
            deviceOrientation = controller;
        })
        .catch(function(message) {
            logger.error(message, "compass_service");
        });
}

// Deprecated Getter
function getOrientation() {
    logger.warn("getOrientation is deprecated, use getHeading from compass_service", "compass_service")
    return deviceOrientation;
}

function getHeading() {
    return 0.0;
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