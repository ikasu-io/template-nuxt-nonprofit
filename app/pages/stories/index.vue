<script setup>
const { data: stories } = await useAsyncData('stories', () => queryCollection('stories').order('date', 'DESC').all())
usePageMeta({
  title: 'Stories',
  description: 'News and long reads from the Sallow River: dam removals, kingfishers, what students found in the water.',
  image: stories.value[0]?.image,
})
</script>

<template>
  <div class="wrap section">
    <header class="intro">
      <span class="kicker">Stories</span>
      <h1>From the river</h1>
    </header>
    <ol class="list">
      <li v-for="(story, i) in stories" :key="story.path" :class="{ lead: i === 0 }">
        <NuxtLink :to="story.path" class="photo" tabindex="-1" aria-hidden="true">
          <Photo :name="story.image" :desktop="i === 0 ? '60vw' : '33vw'" :eager="i === 0" />
        </NuxtLink>
        <div>
          <span class="kicker">{{ shortDate(story.date) }} · {{ story.author }}</span>
          <h2><NuxtLink :to="story.path">{{ story.title }}</NuxtLink></h2>
          <p class="muted">{{ story.description }}</p>
        </div>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.intro {
  margin-bottom: 3rem;
}
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem 2.5rem;
}
.list li {
  border-top: 1px solid var(--rule);
  padding-top: 1.5rem;
}
.list li.lead {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 2.5rem;
  align-items: end;
  border-top: 2px solid var(--bark);
}
.photo :deep(img) {
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  margin-bottom: 1rem;
}
.kicker {
  margin-bottom: 0.5rem;
}
h2 {
  font-size: clamp(1.4rem, 2vw, 1.7rem);
}
.lead h2 {
  font-size: clamp(2rem, 4vw, 3.4rem);
}
h2 a {
  color: var(--bark);
  text-decoration: none;
}
h2 a:hover {
  text-decoration: underline;
  text-decoration-thickness: 1px;
}
@media (max-width: 860px) {
  .list,
  .list li.lead {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
