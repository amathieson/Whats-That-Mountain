export default {
    page_transition
}
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

const list_item_template = `<li data-id="{{id}}">
                <h1>{{title}}</h1>
                <sub>{{sub}}</sub>
                <div class="chevron" data-infoID="{{infoID}}">
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

function page_transition(page, data) {
    switch (page) {
        case "list":
            document.querySelector("[data-ref='lower-card']>div").innerHTML = list_view_template.fill_template({
                list: (data.map(dict=>list_item_template.fill_template(dict)).join(''))
            })
            break;
        case "wiki":
            document.querySelector("[data-ref='lower-card']>div").innerHTML = info_card_template.fill_template(data)
            break;
    }
}