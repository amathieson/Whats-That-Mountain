import "@hughsk/fulltilt/dist/fulltilt.js"
import "./logger.js"
import logger from "./logger.js";
export default {
    initHandlers,
    getOrientation,
    getAdjustedQuat,
    set_heading_offset: (off)=>{headingOffset = off}
}
let headingOffset = 0;
let deviceOrientation;
function initHandlers() {
    logger.log("Starting Compass Service", "compass_service");
    try {
        DeviceOrientationEvent.requestPermission().then(()=>{

            FULLTILT.getDeviceOrientation({'type': 'world'})
                .then(function(controller) {
                    deviceOrientation = controller;
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
    let quat = deviceOrientation.getScreenAdjustedQuaternion();
    quat.rotateY(headingOffset*RAD);
    return quat;
}



