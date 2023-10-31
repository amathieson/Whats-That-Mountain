import "../../bower_components/fulltilt/dist/fulltilt.js"
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