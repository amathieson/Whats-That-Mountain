export default {
    error,
    warn,
    log,
    setLogLevel
}

let logLevel = 0;
const levels = {
    "VERBOSE":0,
    "WARN"   :1,
    "ERROR"  :2,
};

function error(message, module="") {
    if (logLevel <= 2) {
        console.error(`[${module}] - `, message);
        document.querySelector(".error-modal").innerText = `[${module}] ` + ((typeof message === 'string' || message instanceof String) ? message :
            (message.message ? message.message : JSON.stringify(message)));
        document.querySelector(".error-modal").setAttribute("visible", "true")
    }
}

function warn(message, module="") {
    if (logLevel <= 1)
        console.warn(`[${module}] - `, message);
}

function log(message, module="") {
    if (logLevel <= 0)
        console.log(`[${module}] - `, message);
}

function setLogLevel(level = "VERBOSE") {
    logLevel = levels[level];
}