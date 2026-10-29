<script setup>
const today = useBuildDay()
const { t } = useI18n()
const { monthOf } = useFormat()
const { data: org } = await useOrg()
const { data: days } = await useVolunteerDays('upcoming-days', today.value)
usePageMeta({
  title: t('volunteer.title'),
  description: t('volunteer.description'),
  image: 'volunteers-bank',
})

// The filter. Without JavaScript every day is shown.
const types = ['all', 'planting', 'cleanup', 'testing', 'paddle']
const type = ref('all')
const familiesOnly = ref(false)
const shown = computed(() =>
  days.value.filter((d) => (type.value === 'all' || d.type === type.value) && (!familiesOnly.value || d.families)),
)
const months = computed(() => {
  const groups = []
  for (const day of shown.value) {
    const month = monthOf(day.date)
    if (groups.at(-1)?.month !== month) groups.push({ month, days: [] })
    groups.at(-1).days.push(day)
  }
  return groups
})
const coordinator = computed(() => org.value.staff.find((p) => p.email.startsWith('volunteer')) ?? org.value.staff[0])

// Search-engine data: every volunteer day as an event.
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        days.value.map((d) => ({
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: d.title,
          startDate: `${d.date}T${d.start.padStart(5, '0')}`,
          endDate: `${d.date}T${d.end.padStart(5, '0')}`,
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          location: { '@type': 'Place', name: d.place, address: `${d.place}, ${org.value.address.town}, ${org.value.address.state}` },
          organizer: { '@type': 'NGO', name: org.value.name, url: org.value.url },
          isAccessibleForFree: true,
        })),
      ),
    },
  ],
})
</script>

<template>
  <div class="wrap section">
    <header class="intro">
      <div>
        <span class="kicker">{{ t('volunteer.kicker') }}</span>
        <h1>{{ t('volunteer.heading') }}</h1>
      </div>
      <div class="how">
        <p class="lead">
          {{ t('volunteer.lead') }}
        </p>
        <p class="muted">
          {{ t('volunteer.howTo', { name: coordinator.name }) }}
        </p>
      </div>
    </header>

    <div class="filters" role="group" :aria-label="t('volunteer.filters')">
      <button
        v-for="key in types"
        :key="key"
        type="button"
        :class="['chip', { on: type === key }]"
        :aria-pressed="type === key"
        @click="type = key"
      >
        {{ t(`volunteer.${key}`) }}
      </button>
      <label class="families">
        <input v-model="familiesOnly" type="checkbox" />
        {{ t('day.families') }}
      </label>
    </div>

    <i18n-t v-if="!days.length" keypath="volunteer.empty" tag="p" class="lead empty" scope="global">
      <template #email><a :href="`mailto:${coordinator.email}`">{{ coordinator.email }}</a></template>
    </i18n-t>
    <p v-else-if="!shown.length" class="lead empty">{{ t('volunteer.noMatch') }}</p>

    <section v-for="group in months" :key="group.month" class="month">
      <h2>{{ group.month }}</h2>
      <div>
        <VolunteerDay v-for="day in group.days" :key="day.path" :day="day" full />
      </div>
    </section>
  </div>
</template>

<style scoped>
.intro {
  display: grid;
  grid-template-columns: 5fr 6fr;
  gap: clamp(2rem, 6vw, 6rem);
  align-items: end;
  margin-bottom: 3rem;
}
.intro h1 {
  margin: 0;
}
.how p:last-child {
  margin: 0;
}
.filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  padding-block: 1.2rem;
  border-block: 2px solid var(--bark);
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--bone);
}
.chip {
  min-height: 40px;
  padding: 0.4rem 1rem;
  border: 1px solid var(--bark);
  border-radius: 999px;
  background: transparent;
  color: var(--bark);
  font: 500 0.95rem/1 var(--sans);
  cursor: pointer;
}
.chip.on {
  background: var(--bark);
  color: var(--bone);
}
.families {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
  font-weight: 500;
  cursor: pointer;
}
.families input {
  width: 1.2rem;
  height: 1.2rem;
  accent-color: var(--moss);
}
.month {
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 2rem;
  padding-top: 2.5rem;
}
.month h2 {
  font-size: clamp(1.6rem, 2.6vw, 2.2rem);
  font-weight: 300;
  color: var(--moss);
  padding-top: 1.6rem;
  margin: 0;
}
.empty {
  padding-top: 2rem;
}
@media (max-width: 860px) {
  .intro,
  .month {
    grid-template-columns: 1fr;
  }
  .month {
    gap: 0;
  }
  .families {
    margin-left: 0;
  }
}
</style>
