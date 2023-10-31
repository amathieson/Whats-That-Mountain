export default class extends HTMLElement  {
    connectedCallback() {
        // this.innerHTML = "<b>I'm an x-foo-with-markup!</b>";
    }
    constructor() {
        super();
        this.innerHTML = `
<style>
menu-bar > .container {
    background: red;
    z-index: 5;
    width: 100vw;
    top: calc(100vh - 48pt);
    height: 48pt;
    position: absolute;
    left: 0;
    display: flex;
    justify-content: space-evenly;
}
menu-bar > .container > .button {
display: flex;
flex-direction: column;
max-width: 25vw;
align-items: center;
gap: 2pt;
margin: 2pt;
}
menu-bar > .container > .button > img {
    max-height: 24pt;
    width: 24pt;
    aspect-ratio: 1;
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
        <img alt="a" src="https://img.icons8.com/ffffff/ios/50/networking-manager.png"/>
        <span>Title Title</span>
    </div>
    <div class="button">
        <img alt="a" src="https://img.icons8.com/ffffff/ios/50/networking-manager.png"/>
        <span>Title Title</span>
    </div>
    <div class="button button-large">
        <img alt="a" src="https://img.icons8.com/ffffff/ios/50/networking-manager.png"/>
    </div>
    <div class="button">
        <img alt="a" src="https://img.icons8.com/ffffff/ios/50/networking-manager.png"/>
        <span>Title Title</span>
    </div>
    <div class="button">
        <img alt="a" src="https://img.icons8.com/ffffff/ios/50/networking-manager.png"/>
        <span>Title Title</span>
    </div>
</div>
`;
    }
}