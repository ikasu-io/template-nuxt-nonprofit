<script setup>
const today = useBuildDay()
const { data: org } = await useOrg()
const [{ data: campaign }, { data: impact }, { data: days }, { data: stories }, { data: report }] = await Promise.all([
  useAsyncData('campaign', () => queryCollection('campaign').first()),
  useAsyncData('impact', () => queryCollection('impact').first()),
  useAsyncData('next-days', () => queryCollection('volunteer').where('date', '>=', today.value).order('date', 'ASC').limit(3).all()),
  useAsyncData('latest-stories', () => queryCollection('stories').order('date', 'DESC').limit(3).all()),
  useLatestReport(),
])

const daysLeft = computed(() => daysBetween(today.value, campaign.value.ends))
const percent = computed(() => Math.min(100, Math.round((campaign.value.raised / campaign.value.goal) * 100)))

usePageMeta({ title: `${org.value.name} — ${org.value.tagline}`, description: org.value.description })
useHead({ titleTemplate: '%s' })
</script>

<template>
  <div>
    <!-- A magazine spread: words on the left, the river bleeding off the right edge -->
    <section class="hero">
      <div class="hero-text">
        <span class="kicker">Since {{ org.founded }} · {{ org.address.town }}, Ohio</span>
        <h1>{{ org.tagline.replace(/\.$/, '') }}<span class="dot">.</span></h1>
        <p class="lead">{{ org.description }}</p>
        <div class="buttons">
          <NuxtLink class="button" to="/volunteer">Volunteer with us</NuxtLink>
          <NuxtLink class="button ghost" to="/donate">Give</NuxtLink>
        </div>
      </div>
      <figure class="hero-photo">
        <Photo name="hero-river" desktop="60vw" eager />
      </figure>
    </section>

    <!-- The current campaign -->
    <section class="section wrap campaign" aria-labelledby="campaign-title">
      <div class="campaign-text">
        <span class="kicker">{{ daysLeft > 0 ? 'This season' : 'Thank you' }}</span>
        <h2 id="campaign-title">{{ campaign.title }}</h2>
        <p class="lead">{{ campaign.text }}</p>
        <div class="progress">
          <p class="raised">
            <strong>{{ money(campaign.raised) }}</strong>
            <span>raised of {{ money(campaign.goal) }}</span>
          </p>
          <div class="track" role="progressbar" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100" :aria-label="`${percent}% of the goal`">
            <div class="fill" :style="{ width: `${percent}%` }" />
          </div>
          <p class="left">
            <template v-if="daysLeft > 1">{{ percent }}% there · {{ daysLeft }} days left</template>
            <template v-else-if="daysLeft >= 0">{{ percent }}% there · last day</template>
            <template v-else>The campaign closed on {{ shortDate(campaign.ends) }}. Thank you to everyone who gave.</template>
          </p>
        </div>
        <NuxtLink v-if="daysLeft >= 0" class="button" to="/donate">Plant a tree for $6</NuxtLink>
      </div>
      <figure class="campaign-photo">
        <Photo :name="campaign.image" desktop="40vw" />
      </figure>
    </section>

    <!-- What it has added up to -->
    <section class="band impact" aria-labelledby="impact-title">
      <div class="wrap section">
        <h2 id="impact-title" class="impact-title">What {{ Number(today.slice(0, 4)) - impact.since }} years of neighbors have done</h2>
        <Figures :figures="impact.figures" />
      </div>
    </section>

    <!-- Three ways to help -->
    <section class="section wrap" aria-labelledby="help-title">
      <div class="section-head">
        <h2 id="help-title">Three ways to help</h2>
      </div>
      <ol class="ways">
        <li>
          <span class="n">01</span>
          <h3><NuxtLink to="/volunteer">Come out on a Saturday</NuxtLink></h3>
          <p>Plant trees, pull tires out of the river or count mayflies. No experience needed; we bring the tools and the coffee.</p>
        </li>
        <li>
          <span class="n">02</span>
          <h3><NuxtLink to="/donate">Give once or every month</NuxtLink></h3>
          <p>$25 plants four trees. Monthly gifts let us plan a whole season ahead.</p>
        </li>
        <li>
          <span class="n">03</span>
          <h3><NuxtLink to="/donate">Become a member</NuxtLink></h3>
          <p>Members vote for the board, get the river report twice a year and paddle with us at member prices.</p>
        </li>
      </ol>
    </section>

    <!-- The next volunteer days -->
    <section class="section wrap next" aria-labelledby="next-title">
      <div class="section-head">
        <h2 id="next-title">Next volunteer days</h2>
        <NuxtLink class="more" to="/volunteer">All dates</NuxtLink>
      </div>
      <div v-if="days.length">
        <VolunteerDay v-for="day in days" :key="day.path" :day="day" />
      </div>
      <p v-else class="lead">Nothing on the calendar right now. New dates are posted every season; write to us and we'll let you know.</p>
    </section>

    <!-- Stories -->
    <section class="section wrap" aria-labelledby="stories-title">
      <div class="section-head">
        <h2 id="stories-title">From the river</h2>
        <NuxtLink class="more" to="/stories">All stories</NuxtLink>
      </div>
      <div v-if="stories.length" class="stories">
        <article class="story first">
          <NuxtLink :to="stories[0].path" class="story-link">
            <Photo :name="stories[0].image" desktop="60vw" />
            <span class="kicker">{{ shortDate(stories[0].date) }}</span>
            <h3>{{ stories[0].title }}</h3>
          </NuxtLink>
          <p class="muted">{{ stories[0].description }}</p>
        </article>
        <div class="others">
          <article v-for="story in stories.slice(1)" :key="story.path" class="story">
            <NuxtLink :to="story.path" class="story-link">
              <Photo :name="story.image" desktop="30vw" />
              <span class="kicker">{{ shortDate(story.date) }}</span>
              <h3>{{ story.title }}</h3>
            </NuxtLink>
          </article>
        </div>
      </div>
    </section>

    <section v-if="report" class="wrap report-line">
      <p>
        Where the money goes, down to the dollar:
        <NuxtLink class="more" :to="`/report/${report.year}`">the {{ report.year }} annual report</NuxtLink>
      </p>
    </section>
  </div>
</template>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: minmax(var(--gutter), 1fr) minmax(0, calc(var(--max) * 0.42)) minmax(0, calc(var(--max) * 0.58)) minmax(var(--gutter), 1fr);
  min-height: min(86vh, 860px);
}
.hero-text {
  grid-column: 2;
  align-self: center;
  padding: 3.5rem 3rem 3.5rem 0;
}
.hero h1 {
  font-size: clamp(2.8rem, 5.6vw, 5.2rem);
  font-weight: 450;
}
.dot {
  color: var(--marigold);
}
.hero .lead {
  max-width: 30rem;
  margin-bottom: 2rem;
}
.hero-photo {
  grid-column: 3 / 5;
  margin: 0;
  position: relative;
}
.hero-photo :deep(img) {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.campaign {
  display: grid;
  grid-template-columns: 7fr 5fr;
  gap: clamp(2rem, 6vw, 6rem);
  align-items: center;
}
.campaign h2 {
  font-size: clamp(2.2rem, 4.6vw, 3.8rem);
}
.progress {
  margin: 2.2rem 0;
}
.raised {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.2rem 0.8rem;
  margin-bottom: 0.8rem;
}
.raised strong {
  font: 500 clamp(2.6rem, 5vw, 4rem) / 1 var(--serif);
  letter-spacing: -0.02em;
}
.raised span {
  color: var(--bark-soft);
}
.track {
  height: 14px;
  background: var(--bone-deep);
  border-radius: 999px;
  overflow: hidden;
}
.fill {
  height: 100%;
  background: linear-gradient(90deg, var(--moss), #6f8f3a);
  border-radius: 999px;
}
.left {
  margin: 0.7rem 0 0;
  font-weight: 600;
}
.campaign-photo {
  margin: 0;
}
.campaign-photo :deep(img) {
  aspect-ratio: 4 / 5;
  object-fit: cover;
  width: 100%;
}

.impact-title {
  max-width: 20ch;
  margin-bottom: 2.5rem;
}

.ways {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
}
.ways li {
  border-top: 1px solid var(--rule);
  padding-top: 1.25rem;
}
.n {
  display: block;
  font: 300 1.4rem/1 var(--serif);
  color: var(--clay);
  margin-bottom: 1.2rem;
}
.ways h3 a {
  color: var(--bark);
  text-decoration-color: var(--marigold);
  text-decoration-thickness: 2px;
}
.ways p {
  color: var(--bark-soft);
}

.stories {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem 3rem;
}
.others {
  display: grid;
  align-content: start;
  gap: 2rem;
}
.story-link {
  color: var(--bark);
  text-decoration: none;
}
.story-link :deep(img) {
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  margin-bottom: 1rem;
}
.story-link:hover h3 {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.15em;
}
.story .kicker {
  margin-bottom: 0.4rem;
}
.story h3 {
  font-size: clamp(1.3rem, 1.8vw, 1.55rem);
}
.story.first h3 {
  font-size: clamp(1.8rem, 3.2vw, 2.6rem);
}

.report-line p {
  margin: 0;
  padding-top: 1.5rem;
  border-top: 2px solid var(--bark);
  font: 400 clamp(1.3rem, 2.2vw, 1.7rem) / 1.3 var(--serif);
}
.report-line .more {
  font-family: var(--sans);
  font-size: 1rem;
  margin-left: 0.4rem;
}

@media (max-width: 860px) {
  .hero {
    grid-template-columns: var(--gutter) 1fr var(--gutter);
    min-height: 0;
  }
  .hero-photo {
    grid-column: 1 / -1;
    grid-row: 1;
    aspect-ratio: 4 / 3;
  }
  .hero-text {
    grid-column: 2;
    padding: 2.5rem 0 1rem;
  }
  .campaign,
  .stories {
    grid-template-columns: 1fr;
  }
  .campaign-photo {
    order: -1;
  }
  .campaign-photo :deep(img) {
    aspect-ratio: 3 / 2;
  }
  .ways {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
