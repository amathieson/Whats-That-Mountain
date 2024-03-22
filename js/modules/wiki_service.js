import logger from "./logger.js";
import lower_card_service from "./lower_card_service.js";
import render_service from "./render_service.js";
import location_service from "./location_service.js";
import {toTitleCase} from "./util.js";

export default {
    pull_data
}

async function pull_data(poi) {
    let id = "";
    if (poi?.tags?.wikidata) {
        id = poi?.tags?.wikidata;
    } else if (typeof poi === "string") {
        id = poi;
    } else
        throw new Error("Specified POI has no wikidata entry")
    try {
        let res = await fetch(`https://wtm-wiki-proxy.adam-0c5.workers.dev/api/wiki/${id}`)
        if (res.ok)
            return await res.json()
        else {
            logger.error(res.statusText, "WIKI_SERVICE")
            let objects = render_service.visibleObjects();
            let list = objects.map((ob)=>{
                        if (!ob.userData.tags.name)
                            return null
                        const dist = location_service.dist2point(ob.userData.location.lat, ob.userData.location.lon);
                        return {
                            title: `${toTitleCase(ob.userData.tags?.name)}${(ob.userData.tags.ele ? (' - Altitude:' + ob.userData.tags.ele + 'm') : '')}`,
                            sub: `${toTitleCase(ob.userData.tags?.natural)} - ${Math.round(dist)}m away`,
                            id: ob.userData.id,
                            infoID: ob.userData.tags?.wikidata,
                            dist
                        }
                    }).filter(a=>a!==null).sort((ob1, ob2)=> ob1.dist - ob2.dist);
            lower_card_service.page_transition("list",list)
        }
    } catch (e) {
        logger.error(e, "WIKI_SERVICE")
        let objects = render_service.visibleObjects();
        let list = objects.map((ob)=>{
                        if (!ob.userData.tags.name)
                            return null
                        const dist = location_service.dist2point(ob.userData.location.lat, ob.userData.location.lon);
                        return {
                            title: `${toTitleCase(ob.userData.tags?.name)}${(ob.userData.tags.ele ? (' - Altitude:' + ob.userData.tags.ele + 'm') : '')}`,
                            sub: `${toTitleCase(ob.userData.tags?.natural)} - ${Math.round(dist)}m away`,
                            id: ob.userData.id,
                            infoID: ob.userData.tags?.wikidata,
                            dist
                        }
                    }).filter(a=>a!==null).sort((ob1, ob2)=> ob1.dist - ob2.dist);
        lower_card_service.page_transition("list",list)
    }
}