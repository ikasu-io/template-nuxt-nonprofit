// The content collections: which files in content/ belong to which, and
// their schemas (in schemas.ts).
//
// Facts that are the same in every language (address, phone, amounts,
// dates) are in content/*.yml and content/volunteer/*.yml. Texts are in one
// folder per language, content/en/ and content/de/, and each language gets
// its own collection (`stories_en`, `stories_de`): a German story sits at
// the same place under content/de/ as its English original and has the
// same address, under /de/.
import { defineCollection, defineContentConfig } from '@nuxt/content'
import { schemas } from './schemas'

const texts = (lang: 'en' | 'de') => ({
  [`org_${lang}`]: defineCollection({ type: 'data', source: `${lang}/org.yml`, schema: schemas.orgTexts }),
  [`campaign_${lang}`]: defineCollection({ type: 'data', source: `${lang}/campaign.yml`, schema: schemas.campaignTexts }),
  [`donate_${lang}`]: defineCollection({ type: 'data', source: `${lang}/donate.yml`, schema: schemas.donateTexts }),
  [`impact_${lang}`]: defineCollection({ type: 'data', source: `${lang}/impact.yml`, schema: schemas.impact }),
  [`images_${lang}`]: defineCollection({ type: 'data', source: `${lang}/images.yml`, schema: schemas.images }),
  [`reports_${lang}`]: defineCollection({ type: 'data', source: `${lang}/reports/*.yml`, schema: schemas.reports }),
  [`about_${lang}`]: defineCollection({ type: 'page', source: `${lang}/about.md`, schema: schemas.about }),
  [`projects_${lang}`]: defineCollection({
    type: 'page',
    source: { include: `${lang}/work/*.md`, prefix: '/work' },
    schema: schemas.projects,
  }),
  [`volunteer_${lang}`]: defineCollection({
    type: 'page',
    source: { include: `${lang}/volunteer/*.md`, prefix: '/volunteer' },
    schema: schemas.volunteer,
  }),
  [`stories_${lang}`]: defineCollection({
    type: 'page',
    source: { include: `${lang}/stories/*.md`, prefix: '/stories' },
    schema: schemas.stories,
  }),
})

export default defineContentConfig({
  collections: {
    org: defineCollection({ type: 'data', source: 'org.yml', schema: schemas.org }),
    campaign: defineCollection({ type: 'data', source: 'campaign.yml', schema: schemas.campaign }),
    donate: defineCollection({ type: 'data', source: 'donate.yml', schema: schemas.donate }),
    days: defineCollection({ type: 'data', source: 'volunteer/*.yml', schema: schemas.days }),
    ...texts('en'),
    ...texts('de'),
  },
})
