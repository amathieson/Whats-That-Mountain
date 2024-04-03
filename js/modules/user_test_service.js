export default  {
    init_handler,
    update_frames: (fps) => {framerate = fps;}
}

let framerate = 0;

let session_id = "";
async function init_handler(WTM_DEPLOYMENT_ID, compass_service, location_service, pitch_service, calibrate_page) {
    document.querySelector("[data-ref=user-test-modal]>modal").innerText = `Please wait while we start a session...`

    let d = await fetch("https://wtm-analytics.adam-0c5.workers.dev/new_session")
    let data = await d.json()
    session_id = data.id;
    setInterval(()=>{
        fetch("https://wtm-analytics.adam-0c5.workers.dev/update_session/" + session_id +
            "?framerate=" + framerate +
            "&deployment" + WTM_DEPLOYMENT_ID +
            "&user-agent=" + encodeURIComponent(navigator.userAgent) +
            (compass_service.get_compass_support() ? "&sensors[]=compass" : "") +
            (location_service.get_location_support() ? "&sensors[]=location" : "") +
            (pitch_service.get_gravity_support() ? "&sensors[]=gravity" : "") +
            (calibrate_page.get_camera_support() ? "&sensors[]=camera" : "")
        )
    }, 5000);

    return session_id;
}