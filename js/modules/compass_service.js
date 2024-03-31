import "@hughsk/fulltilt/dist/fulltilt.js"
import "./logger.js"
import logger from "./logger.js";
export default {
    initHandlers,
    getOrientation,
    getAdjustedQuat,
    set_heading_offset: (off)=>{headingOffset = off},
    set_tilt_offset: (off)=>{tiltOffset = off},
    getOffsets: ()=>{return{headingOffset,tiltOffset}},
    getMatrix: ()=>deviceOrientation.getScreenAdjustedMatrix,
    get_compass_support: ()=>{return compass_support}
}
let headingOffset = 0;
let tiltOffset = 0;
let deviceOrientation;
let compass_support = false;
function initHandlers() {
    logger.log("Starting Compass Service", "compass_service");
    try {
        DeviceOrientationEvent.requestPermission().then(()=>{

            FULLTILT.getDeviceOrientation({'type': 'world'})
                .then(function(controller) {
                    deviceOrientation = controller;
                    compass_support = true;
                })
                .catch(function(message) {
                    logger.error(message, "compass_service");
                });
        })
    } catch (e) {
        if (e.message.indexOf("is not a function") === undefined)
            logger.error(e.message, "compass_service");

        FULLTILT.getDeviceOrientation({'type': 'world'})
            .then(function(controller) {
                deviceOrientation = controller;
                compass_support = true;
            })
            .catch(function(message) {
                logger.error(message, "compass_service");
            });
    }
}

// Deprecated Getter
function getOrientation() {
    logger.warn("getOrientation is deprecated, use getAdjustedQuat from compass_service", "compass_service")
    return deviceOrientation;
}
const RAD = Math.PI / 180

function getAdjustedQuat() {
    // Assuming deviceOrientation is your Full-Tilt object
    let quat = deviceOrientation.getScreenAdjustedQuaternion();

    // Convert headingOffset to radians if necessary
    let headingOffsetRad = headingOffset * RAD;

    let off = new FULLTILT.Quaternion();
    off.setFromEuler(new FULLTILT.Euler(0, headingOffsetRad, 0));
    // Apply heading offset
    quat = quat.multiply(off);

    off.setFromEuler(new FULLTILT.Euler(tiltOffset * RAD, 0, 0));
    // Apply heading offset
    quat = quat.multiply(off);

    // Normalize the quaternion to prevent drift
    quat.normalize();
    return quat;
}



