<script setup>
const route = useRoute()
const path = `/stories/${route.params.slug}`
const { t, locale } = useI18n()
const texts = useTexts()
const localePath = useLocalePath()
const { shortDate } = useFormat()
const { data: org } = await useOrg()
const { data: story } = await useAsyncData(`story-${locale.value}-${path}`, () =>
  queryCollection(texts('stories')).path(path).first(),
)
if (!story.value) throw createError({ statusCode: 404, statusMessage: 'Story not found', fatal: true })
const { data: more } = await useAsyncData(`more-${locale.value}-${path}`, () =>
  queryCollection(texts('stories')).where('path', '<>', path).order('date', 'DESC').limit(2).all(),
)
usePageMeta({ title: story.value.title, description: story.value.description, image: story.value.image })
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: story.value.title,
        description: story.value.description,
        datePublished: story.value.date,
        author: { '@type': 'Person', name: story.value.author },
        publisher: { '@type': 'NGO', name: org.value.name, url: org.value.url },
        image: `${org.value.url}/images/${useAppConfig().imageFiles[story.value.image]}`,
      }),
    },
  ],
})
</script>

<template>
  <article>
    <header class="wrap head">
      <NuxtLink :to="localePath('/stories')" class="back">{{ t('stories.title') }}</NuxtLink>
      <h1>{{ story.title }}</h1>
      <p class="lead">{{ story.description }}</p>
      <i18n-t keypath="stories.byline" tag="p" class="byline" scope="global">
        <template #author><strong>{{ story.author }}</strong></template>
        <template #date><time :datetime="story.date">{{ shortDate(story.date) }}</time></template>
      </i18n-t>
    </header>
    <figure class="hero">
      <Photo :name="story.image" eager />
      <figcaption v-if="story.caption" class="wrap">{{ story.caption }}</figcaption>
    </figure>
    <div class="wrap">
      <ContentRenderer :value="story" class="prose body" />
    </div>

    <aside v-if="more.length" class="wrap section more-stories" aria-labelledby="more-title">
      <div class="section-head">
        <h2 id="more-title">{{ t('stories.more') }}</h2>
        <NuxtLink class="more" :to="localePath('/stories')">{{ t('stories.all') }}</NuxtLink>
      </div>
      <ul>
        <li v-for="s in more" :key="s.path">
          <span class="kicker">{{ shortDate(s.date) }}</span>
          <NuxtLink :to="localePath(s.path)">{{ s.title }}</NuxtLink>
        </li>
      </ul>
    </aside>
  </article>
</template>

<style scoped>
.head {
  max-width: 52rem;
  padding-top: clamp(2.5rem, 6vw, 5rem);
  text-align: center;
}
.back {
  display: inline-block;
  margin-bottom: 1.5rem;
  font-weight: 600;
}
.back::before {
  content: '← ';
}
.head h1 {
  font-size: clamp(2.4rem, 5.4vw, 4.6rem);
}
.byline {
  color: var(--bark-soft);
}
.hero {
  margin: 2.5rem 0 0;
}
.hero :deep(img) {
  width: 100%;
  max-height: 80vh;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
figcaption {
  margin-top: 0.6rem;
  font-size: 0.9rem;
  color: var(--bark-soft);
}
.body {
  margin: 3.5rem auto 0;
}
.body :deep(> p:first-child::first-letter) {
  float: left;
  font: 500 4.6rem/0.82 var(--serif);
  margin: 0.35rem 0.6rem 0 0;
  color: var(--moss);
}
.more-stories ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
.more-stories a {
  font: 500 clamp(1.3rem, 2vw, 1.6rem) / 1.2 var(--serif);
  color: var(--bark);
}
@media (max-width: 640px) {
  .head {
    text-align: left;
  }
  .more-stories ul {
    grid-template-columns: 1fr;
  }
}
</style>
