export default class extends HTMLElement  {
    static observedAttributes = ["open"];
    constructor() {
        super();
        this.innerHTML = `
<div class="container">
</div>
<div class="cover"></div>
`;
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "open" && newValue !== null) {
            this.querySelector(".container").classList.add("open")
            this.querySelector(".cover").classList.add("open")
        } else {
            this.querySelector(".container").classList.remove("open")
            this.querySelector(".cover").classList.remove("open")
        }
    }
}