export default class extends HTMLElement  {
    connectedCallback() {
        // for (const element of this.children[1].childNodes) {
        //
        // }
    }
    constructor() {
        super();
        this.innerHTML = `
<div class="container">
    <div class="button" data-ref="toursButton">
        <i class="gg-user"></i>
        <span>Tours</span>
    </div>
    <div class="button" data-ref="trailsButton">
        <i class="gg-attribution"></i>
        <span>Trails</span>
    </div>
    <div class="button button-large" data-ref="primaryButton">
        <img alt="a" src="https://img.icons8.com/ffffff/ios/50/mountain.png"/>
    </div>
    <div class="button" data-ref="pinsButton">
        <i class="gg-pin"></i>
        <span>Pins</span>
    </div>
    <div class="button" data-ref="moreButton">
        <i class="gg-more"></i>
        <span>More</span>
    </div>
</div>
`;
    }
}