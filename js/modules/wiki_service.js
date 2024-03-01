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

    return await (await fetch(`https://wtm-wiki-proxy.adam-0c5.workers.dev/api/wiki/${id}`)).json()
}