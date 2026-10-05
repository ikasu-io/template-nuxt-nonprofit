<script setup>
const { data: org } = await useOrg()

// Search-engine data for the organization, on every page.
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
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
  <a class="skip" href="#main">Skip to content</a>
  <SiteHeader />
  <main id="main">
    <NuxtPage />
  </main>
  <SiteFooter />
</template>
