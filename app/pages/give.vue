<script setup>
// Stand-in for the donation provider's checkout. A real site points
// `donate_url` in content/org.yml at its provider instead.
const { data: org } = await useOrg()
const { t } = useI18n()
const localePath = useLocalePath()
const { money } = useFormat()
useHead({ title: t('give.title'), meta: [{ name: 'robots', content: 'noindex' }] })
const route = useRoute()
const summary = ref('')
onMounted(() => {
  const amount = route.query.amount === 'other' ? Number(route.query.other) : Number(route.query.amount)
  if (amount > 0) summary.value = route.query.frequency === 'monthly' ? t('donate.perMonth', { amount: money(amount) }) : money(amount)
})
</script>

<template>
  <div class="wrap section box">
    <span class="kicker">{{ t('give.kicker') }}</span>
    <h1>{{ t('give.heading') }}</h1>
    <p class="lead">
      {{ t('give.lead', { name: org.name }) }}<template v-if="summary">{{ ` ${t('give.notEven', { summary })}` }}</template>.
    </p>
    <i18n-t keypath="give.provider" tag="p" scope="global">
      <template #field><code>donate_url</code></template>
      <template #file><code>content/org.yml</code></template>
    </i18n-t>
    <NuxtLink class="button" :to="localePath('/')">{{ t('give.home') }}</NuxtLink>
  </div>
</template>

<style scoped>
.box {
  max-width: 46rem;
  margin-inline: auto;
}
code {
  background: var(--bone-deep);
  padding: 0.1em 0.35em;
}
</style>
