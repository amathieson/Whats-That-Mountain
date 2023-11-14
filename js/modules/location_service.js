import "./logger.js"
import logger from "./logger.js";
export default {
    initHandlers,
    getLocation,
}
let age = 0;
let deviceLocation;
let watchID;
function initHandlers() {
    logger.log("Starting Location Service", "location_service");

    if (!navigator.geolocation) {
        logger.error("Geolocation is not supported by your browser", "location_service");
    } else {
        const options = {
            enableHighAccuracy: true,
            maximumAge: 30000,
            timeout: 27000,
        };

        watchID = navigator.geolocation.watchPosition(success, error, options);

    }
}
function success(position) {
    deviceLocation = position;
    age = Date.now();
}
function error() {
    logger.error("Unable to locate device.", "location_service");
}

function getLocation() {
    return deviceLocation;
}