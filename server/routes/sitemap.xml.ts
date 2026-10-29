// /sitemap.xml, written when the site is generated: every page, project,
// story and annual report, in English and under /de/ in German.
import { queryCollection } from '@nuxt/content/server'

export default defineEventHandler(async (event) => {
  const org = await queryCollection(event, 'org').first()
  const projects = await queryCollection(event, 'projects_en').select('path').all()
  const stories = await queryCollection(event, 'stories_en').select('path', 'date').all()
  const reports = await queryCollection(event, 'reports_en').select('year').all()

  const pages = [
    { path: '/' },
    { path: '/work' },
    { path: '/volunteer' },
    { path: '/stories' },
    { path: '/about' },
    { path: '/donate' },
    ...projects.map((p) => ({ path: p.path })),
    ...stories.map((s) => ({ path: s.path, lastmod: s.date })),
    ...reports.map((r) => ({ path: `/report/${r.year}` })),
  ]
  const urls = ['', '/de']
    .flatMap((prefix) => pages.map((p) => ({ ...p, path: prefix && p.path === '/' ? prefix : prefix + p.path })))
    .map((p) => `  <url><loc>${org!.url}${p.path}</loc>${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ''}</url>`)
    .join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
})
