export default {
    page_transition
}
import wiki_service from "./wiki_service.js";

let last_page = null;
let last_page_type = null;
const info_card_template = `<div data-ref="info-card">
        <section>
            <h1>{{title}}</h1>
            <sub>{{type}}</sub>
        </section>
        <p>{{description}}</p>
        <img src="{{image}}" alt="{{alt}}">
        <footer>Information collected from <a href="{{src}}">Wikipedia</a></footer>
    </div>`

const list_view_template = `<div data-ref="list-view">
        <ul>
            {{list}}
        </ul>
    </div>`

const list_item_template = `<li data-id="{{id}}" data-infoID="{{infoID}}">
                <h1>{{title}}</h1>
                <sub>{{sub}}</sub>
                <div class="chevron">
                    <i class="gg-chevron-right"></i>
                </div>
            </li>`
String.prototype.fill_template = fill_template;
function fill_template(obj) {
    let st = this;
    st = st.replace(/{{(.*?)}}/g, (match, key) => {
        return obj[key] || match; // Replace with value if found, otherwise keep the placeholder
    });
    return st;
}

function load_info_card(ev) {
    let el = ev.target;
    if (ev.target.nodeName !== "li")
        el = ev.target.parentElement;
    wiki_service.pull_data(el.getAttribute("data-infoID")).then((data)=>{
        console.log(data);
    });
}

function page_transition(page, data) {
    switch (page) {
        case "list":
            document.querySelector("[data-ref='lower-card']>div").innerHTML = list_view_template.fill_template({
                list: (data.map(dict=>list_item_template.fill_template(dict)).join(''))
            })
            document.querySelectorAll("[data-infoID]").forEach((el)=>{
                if (el.getAttribute("data-infoID") === "{{infoID}}")
                    return
                el.addEventListener("click", (ev)=>load_info_card(ev))
            })
            break;
        case "wiki":
            document.querySelector("[data-ref='lower-card']>div").innerHTML = info_card_template.fill_template(data)
            break;
    }
}