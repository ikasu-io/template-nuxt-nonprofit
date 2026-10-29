<script setup>
const props = defineProps({ error: Object })
const notFound = computed(() => props.error?.statusCode === 404)
const { t } = useI18n()
const localePath = useLocalePath()
const i18nHead = useLocaleHead({ seo: false })
useHead({
  htmlAttrs: { lang: () => i18nHead.value.htmlAttrs.lang },
  title: notFound.value ? t('error.notFoundTitle') : t('error.title'),
  meta: [{ name: 'robots', content: 'noindex' }],
})
</script>

<template>
  <a class="skip" href="#main">{{ t('skip') }}</a>
  <SiteHeader />
  <main id="main" class="lost wrap">
    <span class="kicker">{{ notFound ? t('error.notFoundKicker') : t('error.kicker') }}</span>
    <h1>{{ notFound ? t('error.notFoundHeading') : t('error.heading') }}</h1>
    <p class="lead">
      {{ notFound ? t('error.notFoundText') : t('error.text') }}
    </p>
    <div class="buttons">
      <NuxtLink class="button" :to="localePath('/')">{{ t('error.home') }}</NuxtLink>
      <NuxtLink class="button ghost" :to="localePath('/volunteer')">{{ t('error.volunteer') }}</NuxtLink>
    </div>
  </main>
  <SiteFooter />
</template>

<style scoped>
.lost {
  padding-block: clamp(4rem, 12vw, 9rem);
  max-width: 48rem;
  margin-inline: auto;
}
</style>
