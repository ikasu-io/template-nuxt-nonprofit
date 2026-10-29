<script setup>
// One volunteer day in a list: date block, what and where, and a sign-up
// link that opens an email with the event in the subject.
const props = defineProps({ day: { type: Object, required: true }, full: Boolean })
const { data: org } = await useOrg()
const { t } = useI18n()
const { longDate, shortDate, weekdayOf, dayOfMonth, monthShort, clock } = useFormat()
const signup = computed(() => {
  const contact = org.value.staff.find((p) => p.email.startsWith('volunteer'))?.email ?? org.value.email
  const subject = t('day.subject', { title: props.day.title, date: shortDate(props.day.date) })
  return `mailto:${contact}?subject=${encodeURIComponent(subject)}`
})
</script>

<template>
  <article class="day">
    <p class="when" aria-hidden="true">
      <span class="dow">{{ weekdayOf(day.date) }}</span>
      <span class="num">{{ dayOfMonth(day.date) }}</span>
      <span class="mon">{{ monthShort(day.date) }}</span>
    </p>
    <div class="what">
      <p class="tags">
        <span :class="['type', day.type]">{{ t(`types.${day.type}`) }}</span>
        <span v-if="day.families" class="family">{{ t('day.families') }}</span>
      </p>
      <h3>{{ day.title }}</h3>
      <p class="meta">
        <span class="visually-hidden">{{ longDate(day.date) }}, </span>
        {{ t('day.time', { start: clock(day.start), end: clock(day.end) }) }} · {{ day.place }}
      </p>
      <ContentRenderer v-if="full" :value="day" class="text" />
    </div>
    <div class="act">
      <a class="button ghost" :href="signup">{{ t('day.signUp') }}<span class="visually-hidden">{{ ` ${t('day.signUpFor', { title: day.title })}` }}</span></a>
      <p class="spots">{{ t('day.spots', { n: day.spots }) }}</p>
    </div>
  </article>
</template>

<style scoped>
.day {
  display: grid;
  grid-template-columns: 5.5rem 1fr auto;
  gap: 1.5rem;
  align-items: start;
  padding-block: 1.6rem;
  border-bottom: 1px solid var(--rule);
}
.when {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  padding: 0.5rem 0 0.6rem;
  border: 2px solid var(--bark);
  line-height: 1;
}
.dow,
.mon {
  font: 600 0.75rem/1 var(--sans);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.num {
  font: 500 2.4rem/1.05 var(--serif);
}
h3 {
  margin: 0.25rem 0 0.35rem;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0;
  font: 600 0.78rem/1.4 var(--sans);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.type {
  color: var(--moss);
}
.type.cleanup {
  color: var(--clay);
}
.type.testing {
  color: #2f5f6b;
}
.type.paddle {
  color: #6a4f12;
}
.family {
  color: var(--bark-soft);
}
.family::before {
  content: '· ';
}
.meta {
  margin: 0;
  color: var(--bark-soft);
}
.text {
  margin-top: 0.8rem;
  max-width: var(--measure);
}
.text :deep(p:last-child) {
  margin-bottom: 0;
}
.act {
  text-align: center;
}
.spots {
  margin: 0.4rem 0 0;
  font-size: 0.85rem;
  color: var(--bark-soft);
}
@media (max-width: 640px) {
  .day {
    grid-template-columns: 4.5rem 1fr;
    gap: 1rem 1.1rem;
  }
  .num {
    font-size: 2rem;
  }
  .act {
    grid-column: 2;
    display: flex;
    align-items: center;
    gap: 1rem;
    text-align: left;
  }
  .spots {
    margin: 0;
  }
}
</style>
