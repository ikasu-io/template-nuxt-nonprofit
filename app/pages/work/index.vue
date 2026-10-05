<script setup>
const { data: projects } = await useAsyncData('projects', () => queryCollection('projects').order('order', 'ASC').all())
usePageMeta({
  title: 'Our work',
  description: 'Streamside forests, dam removals, water testing with schools and river cleanups on the Sallow River and its creeks.',
  image: 'dam-after',
})
const statusLabel = { planned: 'Planned', underway: 'Underway', done: 'Done' }
</script>

<template>
  <div class="wrap section">
    <header class="intro">
      <span class="kicker">Our work</span>
      <h1>Four ways to fix a river</h1>
      <p class="lead">
        A river gets sick slowly: the trees along it go, a dam holds it back, trash and fertilizer wash in. We work on all of
        it at once, a mile at a time, with the people who live along the water.
      </p>
    </header>

    <ol class="projects">
      <li v-for="(project, i) in projects" :key="project.path" :class="['project', { flip: i % 2 }]">
        <NuxtLink :to="project.path" class="photo" tabindex="-1" aria-hidden="true">
          <Photo :name="project.image" desktop="50vw" />
        </NuxtLink>
        <div class="text">
          <p class="meta">
            <span :class="['status', project.status]">{{ statusLabel[project.status] }}</span>
            <span class="muted">{{ project.years }}</span>
          </p>
          <h2><NuxtLink :to="project.path">{{ project.title }}</NuxtLink></h2>
          <p>{{ project.summary }}</p>
          <p v-if="project.figures.length" class="figure">
            <strong>{{ project.figures[0].value }}</strong> {{ project.figures[0].label }}
          </p>
        </div>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.intro {
  max-width: 48rem;
  margin-bottom: var(--space);
}
.projects {
  list-style: none;
  margin: 0;
  padding: 0;
}
.project {
  display: grid;
  grid-template-columns: 6fr 5fr;
  gap: clamp(2rem, 5vw, 5rem);
  align-items: center;
  padding-block: clamp(2rem, 4vw, 3.5rem);
  border-top: 1px solid var(--rule);
}
.project.flip {
  grid-template-columns: 5fr 6fr;
}
.project.flip .photo {
  order: 2;
}
.photo :deep(img) {
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
}
.meta {
  display: flex;
  gap: 0.8rem;
  align-items: center;
  margin-bottom: 1rem;
}
h2 {
  font-size: clamp(1.8rem, 3.2vw, 2.6rem);
}
h2 a {
  color: var(--bark);
  text-decoration: none;
}
h2 a:hover {
  text-decoration: underline;
  text-decoration-thickness: 1px;
}
.figure {
  border-left: 3px solid var(--marigold);
  padding-left: 0.9rem;
  color: var(--bark-soft);
}
.figure strong {
  font: 500 1.4rem/1 var(--serif);
  color: var(--bark);
}
@media (max-width: 760px) {
  .project,
  .project.flip {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  .project.flip .photo {
    order: 0;
  }
}
</style>
