// Small helpers shared by the pages: the organization, photo descriptions,
// the build day, and how dates and money are written.

export const useOrg = () => useAsyncData('org', () => queryCollection('org').first())
export const useLatestReport = () =>
  useAsyncData('latest-report', () => queryCollection('reports').order('year', 'DESC').first())

// The day the site was generated. Upcoming volunteer days and the campaign's
// days left are worked out from it, so they are right as of the last build
// (Ikasu rebuilds the site after every edit). Kept in the page payload so
// the browser shows the same thing the HTML was built with.
export const useBuildDay = () => useState('build-day', () => new Date().toISOString().slice(0, 10))

const at = (day: string) => new Date(`${day}T12:00:00Z`)
const fmt = (day: string, options: Intl.DateTimeFormatOptions) =>
  at(day).toLocaleDateString('en-US', { timeZone: 'UTC', ...options })

export const longDate = (day: string) => fmt(day, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
export const shortDate = (day: string) => fmt(day, { month: 'long', day: 'numeric', year: 'numeric' })
export const monthOf = (day: string) => fmt(day, { month: 'long', year: 'numeric' })
export const weekdayOf = (day: string) => fmt(day, { weekday: 'short' })
export const dayOfMonth = (day: string) => fmt(day, { day: 'numeric' })
export const monthShort = (day: string) => fmt(day, { month: 'short' })
export const daysBetween = (from: string, to: string) => Math.round((at(to).getTime() - at(from).getTime()) / 86400000)

// "9:00" → "9 a.m.", "13:30" → "1:30 p.m."
export const clock = (time: string) => {
  const [h, m] = time.split(':').map(Number) as [number, number]
  const hour = h % 12 || 12
  return `${hour}${m ? `:${String(m).padStart(2, '0')}` : ''} ${h < 12 ? 'a.m.' : 'p.m.'}`
}

export const money = (amount: number) => `$${amount.toLocaleString('en-US')}`

// Title, description, share image and canonical link for one page. The
// organization is already loaded by app.vue, so this only reads it.
export const usePageMeta = (meta: { title: string; description: string; image?: string }) => {
  const org = useNuxtData('org').data
  const route = useRoute()
  const files = useAppConfig().imageFiles as Record<string, string>
  const base = () => (org.value as { url: string } | null)?.url ?? ''
  const url = () => `${base()}${route.path === '/' ? '/' : route.path.replace(/\/$/, '') + '/'}`
  useSeoMeta({
    title: meta.title,
    description: meta.description,
    ogTitle: meta.title,
    ogDescription: meta.description,
    ogType: 'website',
    ogUrl: url,
    ogImage: () => `${base()}/images/${files[meta.image ?? 'hero-river']}`,
    twitterCard: 'summary_large_image',
  })
  useHead({ link: [{ rel: 'canonical', href: url }] })
}
