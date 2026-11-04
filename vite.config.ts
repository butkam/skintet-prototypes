import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Static copies of live skintet.com pages in public/<slug>/ (e.g. Skin(ID) result):
// in dev, serve their index.html instead of falling back to the Vue app
const staticPages = ['skin-id']

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'static-pages',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const path = req.url?.split('?')[0]
          const slug = staticPages.find((s) => path === `/${s}` || path === `/${s}/`)
          if (!slug) return next()
          if (path === `/${slug}`) {
            res.writeHead(301, { Location: `/${slug}/` })
            return res.end()
          }
          req.url = `/${slug}/index.html`
          next()
        })
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
