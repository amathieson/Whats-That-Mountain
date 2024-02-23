export {
    pull_data
}

async function pull_data(poi) {
    if (poi?.tags?.wikidata) {
        let wikidata = await (await fetch(`https://www.wikidata.org/w/rest.php/wikibase/v0/entities/items/${poi?.tags?.wikidata}`)).json()
        let wikipage = null;
        let wikiimage = null;
        if (wikidata.sitelinks && wikidata.sitelinks.enwiki)
            wikipage = await (await fetch(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts|pageimages&exintro&explaintext&redirects=1&pilicense=free&piprop=original|name&indexpageids&titles=${wikidata.sitelinks.enwiki.title}`)).json()
        if (wikipage && wikipage.query.pageids && wikipage.query.pages[wikipage.query.pageids[0]]) {
            wikiimage = await (await fetch(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts|imageinfo&iilimit=50&iiprop=timestamp|user|url|parsedcomment|commonmetadata&explaintext&redirects=1&titles=File:${wikipage.query.pages[wikipage.query.pageids[0]].pageimage}`)).json()

        }
        return {
            wikidata,
            wikipage,
            wikiimage
        }
    } else
        throw new Error("Specified POI has no wikidata entry")
}