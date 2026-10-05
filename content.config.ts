// The content collections: which files in content/ belong to which, and
// their schemas (in schemas.ts).
import { defineCollection, defineContentConfig } from '@nuxt/content'
import { schemas } from './schemas'

export default defineContentConfig({
  collections: {
    org: defineCollection({ type: 'data', source: 'org.yml', schema: schemas.org }),
    campaign: defineCollection({ type: 'data', source: 'campaign.yml', schema: schemas.campaign }),
    impact: defineCollection({ type: 'data', source: 'impact.yml', schema: schemas.impact }),
    donate: defineCollection({ type: 'data', source: 'donate.yml', schema: schemas.donate }),
    images: defineCollection({ type: 'data', source: 'images.yml', schema: schemas.images }),
    reports: defineCollection({ type: 'data', source: 'reports/*.yml', schema: schemas.reports }),
    projects: defineCollection({ type: 'page', source: 'work/*.md', schema: schemas.projects }),
    volunteer: defineCollection({ type: 'page', source: 'volunteer/*.md', schema: schemas.volunteer }),
    stories: defineCollection({ type: 'page', source: 'stories/*.md', schema: schemas.stories }),
  },
})
