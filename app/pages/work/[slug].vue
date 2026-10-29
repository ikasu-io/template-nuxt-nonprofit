<script setup>
const route = useRoute()
const path = `/work/${route.params.slug}`
const { t, locale } = useI18n()
const texts = useTexts()
const localePath = useLocalePath()
const { data: project } = await useAsyncData(`project-${locale.value}-${path}`, () =>
  queryCollection(texts('projects')).path(path).first(),
)
if (!project.value) throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
usePageMeta({ title: project.value.title, description: project.value.summary, image: project.value.image })
</script>

<template>
  <article>
    <header class="wrap head">
      <NuxtLink :to="localePath('/work')" class="back">{{ t('work.title') }}</NuxtLink>
      <p class="meta">
        <span :class="['status', project.status]">{{ t(`status.${project.status}`) }}</span>
        <span class="muted">{{ project.place }} · {{ project.years }}</span>
      </p>
      <h1>{{ project.title }}</h1>
      <p class="lead">{{ project.summary }}</p>
    </header>

    <div v-if="project.before && project.after" class="wrap pair">
      <figure>
        <Photo :name="project.before" desktop="50vw" eager />
        <figcaption><strong>{{ t('work.before') }}</strong></figcaption>
      </figure>
      <figure>
        <Photo :name="project.after" desktop="50vw" eager />
        <figcaption><strong>{{ t('work.after') }}</strong></figcaption>
      </figure>
    </div>
    <figure v-else class="wrap single">
      <Photo :name="project.image" desktop="1240px" eager />
    </figure>

    <div class="wrap body">
      <aside class="side">
        <Figures v-if="project.figures.length" :figures="project.figures" class="side-figures" />
        <div v-if="project.partners.length" class="partners">
          <h2 class="small-head">{{ t('work.with') }}</h2>
          <ul>
            <li v-for="partner in project.partners" :key="partner">{{ partner }}</li>
          </ul>
        </div>
      </aside>
      <ContentRenderer :value="project" class="prose" />
    </div>

    <div class="wrap cta">
      <p>{{ t('work.help') }}</p>
      <div class="buttons">
        <NuxtLink class="button" :to="localePath('/volunteer')">{{ t('work.days') }}</NuxtLink>
        <NuxtLink class="button ghost" :to="localePath('/donate')">{{ t('work.give') }}</NuxtLink>
      </div>
    </div>
  </article>
</template>

<style scoped>
.head {
  padding-top: clamp(2.5rem, 6vw, 5rem);
  max-width: 60rem;
  margin-inline: auto;
}
.back {
  display: inline-block;
  margin-bottom: 1.5rem;
  font-weight: 600;
}
.back::before {
  content: '← ';
}
.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  align-items: center;
}
.pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-block: 2.5rem;
}
.pair figure,
.single {
  margin-block: 2.5rem;
  margin-inline: auto;
}
.pair figure {
  margin: 0;
}
.pair :deep(img) {
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
}
.single :deep(img) {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
figcaption {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.body {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: clamp(2rem, 6vw, 6rem);
  padding-block: 2rem var(--space);
}
.side .side-figures {
  display: block;
}
.side .side-figures :deep(.figure) {
  border-left: 0;
  padding-left: 0;
  border-top: 1px solid var(--rule);
  padding-top: 1rem;
}
.side-figures :deep(dt) {
  font-size: clamp(2.2rem, 3.5vw, 3rem);
}
.small-head {
  font: 700 0.8rem/1.3 var(--sans);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.partners ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.partners li {
  padding-block: 0.4rem;
  border-bottom: 1px solid var(--rule);
}
.cta {
  border-top: 2px solid var(--bark);
  padding-top: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.cta p {
  margin: 0;
  font: 400 clamp(1.5rem, 2.5vw, 2rem) / 1.2 var(--serif);
}
@media (max-width: 760px) {
  .pair,
  .body {
    grid-template-columns: 1fr;
  }
  .side {
    order: 2;
  }
}
</style>
