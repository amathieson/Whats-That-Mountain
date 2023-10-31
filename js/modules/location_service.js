import "./logger.js"
import logger from "./logger.js";
export default {
    initHandlers,
    getLocation,
}
let deviceLocation;
function initHandlers() {
    logger.log("Starting Location Service", "location_service");
    function success(position) {
        deviceLocation = position;
    }
    function error() {
        logger.error("Unable to locate device.", "location_service");
    }

    if (!navigator.geolocation) {
        logger.error("Geolocation is not supported by your browser", "location_service");
    } else {
        navigator.geolocation.getCurrentPosition(success, error);
    }
}

function getLocation() {
    return deviceLocation;
}