// vite.config.js / vite.config.ts
import VitePluginBrowserSync from 'vite-plugin-browser-sync'

export default {
    plugins: [VitePluginBrowserSync()],
    build: {
        rollupOptions: {
            input: {
                app: './index.html',
                'geo-worker': './js/modules/geo_worker.js'
            },
            output: {
                entryFileNames: assetInfo => {
                    return assetInfo.name === 'geo-worker'
                        ? '[name].js'                  // put service worker in root
                        : 'assets/js/[name]-[hash].js' // others in `assets/js/`
                }
            }
        }
    }
}
