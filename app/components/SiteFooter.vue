<script setup>
const { data: org } = await useOrg()
const { data: report } = await useLatestReport()
const { t } = useI18n()
const localePath = useLocalePath()
const { number } = useFormat()
</script>

<template>
  <footer class="footer">
    <svg class="wave" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 30c120-26 240-26 360 0s240 26 360 0 240-26 360 0 240 26 360 0v30H0z" />
    </svg>
    <div class="inner">
      <div class="wrap grid">
        <div class="join">
          <p class="big">{{ t('footer.join', { members: number(org.members) }) }}</p>
          <div class="buttons">
            <NuxtLink class="button" :to="localePath('/donate')">{{ t('footer.member') }}</NuxtLink>
            <NuxtLink class="button ghost" :to="localePath('/volunteer')">{{ t('footer.volunteer') }}</NuxtLink>
          </div>
        </div>
        <div>
          <h2 class="small-head">{{ t('footer.visit') }}</h2>
          <address>
            {{ org.name }}<br />
            {{ org.address.street }}<br />
            {{ org.address.town }}, {{ org.address.state }}
          </address>
          <p>
            <a :href="`tel:${org.phone.replace(/[^0-9+]/g, '')}`">{{ org.phone }}</a><br />
            <a :href="`mailto:${org.email}`">{{ org.email }}</a>
          </p>
        </div>
        <div>
          <h2 class="small-head">{{ t('footer.alliance') }}</h2>
          <ul>
            <li><NuxtLink :to="localePath('/work')">{{ t('footer.work') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('/stories')">{{ t('footer.stories') }}</NuxtLink></li>
            <li v-if="report"><NuxtLink :to="localePath(`/report/${report.year}`)">{{ t('footer.report', { year: report.year }) }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('/about')">{{ t('footer.about') }}</NuxtLink></li>
          </ul>
        </div>
      </div>
      <div class="wrap fine">
        <p>
          {{ t('footer.legal', { name: org.name, ein: org.ein }) }}
        </p>
        <p><strong>{{ t('footer.demo') }}</strong></p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: var(--space);
}
.wave {
  display: block;
  width: 100%;
  height: 40px;
  fill: var(--shallow);
}
.inner {
  background: var(--shallow);
  padding-block: 2.5rem 2rem;
}
.grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 2.5rem;
}
.big {
  font: 500 clamp(1.6rem, 3vw, 2.4rem) / 1.15 var(--serif);
  max-width: 22ch;
  margin-bottom: 1.4rem;
}
.small-head {
  font: 700 0.8rem/1.3 var(--sans);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 0.8rem;
}
address {
  font-style: normal;
  margin-bottom: 1em;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 0.35rem;
}
a:not(.button) {
  color: var(--bark);
}
.fine {
  margin-top: 2.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgb(35 31 27 / 0.2);
  font-size: 0.9rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0 2rem;
}
.fine p {
  margin: 0 0 0.4rem;
}
@media (max-width: 860px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
  .join {
    grid-column: 1 / -1;
  }
}
@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
