export default class extends HTMLElement  {
    connectedCallback() {
        // for (const element of this.children[1].childNodes) {
        //
        // }
    }
    constructor() {
        super();
        this.innerHTML = `
<style>
menu-bar > .container {
    background: red;
    z-index: 5;
    width: 100vw;
    top: calc(100% - 48pt);
    height: 48pt;
    position: absolute;
    left: 0;
    display: flex;
    justify-content: space-evenly;
}
menu-bar > .container > .button {
    display: grid;
    max-width: 25vw;
    grid-template-rows: 50% 20%;
    justify-items: center;
    align-content: center;
    opacity: 1;
    transition: background-color 50ms ease-out;
    background: red;
    padding: 2pt 1em;
    cursor: pointer;
}
menu-bar > .container > .button-large > img {
    max-height: min(48pt, 10vw);
    width: min(48pt, 10vw);
    aspect-ratio: 1;
    border-radius: 50%;
    background: blue;
    position: absolute;
    z-index: 6;
    bottom: 1.5em;
    padding: 1em;
}
menu-bar > .container > .button > span {
    font-size: 12pt;
    height: 12pt;
}
menu-bar > .container > .button > i {
        align-self: center;
        margin-bottom: 5pt;
}

menu-bar > .container > .button:hover:not(.button-large) {
    background: rgba(204,0,0);
}
menu-bar > .container > .button:active:not(.button-large) {
    background: rgba(230,0,0);
}
</style>
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