<script setup>
const route = useRoute()
const year = Number(route.params.year)
const { data: report } = await useAsyncData(`report-${year}`, () => queryCollection('reports').where('year', '=', year).first())
if (!report.value) throw createError({ statusCode: 404, statusMessage: 'Report not found', fatal: true })
const { data: org } = await useOrg()
usePageMeta({
  title: `Annual report ${year}`,
  description: `What ${org.value.name} did in ${year}, and where every dollar came from and went.`,
  image: 'volunteers-bank',
})

const total = (rows) => rows.reduce((sum, row) => sum + row.amount, 0)
const spent = computed(() => total(report.value.spending))
const received = computed(() => total(report.value.income))
const share = (amount, of) => Math.round((amount / of) * 100)
const program = computed(() => share(report.value.spending[0].amount + (report.value.spending[1]?.amount ?? 0), spent.value))
</script>

<template>
  <div>
    <header class="wrap section head">
      <span class="kicker">Annual report</span>
      <h1 class="year">{{ report.year }}</h1>
      <p class="lead">{{ report.intro }}</p>
    </header>

    <section class="band" aria-label="The year in numbers">
      <div class="wrap section">
        <Figures :figures="report.figures" />
      </div>
    </section>

    <section class="wrap section money" aria-labelledby="money-title">
      <div class="section-head">
        <h2 id="money-title">Where the money went</h2>
      </div>
      <div class="cols">
        <div>
          <p class="big">
            <strong>{{ program }}¢</strong> of every dollar went straight to the river and the classrooms.
          </p>
          <p class="muted">Spent in {{ report.year }}: {{ money(spent) }}. Received: {{ money(received) }}.</p>
        </div>
        <div>
          <h3>Spending</h3>
          <ul class="bars">
            <li v-for="(row, i) in report.spending" :key="row.label">
              <div class="row">
                <span>{{ row.label }}</span>
                <span>{{ money(row.amount) }}</span>
              </div>
              <svg class="bar" viewBox="0 0 100 6" preserveAspectRatio="none" aria-hidden="true">
                <rect width="100" height="6" class="bg" />
                <rect :width="share(row.amount, spent)" height="6" :class="['fg', `c${i}`]" />
              </svg>
              <span class="pct">{{ share(row.amount, spent) }}%</span>
            </li>
          </ul>
          <h3>Income</h3>
          <ul class="bars">
            <li v-for="row in report.income" :key="row.label">
              <div class="row">
                <span>{{ row.label }}</span>
                <span>{{ money(row.amount) }}</span>
              </div>
              <svg class="bar" viewBox="0 0 100 6" preserveAspectRatio="none" aria-hidden="true">
                <rect width="100" height="6" class="bg" />
                <rect :width="share(row.amount, received)" height="6" class="fg in" />
              </svg>
              <span class="pct">{{ share(row.amount, received) }}%</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="wrap section thanks" aria-labelledby="thanks-title">
      <div class="section-head">
        <h2 id="thanks-title">Thank you</h2>
      </div>
      <ul>
        <li v-for="name in report.thanks" :key="name">{{ name }}</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.head {
  max-width: 56rem;
  margin-inline: auto;
}
.year {
  font-size: clamp(6rem, 22vw, 16rem);
  font-weight: 300;
  line-height: 0.85;
  letter-spacing: -0.05em;
  margin-bottom: 2rem;
}
.cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(2rem, 6vw, 6rem);
}
.big {
  font: 400 clamp(1.6rem, 3vw, 2.4rem) / 1.2 var(--serif);
}
.big strong {
  display: block;
  font-size: clamp(4rem, 9vw, 7rem);
  font-weight: 400;
  line-height: 1;
  color: var(--moss);
  letter-spacing: -0.03em;
}
h3 {
  font: 700 0.8rem/1.3 var(--sans);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-top: 1rem;
}
.bars {
  list-style: none;
  margin: 0 0 2.5rem;
  padding: 0;
}
.bars li {
  display: grid;
  grid-template-columns: 1fr 3rem;
  gap: 0.3rem 1rem;
  align-items: center;
  padding-block: 0.6rem;
  border-bottom: 1px solid var(--rule);
}
.row {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
.row span:last-child {
  font-variant-numeric: tabular-nums;
}
.bar {
  width: 100%;
  height: 10px;
}
.bg {
  fill: var(--bone-deep);
}
.fg {
  fill: var(--moss);
}
.fg.c1 {
  fill: #6f8f3a;
}
.fg.c2,
.fg.c3 {
  fill: var(--bark-soft);
}
.fg.in {
  fill: var(--marigold);
}
.pct {
  text-align: right;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.thanks ul {
  list-style: none;
  margin: 0;
  padding: 0;
  columns: 2 18rem;
  column-gap: 3rem;
}
.thanks li {
  font: 400 clamp(1.3rem, 2.2vw, 1.75rem) / 1.3 var(--serif);
  padding-block: 0.6rem;
  border-bottom: 1px solid var(--rule);
  break-inside: avoid;
}
@media (max-width: 860px) {
  .cols {
    grid-template-columns: 1fr;
  }
}
</style>
