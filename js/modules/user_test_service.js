export default  {
    init_handler
}


let session_id = "";

function init_handler() {
    fetch("https://wtm-analytics.adam-0c5.workers.dev/new_session").then((d)=>{
        d.json().then((data)=>{
            session_id = data.id;
            setInterval(()=>{
                fetch("https://wtm-analytics.adam-0c5.workers.dev/update_session/" + session_id +
                    "/?framerate=" + framerate +
                    "&user-agent=" + encodeURIComponent(navigator.userAgent) +
                    ""
                )
            }, 5000);
        })
    })
}