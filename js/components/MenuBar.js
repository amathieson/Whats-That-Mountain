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
    margin: 2pt;
    justify-items: center;
    align-content: center;
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
</style>
<div class="container">
    <div class="button">
        <i class="gg-user"></i>
        <span>Tours</span>
    </div>
    <div class="button">
        <i class="gg-attribution"></i>
        <span>Trails</span>
    </div>
    <div class="button button-large" name="PrimaryButton">
        <img alt="a" src="https://img.icons8.com/ffffff/ios/50/mountain.png"/>
    </div>
    <div class="button">
        <i class="gg-pin"></i>
        <span>Pins</span>
    </div>
    <div class="button">
        <i class="gg-more"></i>
        <span>More</span>
    </div>
</div>
`;
    }
}