<script setup>
// Stand-in for the donation provider's checkout. A real site points
// `donate_url` in content/org.yml at its provider instead.
const { data: org } = await useOrg()
useHead({ title: 'Payment', meta: [{ name: 'robots', content: 'noindex' }] })
const route = useRoute()
const summary = ref('')
onMounted(() => {
  const amount = route.query.amount === 'other' ? Number(route.query.other) : Number(route.query.amount)
  if (amount > 0) summary.value = `$${amount}${route.query.frequency === 'monthly' ? ' a month' : ''}`
})
</script>

<template>
  <div class="wrap section box">
    <span class="kicker">Payment</span>
    <h1>This is where the checkout would open</h1>
    <p class="lead">
      {{ org.name }} is a fictional organization, so no money changes hands here<template v-if="summary"> — not even
      the {{ summary }} you picked</template>.
    </p>
    <p>
      A real nonprofit using this template sets <code>donate_url</code> in <code>content/org.yml</code> to the page of its
      donation provider, such as Givebutter, Donorbox, Every.org or a Stripe Payment Link. The amount and frequency chosen on
      the Give page are passed along in the address.
    </p>
    <NuxtLink class="button" to="/">Back to the home page</NuxtLink>
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
