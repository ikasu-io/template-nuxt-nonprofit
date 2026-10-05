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

| To change … | Edit |
|---|---|
| Name, address, phone, email, staff, board | `content/org.yml` |
| The campaign: goal, amount raised, end date | `content/campaign.yml` |
| The big numbers on the home page | `content/impact.yml` |
| A volunteer day, or add one | its file in `content/volunteer/` (copy one); past days disappear by themselves |
| A project, or add one | its file in `content/work/` |
| A story, or add one | its file in `content/stories/` |
| The annual report | `content/reports/<year>.yml` (add a new file for a new year) |
| Donation amounts and what they pay for | `content/donate.yml` |
| Where "Continue to payment" goes | `donate_url` in `content/org.yml` (your donation provider) |
| A photo | drop it into `public/images/` and describe it in `content/images.yml` |
| Colours, fonts, spacing | `app/assets/css/main.css` (tokens at the top) |

If a content file has a missing or wrong field — a date written as
"Oct 17", an unknown volunteer type, a photo that doesn't exist — the
build stops and names the file and the field. The rules for every file
are in `schemas.ts`.

Upcoming volunteer days and the campaign's days left are worked out when
the site is built, so rebuild it now and then (Ikasu does this after
every edit).

## Deploying

`npm run build` writes a static site to `.output/public/`. Any static
host works: Netlify, Cloudflare Pages, GitHub Pages, your own server. Set
`url` in `content/org.yml` to your domain.

## Licence

MIT, see [LICENSE](LICENSE). Images: see [IMAGES.md](IMAGES.md).
