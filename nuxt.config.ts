// Sallow River Alliance — Nuxt configuration. Content lives in content/
// (see content.config.ts); this file only wires the modules together.
import { readFileSync } from 'node:fs'

// The domain from content/org.yml, for the links between languages.
const siteUrl = readFileSync('content/org.yml', 'utf8').match(/^url: *(\S+)/m)![1]

export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },
  // Styles go into each page's HTML instead of separate CSS files, so the
  // first paint does not wait for extra requests.
  features: { inlineStyles: true },
  vite: { build: { cssCodeSplit: false } },
  modules: ['@nuxt/content', '@nuxt/image', '@nuxtjs/i18n', '~~/modules/check-content'],
  css: ['~/assets/css/main.css'],

  app: {
    head: {
      titleTemplate: '%s · Sallow River Alliance',
      meta: [{ name: 'theme-color', content: '#F6F3EC' }],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/newsreader-latin-wght-normal.woff2', crossorigin: '' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/public-sans-latin-wght-normal.woff2', crossorigin: '' },
      ],
    },
  },

  // English at /, German at /de/. Short texts (navigation, buttons, labels)
  // are in locales/en.json and locales/de.json, under the same key in both;
  // longer texts are in content/en/ and content/de/. app.vue sets
  // <html lang> and the links between the languages.
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'de', language: 'de-DE', name: 'Deutsch', file: 'de.json' },
    ],
    langDir: '../locales',
    baseUrl: siteUrl,
    detectBrowserLanguage: false,
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
      routes: ['/', '/de', '/sitemap.xml', '/robots.txt'],
      failOnError: true,
    },
  },
})
