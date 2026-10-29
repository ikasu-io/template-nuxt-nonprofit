// What every content file must contain, one schema per collection. Used by
// content.config.ts (Nuxt Content) and by modules/check-content.ts, which
// stops `npm run build` with the file and the field named when a file does
// not match; `npm run dev` only warns.
//
// The first four are facts, the same in every language (content/*.yml,
// content/volunteer/*.yml). The others are texts, one file per language
// (content/en/…, content/de/…), with the same schema for every language.
import { z } from 'zod'

const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'must be a date like 2026-10-24')
const time = z.string().regex(/^\d{1,2}:\d{2}$/, 'must be a time like 9:00 or 13:30')
// An image is named by its file in public/images/, without the extension.
const image = z.string().regex(/^[a-z0-9-]+$/, 'must be an image name like hero-river')
// A big number and what it counts: value can be 4, "18,400" or "6.2 miles".
const figure = z.object({ value: z.union([z.string(), z.number()]), label: z.string() })

export const schemas = {
  org: z.object({
    name: z.string(),
    url: z.string().url(),
    founded: z.number().int(),
    address: z.object({ street: z.string(), town: z.string(), state: z.string() }),
    phone: z.string(),
    email: z.string().email(),
    ein: z.string(),
    donate_url: z.string(),
    members: z.number().int(),
    staff: z.array(z.object({ name: z.string(), email: z.string().email() })),
    board: z.array(z.object({ name: z.string() })),
  }),
  campaign: z.object({
    goal: z.number().positive(),
    raised: z.number().min(0),
    ends: day,
    image,
  }),
  donate: z.object({
    amounts: z.array(z.number().positive()).min(1),
  }),
  days: z.object({
    date: day,
    start: time,
    end: time,
    type: z.enum(['planting', 'cleanup', 'testing', 'paddle']),
    families: z.boolean(),
    spots: z.number().int().min(0),
  }),

  // Texts, per language. `roles` and `pays_for` are keyed by a person's
  // name in content/org.yml and by an amount in content/donate.yml ("$25").
  orgTexts: z.object({
    tagline: z.string(),
    description: z.string(),
    roles: z.record(z.string(), z.string()),
  }),
  campaignTexts: z.object({
    title: z.string(),
    text: z.string(),
  }),
  donateTexts: z.object({
    pays_for: z.record(z.string(), z.string()),
    monthly_note: z.string(),
  }),
  impact: z.object({
    since: z.number().int(),
    figures: z.array(figure).min(1),
  }),
  images: z.object({ alt: z.record(z.string(), z.string()) }),
  about: z.object({
    title: z.string(),
    lead: z.string(),
  }),
  projects: z.object({
    title: z.string(),
    summary: z.string(),
    status: z.enum(['planned', 'underway', 'done']),
    place: z.string(),
    years: z.string(),
    image,
    before: image.optional(),
    after: image.optional(),
    figures: z.array(figure).default([]),
    partners: z.array(z.string()).default([]),
    order: z.number(),
  }),
  // One volunteer day's texts; its date, times and spots are in the file
  // of the same name in content/volunteer/.
  volunteer: z.object({
    title: z.string(),
    place: z.string(),
  }),
  stories: z.object({
    title: z.string(),
    description: z.string(),
    date: day,
    author: z.string(),
    image,
    caption: z.string().optional(),
  }),
  reports: z.object({
    year: z.number().int(),
    intro: z.string(),
    figures: z.array(figure),
    income: z.array(z.object({ label: z.string(), amount: z.number() })),
    spending: z.array(z.object({ label: z.string(), amount: z.number() })),
    thanks: z.array(z.string()),
  }),
}
