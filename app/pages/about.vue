<script setup>
const { t, locale } = useI18n()
const texts = useTexts()
const localePath = useLocalePath()
const { data: org } = await useOrg()
const { data: report } = await useLatestReport()
const { data: about } = await useAsyncData(`about-${locale.value}`, () => queryCollection(texts('about')).first())
usePageMeta({
  title: t('about.title'),
  description: t('about.description', { name: org.value.name }),
  image: 'paddle',
})
</script>

<template>
  <div>
    <header class="wrap section intro">
      <span class="kicker">{{ t('about.kicker') }}</span>
      <h1>{{ about.title }}</h1>
    </header>

    <div class="wrap story">
      <figure>
        <Photo name="paddle" desktop="45vw" eager />
      </figure>
      <div class="prose">
        <p class="lead">{{ about.lead }}</p>
        <ContentRenderer :value="about" />
      </div>
    </div>

    <section class="wrap section" aria-labelledby="people-title">
      <div class="section-head">
        <h2 id="people-title">{{ t('about.people') }}</h2>
      </div>
      <div class="people">
        <div>
          <h3 class="small-head">{{ t('about.staff') }}</h3>
          <ul>
            <li v-for="person in org.staff" :key="person.name">
              <strong>{{ person.name }}</strong>
              <span>{{ person.role }}</span>
              <a :href="`mailto:${person.email}`">{{ person.email }}</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="small-head">{{ t('about.board') }}</h3>
          <ul>
            <li v-for="person in org.board" :key="person.name">
              <strong>{{ person.name }}</strong>
              <span>{{ person.role }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="band" aria-labelledby="money-title">
      <div class="wrap section money">
        <div>
          <h2 id="money-title">{{ t('about.books') }}</h2>
          <p class="lead">
            {{ t('about.booksText') }}
            <NuxtLink v-if="report" :to="localePath(`/report/${report.year}`)">{{ t('about.readReport', { year: report.year }) }}</NuxtLink>.
          </p>
        </div>
        <dl>
          <div><dt>{{ t('about.status') }}</dt><dd>{{ t('about.statusValue') }}</dd></div>
          <div><dt>{{ t('about.ein') }}</dt><dd>{{ org.ein }}</dd></div>
          <div><dt>{{ t('about.founded') }}</dt><dd>{{ org.founded }}</dd></div>
          <div><dt>{{ t('about.note') }}</dt><dd>{{ t('about.noteValue', { name: org.name }) }}</dd></div>
        </dl>
      </div>
    </section>

    <section class="wrap section contact" aria-labelledby="contact-title">
      <h2 id="contact-title">{{ t('about.contact') }}</h2>
      <div class="contact-grid">
        <p class="lead">
          {{ org.address.street }}<br />
          {{ org.address.town }}, {{ org.address.state }}
        </p>
        <p class="lead">
          <a :href="`tel:${org.phone.replace(/[^0-9+]/g, '')}`">{{ org.phone }}</a><br />
          <a :href="`mailto:${org.email}`">{{ org.email }}</a>
        </p>
        <p class="muted">{{ t('about.office') }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.intro {
  padding-bottom: 3rem;
}
.intro h1 {
  max-width: 18ch;
}
.story {
  display: grid;
  grid-template-columns: 5fr 6fr;
  gap: clamp(2rem, 6vw, 6rem);
  align-items: start;
}
.story figure {
  margin: 0;
}
.story :deep(img) {
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
}
.people {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}
.small-head {
  font: 700 0.8rem/1.3 var(--sans);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.people ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.people li {
  display: flex;
  flex-direction: column;
  padding-block: 0.9rem;
  border-bottom: 1px solid var(--rule);
}
.people strong {
  font: 500 1.4rem/1.2 var(--serif);
}
.people span {
  color: var(--bark-soft);
}
.money {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(2rem, 6vw, 6rem);
}
dl {
  margin: 0;
}
dl div {
  display: grid;
  grid-template-columns: 9rem 1fr;
  gap: 1rem;
  padding-block: 0.7rem;
  border-bottom: 1px solid rgb(35 31 27 / 0.2);
}
dt {
  font-weight: 600;
}
dd {
  margin: 0;
}
.contact-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  border-top: 2px solid var(--bark);
  padding-top: 1.5rem;
}
@media (max-width: 860px) {
  .story,
  .people,
  .money,
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
