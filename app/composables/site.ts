// Small helpers shared by the pages: the organization, the texts of the
// page's language, the build day, and how dates and money are written.

// Which collection holds a text in the language of the page: content/de/…
// is `stories_de`. See content.config.ts.
export const useTexts = () => {
  const { locale } = useI18n()
  return <T extends string>(name: T) => `${name}_${locale.value}` as `${T}_en`
}

// The organization: its facts from content/org.yml with its tagline,
// description and everyone's role in the language of the page.
export const useOrg = () => {
  const { locale } = useI18n()
  const texts = useTexts()
  return useAsyncData(
    () => `org-${locale.value}`,
    async () => {
      const [org, text] = await Promise.all([queryCollection('org').first(), queryCollection(texts('org')).first()])
      const withRole = <P extends { name: string }>(person: P) => ({ ...person, role: text!.roles[person.name] ?? '' })
      return {
        ...org!,
        tagline: text!.tagline,
        description: text!.description,
        staff: org!.staff.map(withRole),
        board: org!.board.map(withRole),
      }
    },
  )
}

export const useLatestReport = () => {
  const { locale } = useI18n()
  const texts = useTexts()
  return useAsyncData(
    () => `latest-report-${locale.value}`,
    () => queryCollection(texts('reports')).order('year', 'DESC').first(),
  )
}

// Volunteer days from `from` on, soonest first: the date, times and spots
// from content/volunteer/, the title, place and text in the page's language.
export const useVolunteerDays = (key: string, from: string, limit?: number) => {
  const { locale } = useI18n()
  const texts = useTexts()
  return useAsyncData(
    () => `${key}-${locale.value}`,
    async () => {
      let query = queryCollection('days').where('date', '>=', from).order('date', 'ASC')
      if (limit) query = query.limit(limit)
      const [days, pages] = await Promise.all([query.all(), queryCollection(texts('volunteer')).all()])
      const name = (path: string) => path.split('/').pop()
      return days.flatMap((day) => {
        const text = pages.find((p) => name(p.path) === name(day.stem))
        return text ? [{ ...text, ...day, path: text.path }] : []
      })
    },
  )
}

// The day the site was generated. Upcoming volunteer days and the campaign's
// days left are worked out from it, so they are right as of the last build
// (Ikasu rebuilds the site after every edit). Kept in the page payload so
// the browser shows the same thing the HTML was built with.
export const useBuildDay = () => useState('build-day', () => new Date().toISOString().slice(0, 10))

const at = (day: string) => new Date(`${day}T12:00:00Z`)
export const daysBetween = (from: string, to: string) => Math.round((at(to).getTime() - at(from).getTime()) / 86400000)

// Dates, times and money the way the page's language writes them.
export const useFormat = () => {
  const { locale, localeProperties } = useI18n()
  const tag = () => localeProperties.value.language ?? 'en-US'
  const fmt = (day: string, options: Intl.DateTimeFormatOptions) =>
    at(day).toLocaleDateString(tag(), { timeZone: 'UTC', ...options })

  return {
    longDate: (day: string) => fmt(day, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
    shortDate: (day: string) => fmt(day, { month: 'long', day: 'numeric', year: 'numeric' }),
    monthOf: (day: string) => fmt(day, { month: 'long', year: 'numeric' }),
    weekdayOf: (day: string) => fmt(day, { weekday: 'short' }),
    dayOfMonth: (day: string) => fmt(day, { day: 'numeric' }),
    monthShort: (day: string) => fmt(day, { month: 'short' }),
    // English: "9:00" → "9 a.m.", "13:30" → "1:30 p.m."; German: "9:00", "13:30"
    clock: (time: string) => {
      if (locale.value !== 'en') return time
      const [h, m] = time.split(':').map(Number) as [number, number]
      const hour = h % 12 || 12
      return `${hour}${m ? `:${String(m).padStart(2, '0')}` : ''} ${h < 12 ? 'a.m.' : 'p.m.'}`
    },
    money: (amount: number) =>
      amount.toLocaleString(tag(), { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
    number: (value: number) => value.toLocaleString(tag()),
  }
}

// Title, description, share image and canonical link for one page. The
// organization is already loaded by app.vue, so this only reads it.
export const usePageMeta = (meta: { title: string; description: string; image?: string }) => {
  const { locale } = useI18n()
  const org = useNuxtData(`org-${locale.value}`).data
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
