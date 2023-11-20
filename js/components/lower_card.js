
export default class extends HTMLElement  {
    static observedAttributes = ["open"];
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML += `
        <div class="lower-card container">
        </div>
        <div class="lower-card cover"></div>
    `;
        const cont = this.querySelector(".container");
        for (let child of this.children) {
            if (!child.classList.contains("container") && !child.classList.contains("cover")) {
                cont.appendChild(child.cloneNode(true));
                this.removeChild(child);
            }
        }

        this.querySelector(".cover").addEventListener('click', () => {
            // Emit a custom event named 'customButtonClick'
            const event = new CustomEvent('close', {
                bubbles: true,
                detail: { }
            });
            // Dispatch the custom event from the custom element
            this.dispatchEvent(event);
        });
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