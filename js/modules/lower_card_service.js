export default {

}

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
                <div class="chevron">
                    <i class="gg-chevron-right"></i>
                </div>
            </li>`
String.prototype.fill_template = fill_template;
function fill_template(obj) {
    this.replace(/{{(.*?)}}/g, (match, key) => {
        return obj[key] || match; // Replace with value if found, otherwise keep the placeholder
    });
}