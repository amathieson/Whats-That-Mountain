import "./logger.js"
import logger from "./logger.js";
export default {
    initHandlers,
    getLocation,
    dist2point
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

export function dist2point(lat, lon) {
    let coords = this.getLocation().coords
    return measure(lat, lon, coords.latitude, coords.longitude);
}

// https://stackoverflow.com/a/11172685
function measure(lat1, lon1, lat2, lon2){
    const R = 6378.137; // Radius of earth in KM
    const dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    const dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    return d * 1000; // meters
}