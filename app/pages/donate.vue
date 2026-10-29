<script setup>
const { t, locale } = useI18n()
const texts = useTexts()
const { money } = useFormat()
const { data: org } = await useOrg()
// The amounts from content/donate.yml, each with what it pays for in the
// page's language.
const { data: donate } = await useAsyncData(`donate-${locale.value}`, async () => {
  const [{ amounts }, text] = await Promise.all([queryCollection('donate').first(), queryCollection(texts('donate')).first()])
  return {
    amounts: amounts.map((amount) => ({ amount, pays_for: text.pays_for[`$${amount}`] })),
    monthly_note: text.monthly_note,
  }
})
usePageMeta({
  title: t('donate.title'),
  description: t('donate.description', { name: org.value.name }),
  image: 'planting-hands',
})

// The picker works as a plain form without JavaScript; with it, the text
// under the amounts says what the chosen amount pays for.
const frequency = ref('monthly')
const amount = ref(String(donate.value.amounts[1]?.amount ?? donate.value.amounts[0].amount))
const other = ref('')
const chosen = computed(() => (amount.value === 'other' ? Number(other.value) || 0 : Number(amount.value)))
const paysFor = computed(() => {
  const match = [...donate.value.amounts].reverse().find((a) => chosen.value >= a.amount)
  return match ? match.pays_for : t('donate.anyAmount')
})
</script>

<template>
  <div class="wrap section give">
    <div class="text">
      <span class="kicker">{{ t('donate.kicker') }}</span>
      <h1>{{ t('donate.heading') }}</h1>
      <p class="lead">
        {{ t('donate.lead') }}
      </p>
      <Photo name="planting-hands" desktop="40vw" class="photo" />
    </div>

    <form class="picker" :action="org.donate_url" method="get">
      <fieldset class="freq">
        <legend class="visually-hidden">{{ t('donate.howOften') }}</legend>
        <label :class="{ on: frequency === 'once' }">
          <input v-model="frequency" type="radio" name="frequency" value="once" />
          {{ t('donate.once') }}
        </label>
        <label :class="{ on: frequency === 'monthly' }">
          <input v-model="frequency" type="radio" name="frequency" value="monthly" />
          {{ t('donate.monthly') }}
        </label>
      </fieldset>

      <fieldset class="amounts">
        <legend>{{ t('donate.amount') }}</legend>
        <label v-for="a in donate.amounts" :key="a.amount" :class="{ on: amount === String(a.amount) }">
          <input v-model="amount" type="radio" name="amount" :value="String(a.amount)" />
          {{ money(a.amount) }}
        </label>
        <label :class="['other', { on: amount === 'other' }]">
          <input v-model="amount" type="radio" name="amount" value="other" />
          {{ t('donate.other') }}
        </label>
        <label v-if="amount === 'other'" class="other-input">
          <span class="visually-hidden">{{ t('donate.otherAmount') }}</span>
          $ <input v-model="other" type="number" name="other" min="1" step="1" inputmode="numeric" placeholder="75" />
        </label>
      </fieldset>

      <p class="pays" aria-live="polite">
        <strong>{{ frequency === 'monthly' ? t('donate.perMonth', { amount: money(chosen) }) : money(chosen) }}:</strong> {{ paysFor }}
      </p>
      <p v-if="frequency === 'monthly'" class="muted note">{{ donate.monthly_note }}</p>

      <button class="button submit" type="submit">{{ t('donate.continue') }}</button>
      <p class="muted note">
        {{ t('donate.note', { name: org.name, ein: org.ein }) }}
      </p>
    </form>
  </div>
</template>

<style scoped>
.give {
  display: grid;
  grid-template-columns: 6fr 5fr;
  gap: clamp(2rem, 6vw, 6rem);
  align-items: start;
}
.text h1 {
  font-size: clamp(2.2rem, 4.4vw, 3.8rem);
}
.photo {
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  margin-top: 2rem;
}
.picker {
  position: sticky;
  top: 1.5rem;
  background: #fff;
  border: 2px solid var(--bark);
  padding: clamp(1.25rem, 3vw, 2.25rem);
}
fieldset {
  border: 0;
  margin: 0 0 1.5rem;
  padding: 0;
}
legend {
  font: 700 0.8rem/1.3 var(--sans);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 0.8rem;
}
.freq {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 2px solid var(--bark);
  border-radius: 999px;
  overflow: hidden;
}
.freq label {
  text-align: center;
  padding: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}
.freq label.on {
  background: var(--bark);
  color: var(--bone);
}
.amounts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(6.5rem, 1fr));
  gap: 0.6rem;
}
.amounts legend {
  grid-column: 1 / -1;
}
.amounts label {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
  border: 1px solid var(--bark);
  font: 500 1.4rem/1 var(--serif);
  cursor: pointer;
}
.amounts label.on {
  background: var(--moss);
  border-color: var(--moss);
  color: #fff;
}
.amounts label.other {
  font: 600 1rem/1 var(--sans);
}
.other-input {
  grid-column: 1 / -1;
  gap: 0.4rem;
}
.other-input input {
  width: 8rem;
  font: inherit;
  padding: 0.3rem 0.5rem;
  border: 0;
  border-bottom: 2px solid var(--bark);
  background: transparent;
}
.freq input,
.amounts label:not(.other-input) input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.freq label:has(input:focus-visible),
.amounts label:has(input:focus-visible) {
  outline: 3px solid var(--marigold);
  outline-offset: 2px;
}
.pays {
  font: 400 1.25rem/1.4 var(--serif);
  min-height: 3.5rem;
}
.note {
  font-size: 0.9rem;
}
.submit {
  width: 100%;
  justify-content: center;
  margin-block: 0.5rem 1rem;
}
@media (max-width: 860px) {
  .give {
    grid-template-columns: 1fr;
  }
  .picker {
    position: static;
  }
}
</style>
