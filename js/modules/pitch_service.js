import "./logger.js"
import logger from "./logger.js";
export default {
    initHandlers,
    getOrientation,
    getPitch,
    get_gravity_support: ()=>{return gravity_support}
}
let deviceOrientation;
let gravity_support = false;
function initHandlers() {
    logger.log("Starting Pitch Service", "pitch_service");
    try {
        let gravitySensor = new GravitySensor({frequency: 60});

        gravitySensor.addEventListener("reading", (_) => {
            gravity_support = true;
            deviceOrientation = {
                euler: {
                    alpha: gravitySensor.x,
                    beta: gravitySensor.y,
                    gamma: gravitySensor.z
                }
            }
        });

        gravitySensor.start();
    } catch (e) {
        logger.warn(e.message, "pitch_service")
    }
}

// Deprecated Getter
function getOrientation() {
    logger.warn("getOrientation is deprecated, use getPitch from pitch_service", "pitch_service")
    return deviceOrientation;
}

function getPitch() {
    return 0.0;
}