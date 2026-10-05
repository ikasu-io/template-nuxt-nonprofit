// What every content file must contain, one schema per collection. Used by
// content.config.ts (Nuxt Content) and by modules/check-content.ts, which
// stops `npm run build` with the file and the field named when a file does
// not match; `npm run dev` only warns.
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
    tagline: z.string(),
    url: z.string().url(),
    founded: z.number().int(),
    description: z.string(),
    address: z.object({ street: z.string(), town: z.string(), state: z.string() }),
    phone: z.string(),
    email: z.string().email(),
    ein: z.string(),
    donate_url: z.string(),
    members: z.number().int(),
    staff: z.array(z.object({ name: z.string(), role: z.string(), email: z.string().email() })),
    board: z.array(z.object({ name: z.string(), role: z.string() })),
  }),
  campaign: z.object({
    title: z.string(),
    text: z.string(),
    goal: z.number().positive(),
    raised: z.number().min(0),
    ends: day,
    image,
  }),
  impact: z.object({
    since: z.number().int(),
    figures: z.array(figure).min(1),
  }),
  donate: z.object({
    amounts: z.array(z.object({ amount: z.number().positive(), pays_for: z.string() })).min(1),
    monthly_note: z.string(),
  }),
  images: z.object({ alt: z.record(z.string(), z.string()) }),
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
  volunteer: z.object({
    title: z.string(),
    date: day,
    start: time,
    end: time,
    type: z.enum(['planting', 'cleanup', 'testing', 'paddle']),
    place: z.string(),
    families: z.boolean(),
    spots: z.number().int().min(0),
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
