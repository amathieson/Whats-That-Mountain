import apiRouter from './router';

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		if (url.pathname.startsWith('/api/')) {
				return await apiRouter.fetch(request, env, ctx);
		}

		return new Response(
			`<h1>What's That Mountain Wiki Proxy Service</h1><style>*{font-family: 'Inter var', system-ui, Avenir, Helvetica, Arial, sans-serif;}</style>`,
			{ headers: { 'Content-Type': 'text/html' } }
		);
	},
};
