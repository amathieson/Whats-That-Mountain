import { Router } from 'itty-router';
import { createCors } from 'itty-cors'
import { Ai } from '@cloudflare/ai';

const { preflight, corsify } = createCors({
	origins: ['*'],
	methods: ['GET', 'POST', 'PATCH', 'DELETE'],
	maxAge: 864000,
	headers: {
		"cache-control": "public, max-age=864000",
	}
})

// now let's create a router (note the lack of "new")
const router = Router();

router.all('*', preflight)

router.get('/api/wiki/:id', async (request, extras) => {
	let wikidata = await (await fetch(`https://www.wikidata.org/w/rest.php/wikibase/v0/entities/items/${request.params.id}`, {headers: {"User-Agent":"Whats-That-Mountain Proxy"}})).json()
	let wikipage = null;
	let wikiimage = null;
	if (Object.keys(wikidata.sitelinks).length > 0) {
		if (wikidata.sitelinks.enwiki)
			wikipage = await (await fetch(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts|pageimages&exintro&explaintext&redirects=1&pilicense=free&piprop=original|name&indexpageids&titles=${encodeURI(wikidata.sitelinks.enwiki.title)}`, {headers: {"User-Agent":"Whats-That-Mountain Proxy"}})).json()
		else {
			let or = (new URL(wikidata.sitelinks[Object.keys(wikidata.sitelinks)[0]].url)).origin
			wikipage = await (await fetch(`${or}/w/api.php?format=json&action=query&prop=extracts|pageimages&exintro&explaintext&redirects=1&pilicense=free&piprop=original|name&indexpageids&titles=${encodeURI(wikidata.sitelinks[Object.keys(wikidata.sitelinks)[0]].title)}`, {headers: {"User-Agent":"Whats-That-Mountain Proxy"}})).json()

			const ai = new Ai(extras.AI);

			wikipage.query.pages[wikipage.query.pageids[0]].extract = ((await ai.run('@cf/meta/llama-2-7b-chat-int8', {
					prompt: "translate the following into english, Please start the reply with 'Article Translated by Cloudflare Workers AI & Meta's Llama2 Model', reply with only the translation: " + wikipage?.query.pages[wikipage.query.pageids[0]].extract
				}
			)).response);

		}
		console.log(wikipage)
	}
	if (wikipage && wikipage.query.pageids && wikipage.query.pages[wikipage.query.pageids[0]] && wikipage.query.pages[wikipage.query.pageids[0]].pageimage) {
		wikiimage = await (await fetch(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts|imageinfo&iilimit=50&iiprop=timestamp|user|url|parsedcomment|commonmetadata&explaintext&redirects=1&titles=File:${encodeURI(wikipage.query.pages[wikipage.query.pageids[0]].pageimage)}`, {headers: {"User-Agent":"Whats-That-Mountain Proxy"}})).json()
		console.log("D")
	}

	let res = new Response(JSON.stringify({
		id: wikidata.id,
		title: wikidata.labels.en ? wikidata.labels.en : wikidata.labels[Object.keys(wikidata.labels)[0]],
		subtitle: wikidata.descriptions.en ? wikidata.descriptions.en : wikidata.descriptions[Object.keys(wikidata.descriptions)[0]],
		link: wikidata.sitelinks.enwiki ? wikidata.sitelinks.enwiki : wikidata.sitelinks[Object.keys(wikidata.sitelinks)[0]],
		paragraph: wikipage?.query.pages[wikipage.query.pageids[0]].extract,
		image: {
			url: wikipage?.query.pages[wikipage.query.pageids[0]]?.original?.source,
			author: wikiimage?.query.pages['-1']?.imageinfo[0].user,
			commons: wikiimage?.query.pages['-1']?.imageinfo[0].descriptionshorturl
		}
	}));
	res.headers.set('content-type', "application/json");
	res.headers.set('X-Intended-For', "What's That Mountain App");

	return res;
});

// 404 for everything else
router.all('*', () => new Response('Not Found.', { status: 404 }));

export default {
	fetch: (...args) => router
		.handle(...args)
		// embed corsify downstream to attach CORS headers
		.then(corsify)
}
