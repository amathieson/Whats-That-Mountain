export default {
    content: `
<div class="debug-overlay">
    Compass: <pre data-ref="compassData"></pre>
    <hr/>
    CompassABS: <pre data-ref="compassData2"></pre>
    <hr/>
    GPS: <pre data-ref="gpsData"></pre>
    <hr/>
    Gravity: <pre data-ref="gravityData"></pre>
    <hr/>
    Rendering: <pre data-ref="fpsData"></pre>
    <canvas width="3601" height="3601" style="width: 30vw;" id="tile_debug"></canvas>
</div>
<modal>
<h1>Location Access</h1>
To use this app location services and compass services are required, please tap authorise to continue.
<button>Cancel</button>
<button>Authorise</button>
</modal>
<menu-bar data-ref="menu-bar"></menu-bar>
<lower-card data-ref="lower-card">
    <div class="placeholder">More Coming Soon!</div>
</lower-card>
<popup-list data-ref="more-popup" pos="0,0">
<ul>
<li>Credits</li>
<li>Tourist Board</li>
</ul>
</popup-list>
<div class="loading-scroller">
Loading Tile..
</div>
`
}