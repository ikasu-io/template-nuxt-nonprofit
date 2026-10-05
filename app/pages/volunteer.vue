<script setup>
const today = useBuildDay()
const { data: org } = await useOrg()
const { data: days } = await useAsyncData('upcoming-days', () =>
  queryCollection('volunteer').where('date', '>=', today.value).order('date', 'ASC').all(),
)
usePageMeta({
  title: 'Volunteer',
  description: 'Plant trees, clean up the river, test the water or paddle with us. Upcoming volunteer days on the Sallow River.',
  image: 'volunteers-bank',
})

// The filter. Without JavaScript every day is shown.
const types = [
  { key: 'all', label: 'All' },
  { key: 'planting', label: 'Tree planting' },
  { key: 'cleanup', label: 'Cleanups' },
  { key: 'testing', label: 'Water testing' },
  { key: 'paddle', label: 'Paddles' },
]
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
        <span class="kicker">Get involved</span>
        <h1>Come out on a Saturday</h1>
      </div>
      <div class="how">
        <p class="lead">
          No experience needed. We bring gloves, tools, waders and coffee; you bring boots that can get muddy and a water
          bottle. Under-18s come with an adult.
        </p>
        <p class="muted">
          To sign up, use the button next to a date: it opens an email to {{ coordinator.name }}, who will write back with
          directions. Groups, schools and companies: write to us for a day of your own.
        </p>
      </div>
    </header>

    <div class="filters" role="group" aria-label="Show volunteer days">
      <button
        v-for="t in types"
        :key="t.key"
        type="button"
        :class="['chip', { on: type === t.key }]"
        :aria-pressed="type === t.key"
        @click="type = t.key"
      >
        {{ t.label }}
      </button>
      <label class="families">
        <input v-model="familiesOnly" type="checkbox" />
        Good for families
      </label>
    </div>

    <p v-if="!days.length" class="lead empty">
      Nothing on the calendar right now. New dates are posted every season; write to
      <a :href="`mailto:${coordinator.email}`">{{ coordinator.email }}</a> and we'll let you know.
    </p>
    <p v-else-if="!shown.length" class="lead empty">No days match. Try another filter.</p>

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
  font-style: italic;
  font-weight: 400;
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
