// /robots.txt, pointing search engines at the sitemap on the domain set in
// content/org.yml.
import { queryCollection } from '@nuxt/content/server'

export default defineEventHandler(async (event) => {
  const org = await queryCollection(event, 'org').first()
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return `User-agent: *\nAllow: /\n\nSitemap: ${org!.url}/sitemap.xml\n`
})
