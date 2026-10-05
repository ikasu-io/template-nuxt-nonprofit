// Sallow River Alliance — Nuxt configuration. Content lives in content/
// (see content.config.ts); this file only wires the modules together.
export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },
  // Styles go into each page's HTML instead of separate CSS files, so the
  // first paint does not wait for extra requests.
  features: { inlineStyles: true },
  vite: { build: { cssCodeSplit: false } },
  modules: ['@nuxt/content', '@nuxt/image', '~~/modules/check-content'],
  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'en-US' },
      titleTemplate: '%s · Sallow River Alliance',
      meta: [{ name: 'theme-color', content: '#F6F3EC' }],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/newsreader-latin-wght-normal.woff2', crossorigin: '' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/public-sans-latin-wght-normal.woff2', crossorigin: '' },
      ],
    },
  },

  content: {
    // Node's built-in SQLite: no native module to compile on install.
    experimental: { sqliteConnector: 'native' },
  },

  // Photos in public/images/ are converted to WebP in several widths when
  // the site is generated.
  image: {
    format: ['webp'],
    densities: [1, 2],
    screens: { sm: 480, md: 800, lg: 1200, xl: 1600 },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/sitemap.xml', '/robots.txt'],
      failOnError: true,
    },
  },
})
