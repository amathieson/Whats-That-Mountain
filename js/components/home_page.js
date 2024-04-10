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

<div class="modal-container" data-ref="authorise-modal">
    <modal>
        <h1>Location Access</h1>
        To use this app location services and compass services are required, please tap authorise to continue.
        <div class="button-group">
            <button>Cancel</button>
            <button data-ref="authorise-button">Authorise</button>
        </div>
    </modal>
</div>

<div class="modal-container" data-ref="calibrate-modal">
    <modal>
        <h1>Compass Calibration</h1>
        Your device does not appear to contain a magnetic compass. Please tap Calibrate to continue.
        <div class="button-group">
<!--            <button>Cancel</button>-->
            <button data-ref="calibrate-button">Calibrate</button>
        </div>
    </modal>
</div>

<div class="modal-container" data-ref="user-test-modal">
    <modal>
        <h1>User Testing</h1>
Are you currently participating in a User Testing Survey provided by the project's developer?
        <div class="button-group">
            <button data-ref="user-test-cancel">No</button>
            <button data-ref="user-test-button">Yes</button>
        </div>
    </modal>
</div>

<div class="label-container">
    <section data-ref="label-container"></section>
</div>

<menu-bar data-ref="menu-bar"></menu-bar>

<lower-card data-ref="lower-card">
</lower-card>

<popup-list data-ref="more-popup" pos="0,0">
    <ul>
        <li>Credits</li> <!--Might need to add a modal for this-->
        <li><a href="https://visitdundee.com/" target="_blank">Tourism Board</a></li>
    </ul>
</popup-list>

<div class="loading-scroller">
    Loading Tile..
</div>

<div class="error-modal" onclick="this.removeAttribute('visible')">
</div>
`
}