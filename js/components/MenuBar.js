export default class extends HTMLElement  {
    static observedAttributes = ["open"];
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "open" && newValue !== null) {
            this.querySelector(".container").classList.add("open")
        } else {
            this.querySelector(".container").classList.remove("open")
        }
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
        <img alt="a" src="https://img.icons8.com/F8F1FF/ios/64/mountain.png"/>
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
        this.querySelector("[data-ref=primaryButton]").addEventListener('click', () => {
            // Emit a custom event named 'customButtonClick'
            const event = new CustomEvent('action-button', {
                bubbles: true,
                detail: { }
            });
            // Dispatch the custom event from the custom element
            this.dispatchEvent(event);
        });
        this.querySelectorAll(".button:not(.button-large)").forEach((el)=>{
            el.addEventListener('click', (e) => {
                // Emit a custom event named 'customButtonClick'
                const event = new CustomEvent('button-click', {
                    bubbles: true,
                    detail: {el:el,ev:e}
                });
                // Dispatch the custom event from the custom element
                this.dispatchEvent(event);
            });
        });
    }
}