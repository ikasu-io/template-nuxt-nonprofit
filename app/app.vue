<script setup>
import { withTrailingSlash } from 'ufo'

const { t } = useI18n()
const { data: org } = await useOrg()

// <html lang>, and links from every page to the same page in the other
// language (hreflang) for search engines, from @nuxtjs/i18n. Their
// addresses end in a slash, like the canonical link (see usePageMeta).
const i18nHead = useLocaleHead()
useHead({
  htmlAttrs: { lang: () => i18nHead.value.htmlAttrs.lang },
  link: () =>
    i18nHead.value.link
      .filter((link) => link.rel === 'alternate')
      .map((link) => ({ ...link, href: withTrailingSlash(link.href) })),
  meta: () => i18nHead.value.meta.filter((meta) => meta.property?.startsWith('og:locale')),
})

// Search-engine data for the organization, on every page.
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: () => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'NGO',
        name: org.value.name,
        description: org.value.description,
        url: org.value.url,
        logo: `${org.value.url}/favicon.svg`,
        foundingDate: String(org.value.founded),
        email: org.value.email,
        telephone: org.value.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: org.value.address.street,
          addressLocality: org.value.address.town,
          addressRegion: org.value.address.state,
          addressCountry: 'US',
        },
      }),
    },
  ],
})
</script>

<template>
  <a class="skip" href="#main">{{ t('skip') }}</a>
  <SiteHeader />
  <main id="main">
    <NuxtPage />
  </main>
  <SiteFooter />
</template>
