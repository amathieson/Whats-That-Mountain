/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx) {
		const url = (new URL(request.url));
		const path = url.pathname;
		if (path.startsWith("/new_session")) {
			let attempts = 25;
			while (attempts > 0) {
				let id = rrs(10,3).toUpperCase();
				const kvStore = await env.WTM_USER_TESTING.get(id);
				if (kvStore === null) {
					await env.WTM_USER_TESTING.put(id, JSON.stringify({
						"user_agent":"",
						"framerate":0,
						"sensors":[],
						"timestamp": Date.now()
					}));
					return new Response(JSON.stringify({id}), { status: 200, headers: {"Access-Control-Allow-Origin": "*"} });
				}
				attempts--;
			}
			return new Response("Failed to assign an id", { status: 500, headers: {"Access-Control-Allow-Origin": "*"} });

		}
		if (path.startsWith("/update_session/")) {
			const id = path.slice(16);
			const kvStore = await env.WTM_USER_TESTING.get(id);
			if (kvStore !== null) {
				let data = JSON.parse(kvStore);
				data.last_update = Date.now()
				data.user_agent = url.searchParams.get("user-agent")
				data.framerate = url.searchParams.get("framerate")
				data.sensors = url.searchParams.getAll("sensors[]")
				await env.WTM_USER_TESTING.put(id, JSON.stringify(data));
				return new Response(await env.WTM_USER_TESTING.get(id), { status: 200, headers: {"Access-Control-Allow-Origin": "*"} });
			}
			return new Response("Unknown Session", { status: 403, headers: {"Access-Control-Allow-Origin": "*"} });

		}
	},
};


// The following is the RRS lib by Arno Cl. Credits listed in credits.json

const VOWELS = [
	'a', 'an', 'ai', 'au',
	'e', 'ei', 'eu', 'en',
	'i', 'in', 'io',
	'o', 'oi', 'ou', 'on',
	'u', 'un', 'ui',
	'y'
];

const CONSONANTS = [
	'b', 'br', 'bl',
	'c', 'cr', 'ch',
	'd', 'dr',
	'f', 'ff', 'fr', 'fl',
	'g', 'gu', 'gr', 'gl', 'gn',
	'j',
	'k', 'kr',
	'l', 'll', 'lt', 'lg', 'lj', 'lk', 'lm', 'lv', 'lgu', 'lgr',
	'm', 'mm',
	'n', 'nn',
	'p', 'pr', 'ps', 'pl', 'pn', 'pp',
	'q', 'qu',
	'r', 'rt', 'rp', 'rg', 'rd', 'rq', 'rj', 'rgu', 'rgr', 'rgl', 'rgn',
	's', 'ss', 'sl',
	't', 'tr', 'tl', 'th', 'tt',
	'v', 'vr',
	'w',
	'x',
	'y',
	'z', 'zt', 'zj', 'zv'
]

const BLACKLIST = [
	'aiw',
	'eiw',
	'gni', 'guo', 'gua',
	'iow',
	'mz', 'mr', 'mt', 'mq', 'ms', 'md', 'mf', 'mg', 'mh', 'mj', 'mk', 'ml', 'mw', 'mx', 'mc', 'mv', 'mn',
	'nm', 'nw',
	'nb', 'np',
	'oiw', 'ouw', 'onw',
	'uu', 'uw', 'uiw',
	'yy'
];

// TODO: not start with same 2 consonants

const SYLLABES = [VOWELS, CONSONANTS];

const randomBetweenZeroAnd = (max) => {
	return Math.floor(Math.random() * (max + 1));
};

const uuid = (length = 4) => {
	let str = '';
	let startWith = randomBetweenZeroAnd(1);

	while (str.length < length) {
		const remainingLength = length - str.length;

		let pos = randomBetweenZeroAnd(SYLLABES[startWith].length - 1);
		let syllabe = SYLLABES[startWith][pos];

		while (syllabe.length > remainingLength) {
			let pos = randomBetweenZeroAnd(SYLLABES[startWith].length - 1);
			syllabe = SYLLABES[startWith][pos];
		}

		str += syllabe;

		startWith = (startWith + 1) % 2;
	}

	if (new RegExp(BLACKLIST.join("|")).test(str)) {
		return uuid(length);
	}

	return str;
}

const rrs = (length, separatorGap = 0) => {
	if (!separatorGap) {
		return uuid(length);
	}

	let str = '';

	while (str.length < length) {
		str += uuid(separatorGap) + '-';
	}

	return str.slice(0, length);
}
