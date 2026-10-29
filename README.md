# Sallow River Alliance — a nonprofit website built with Nuxt

> **Sallow River Alliance is a fictional nonprofit.** The town of Wren
> Hollow, the river, the people and the photos are all made up. The site,
> its content and its images were generated with AI, and it is maintained
> with [Ikasu](https://ikasu.io), an AI content copilot for static sites.
> Use it as a starting point for your own nonprofit, association or club.

A website for an organization people join, volunteer for and give to: a
fundraising campaign with a progress bar, the work it does, volunteer days
with a filter and email sign-up, magazine-style stories, an annual report
with where the money went, and a donation page.

- [Nuxt](https://nuxt.com) 4 with [Nuxt Content](https://content.nuxt.com) and [Nuxt Image](https://image.nuxt.com), generated as a static site
- Every text is a Markdown or YAML file in `content/`; every file is checked when the site is built
- In English and German with [@nuxtjs/i18n](https://i18n.nuxtjs.org): English at `/…`, German at `/de/…`
- Photos resized and converted to WebP at build time
- No cookies, no external fonts, maps or scripts; the pages work without JavaScript
- Search-engine data for the organization, volunteer days and stories (schema.org), sitemap and `robots.txt`

## Getting started

Needs Node.js 22.13 or newer.

```sh
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in .output/public/
```

## Where to change what

`<language>` is `en` or `de`; change a text in both.

| To change … | Edit |
|---|---|
| Name, address, phone, email, staff, board | `content/org.yml` |
| The tagline, the description, everyone's role | `content/<language>/org.yml` |
| The campaign: goal, amount raised, end date | `content/campaign.yml` |
| The campaign's title and text | `content/<language>/campaign.yml` |
| The big numbers on the home page | `content/<language>/impact.yml` |
| A volunteer day: date, times, spots | its file in `content/volunteer/`; past days disappear by themselves |
| A volunteer day: title, place, text | the file of the same name in `content/<language>/volunteer/` |
| Add a volunteer day | copy a file in `content/volunteer/` and the one of the same name in each `content/<language>/volunteer/` |
| A project, or add one | its file in `content/<language>/work/` |
| A story, or add one | its file in `content/<language>/stories/` |
| The About page's story | `content/<language>/about.md` |
| The annual report | `content/<language>/reports/<year>.yml` (add a new file for a new year) |
| Donation amounts | `content/donate.yml` |
| What each amount pays for | `content/<language>/donate.yml` |
| Where "Continue to payment" goes | `donate_url` in `content/org.yml` (your donation provider) |
| Navigation, buttons, headings, short page texts | `locales/en.json` and `locales/de.json` |
| A photo | drop it into `public/images/` and describe it in each `content/<language>/images.yml` |
| Colours, fonts, spacing | `app/assets/css/main.css` (tokens at the top) |

If a content file has a missing or wrong field — a date written as
"Oct 17", an unknown volunteer type, a photo that doesn't exist — the
build stops and names the file and the field. The rules for every file
are in `schemas.ts`.

Upcoming volunteer days and the campaign's days left are worked out when
the site is built, so rebuild it now and then (Ikasu does this after
every edit).

## Two languages

Every page exists in English and in German. English is the default and
has no prefix (`/stories`); German has its own (`/de/stories`), and the
build writes every German page as well. The switch in the header leads to
the same page in the other language, and each page sets `<html lang>` and
links its other language with `<link rel="alternate" hreflang>`.

Texts live in three places:

- **Short texts** — navigation, buttons, labels, headings, the footer — in
  `locales/en.json` and `locales/de.json`, under the same key in both.
- **Longer texts** — stories, projects, volunteer days, the About page,
  the annual report — in `content/en/` and `content/de/`. A German text
  sits at the same place as its English original:
  `content/en/stories/the-dam-came-out.md` and
  `content/de/stories/the-dam-came-out.md`.
- **Facts** that are the same in every language — address, phone, email,
  donation amounts, the campaign's goal and end date, the dates of the
  volunteer days — once, in `content/*.yml` and `content/volunteer/`.
  Dates and amounts are written out for the page's language
  (`October 31, 2026`, `31. Oktober 2026`).

## Deploying

`npm run build` writes a static site to `.output/public/`. Any static
host works: Netlify, Cloudflare Pages, GitHub Pages, your own server. Set
`url` in `content/org.yml` to your domain.

## Licence

MIT, see [LICENSE](LICENSE). Images: see [IMAGES.md](IMAGES.md).
