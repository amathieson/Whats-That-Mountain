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
    if (logLevel <= 2)
        console.error(`[${module}] ` + ((typeof message === 'string' || message instanceof String) ? message : JSON.stringify(message)));
}

function warn(message, module="") {
    if (logLevel <= 1)
        console.warn(`[${module}] ` + ((typeof message === 'string' || message instanceof String) ? message : JSON.stringify(message)));
}

function log(message, module="") {
    if (logLevel <= 0)
        console.log(`[${module}] ` + ((typeof message === 'string' || message instanceof String) ? message : JSON.stringify(message)));
}

function setLogLevel(level = "VERBOSE") {
    logLevel = levels[level];
}