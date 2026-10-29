<script setup>
const { data: org } = await useOrg()
const { t, locale, locales } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const links = [
  { to: '/work', label: 'header.work' },
  { to: '/volunteer', label: 'header.volunteer' },
  { to: '/stories', label: 'header.stories' },
  { to: '/about', label: 'header.about' },
]
// The same page in the other language, named in that language.
const others = computed(() => locales.value.filter((l) => l.code !== locale.value))
// Close the mobile menu when a link in it is followed.
const menu = ref(null)
const close = () => menu.value?.hidePopover?.()
</script>

<template>
  <header class="header">
    <div class="wrap bar">
      <NuxtLink :to="localePath('/')" class="brand" :aria-label="t('header.home', { name: org.name })">
        <svg class="mark" viewBox="0 0 40 40" aria-hidden="true">
          <circle cx="20" cy="20" r="19" fill="#4a6b2a" />
          <path d="M5 23c5-5 9 3 15-2s9-6 15-1" fill="none" stroke="#f6f3ec" stroke-width="3" stroke-linecap="round" />
          <path d="M8 29c4-3 8 2 12-1s8-4 12-1" fill="none" stroke="#d3e6e4" stroke-width="2.4" stroke-linecap="round" />
          <path d="M20 7v9M16 12l4-5 4 5" fill="none" stroke="#e0a21b" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="name">Sallow River <em>Alliance</em></span>
      </NuxtLink>

      <nav :aria-label="t('header.nav')" class="nav">
        <NuxtLink v-for="link in links" :key="link.to" :to="localePath(link.to)">{{ t(link.label) }}</NuxtLink>
        <NuxtLink
          v-for="other in others"
          :key="other.code"
          :to="switchLocalePath(other.code)"
          :lang="other.language"
          :hreflang="other.language"
          class="language"
        >{{ other.name }}</NuxtLink>
      </nav>
      <NuxtLink :to="localePath('/donate')" class="button donate">{{ t('header.donate') }}</NuxtLink>

      <button class="menu-button" popovertarget="menu" :aria-label="t('header.menu')">
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
      </button>
      <div id="menu" ref="menu" popover class="menu">
        <button class="menu-close" popovertarget="menu" popovertargetaction="hide" :aria-label="t('header.closeMenu')">×</button>
        <nav :aria-label="t('header.navMobile')">
          <NuxtLink v-for="link in links" :key="link.to" :to="localePath(link.to)" @click="close">{{ t(link.label) }}</NuxtLink>
          <NuxtLink :to="localePath('/donate')" @click="close">{{ t('header.donate') }}</NuxtLink>
          <NuxtLink
            v-for="other in others"
            :key="other.code"
            :to="switchLocalePath(other.code)"
            :lang="other.language"
            :hreflang="other.language"
            class="language"
            @click="close"
          >{{ other.name }}</NuxtLink>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  border-bottom: 1px solid var(--rule);
}
.bar {
  display: flex;
  align-items: center;
  gap: 2rem;
  min-height: 76px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-right: auto;
  color: var(--bark);
  text-decoration: none;
}
.mark {
  width: 40px;
  height: 40px;
  flex: none;
}
.name {
  font: 600 1.3rem/1 var(--serif);
  letter-spacing: -0.01em;
}
.name em {
  font-style: normal;
  font-weight: 400;
  color: var(--moss);
}
.nav {
  display: flex;
  gap: 1.75rem;
}
.nav a {
  color: var(--bark);
  font-weight: 500;
  text-decoration: none;
  padding-block: 0.4rem;
  border-bottom: 2px solid transparent;
}
.nav a:hover,
.nav a.router-link-active {
  border-bottom-color: var(--marigold);
}
.nav .language {
  padding-left: 1.75rem;
  border-left: 1px solid var(--rule);
  border-bottom: 0;
}
.nav .language:hover {
  text-decoration: underline;
}
.donate {
  min-height: 42px;
  padding-block: 0.5rem;
}
.menu-button {
  display: none;
  width: 48px;
  height: 48px;
  border: 0;
  background: none;
  color: var(--bark);
  cursor: pointer;
}
.menu {
  inset: 0 0 auto auto;
  width: min(100%, 22rem);
  height: 100dvh;
  margin: 0;
  padding: 1.25rem var(--gutter);
  border: 0;
  background: var(--bark);
  color: var(--bone);
}
.menu::backdrop {
  background: rgb(35 31 27 / 0.5);
}
.menu nav {
  display: flex;
  flex-direction: column;
  margin-top: 3rem;
}
.menu nav a {
  color: var(--bone);
  font: 500 1.9rem/1.2 var(--serif);
  text-decoration: none;
  padding-block: 0.6rem;
  border-bottom: 1px solid rgb(246 243 236 / 0.2);
}
.menu nav .language {
  margin-top: 1.5rem;
  border-bottom: 0;
  font: 500 1.1rem/1.2 var(--sans);
}
.menu-close {
  float: right;
  width: 48px;
  height: 48px;
  border: 0;
  background: none;
  color: var(--bone);
  font-size: 2.2rem;
  line-height: 1;
  cursor: pointer;
}
/* Below these widths the links move into the menu. German needs more
   room: its words are longer. */
@media (max-width: 960px) {
  .nav,
  .donate {
    display: none;
  }
  .menu-button {
    display: block;
  }
}
@media (max-width: 1100px) {
  :lang(de) .nav,
  :lang(de) .donate {
    display: none;
  }
  :lang(de) .menu-button {
    display: block;
  }
}
</style>
