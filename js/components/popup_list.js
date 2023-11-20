
export default class extends HTMLElement  {
    static observedAttributes = ["open"];
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML += `
        <div class="container">
            <div class="content">
            TEST TEST
            </div>
        </div>
    `;
        const cont = this.querySelector(".content");
        for (let child of this.children) {
            if (!child.classList.contains("container")) {
                cont.appendChild(child.cloneNode(true));
                this.removeChild(child);
            }
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        let cntnr = this.querySelector(".container");
        if (name === "open" && newValue !== null) {
            cntnr.classList.add("open")
            let pos = this.getAttribute("pos").split(",");
            cntnr.style.top = (pos[1] - cntnr.offsetHeight) + "px";
            cntnr.style.left = (pos[0] - cntnr.offsetWidth) + "px";
        } else {
            cntnr.classList.remove("open")
        }
    }
}