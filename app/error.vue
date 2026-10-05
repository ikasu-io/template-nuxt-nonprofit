<script setup>
const props = defineProps({ error: Object })
const notFound = computed(() => props.error?.statusCode === 404)
useHead({ title: notFound.value ? 'Page not found' : 'Something went wrong', meta: [{ name: 'robots', content: 'noindex' }] })
</script>

<template>
  <a class="skip" href="#main">Skip to content</a>
  <SiteHeader />
  <main id="main" class="lost wrap">
    <span class="kicker">{{ notFound ? 'Error 404' : 'Error' }}</span>
    <h1>{{ notFound ? 'This trail washed out.' : 'Something went wrong.' }}</h1>
    <p class="lead">
      {{ notFound ? "The page you were looking for isn't here. It may have moved after the last flood." : 'Please try again in a moment.' }}
    </p>
    <div class="buttons">
      <NuxtLink class="button" to="/">Back to the home page</NuxtLink>
      <NuxtLink class="button ghost" to="/volunteer">Volunteer days</NuxtLink>
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
