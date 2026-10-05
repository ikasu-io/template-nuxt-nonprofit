<script setup>
const { data: org } = await useOrg()
const { data: report } = await useLatestReport()
usePageMeta({
  title: 'About',
  description: `How ${org.value.name} started, who runs it, and how to reach us.`,
  image: 'paddle',
})
</script>

<template>
  <div>
    <header class="wrap section intro">
      <span class="kicker">About</span>
      <h1>Started by anglers and a science teacher, run by its members</h1>
    </header>

    <div class="wrap story">
      <figure>
        <Photo name="paddle" desktop="45vw" eager />
      </figure>
      <div class="prose">
        <p class="lead">
          In {{ org.founded }}, a handful of people who fished the Sallow got tired of watching it fill up with tires and silt. They
          met in the back of the Wren Hollow library, and Gene Albright, who taught science at the high school, brought his class's
          water-test results.
        </p>
        <p>
          The first cleanup that spring filled four dumpsters. The first trees went in two years later, on a farm whose owner had
          seen the cleanup in the paper. Since then the alliance has grown to {{ org.members.toLocaleString('en-US') }} members,
          three staff and hundreds of volunteers a year, and it still works the same way: one stretch of river at a time, with the
          people who own the land along it.
        </p>
        <p>
          We are a member organization. Members elect the board at the annual meeting every March, and anyone who has paid dues
          can stand for it.
        </p>
      </div>
    </div>

    <section class="wrap section" aria-labelledby="people-title">
      <div class="section-head">
        <h2 id="people-title">The people</h2>
      </div>
      <div class="people">
        <div>
          <h3 class="small-head">Staff</h3>
          <ul>
            <li v-for="person in org.staff" :key="person.name">
              <strong>{{ person.name }}</strong>
              <span>{{ person.role }}</span>
              <a :href="`mailto:${person.email}`">{{ person.email }}</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="small-head">Board</h3>
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
          <h2 id="money-title">Open books</h2>
          <p class="lead">
            We publish where every dollar comes from and where it goes.
            <NuxtLink v-if="report" :to="`/report/${report.year}`">Read the {{ report.year }} annual report</NuxtLink>.
          </p>
        </div>
        <dl>
          <div><dt>Legal status</dt><dd>501(c)(3) nonprofit organization</dd></div>
          <div><dt>EIN</dt><dd>{{ org.ein }}</dd></div>
          <div><dt>Founded</dt><dd>{{ org.founded }}</dd></div>
          <div><dt>Note</dt><dd>{{ org.name }} is fictional. A real organization lists its tax ID and links its Form 990 here.</dd></div>
        </dl>
      </div>
    </section>

    <section class="wrap section contact" aria-labelledby="contact-title">
      <h2 id="contact-title">Get in touch</h2>
      <div class="contact-grid">
        <p class="lead">
          {{ org.address.street }}<br />
          {{ org.address.town }}, {{ org.address.state }}
        </p>
        <p class="lead">
          <a :href="`tel:${org.phone.replace(/[^0-9+]/g, '')}`">{{ org.phone }}</a><br />
          <a :href="`mailto:${org.email}`">{{ org.email }}</a>
        </p>
        <p class="muted">The office is usually staffed on weekday mornings. On Saturdays, we're out on the river.</p>
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
