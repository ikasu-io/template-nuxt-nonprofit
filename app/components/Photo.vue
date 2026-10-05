<script setup>
// A photo from public/images/, by name (`kingfisher`), with its description
// from content/images.yml. Converted to WebP at 480–1600 px when the site is
// generated; `desktop` is how wide it shows on screens wider than 860 px
// (on smaller screens photos are full width).
const props = defineProps({
  name: { type: String, required: true },
  desktop: { type: String, default: '100vw' },
  eager: Boolean,
})
const widths = [480, 800, 1200, 1600]
const img = useImage()
const files = useAppConfig().imageFiles
const { data: images } = await useAsyncData('images', () => queryCollection('images').first())
const src = computed(() => `/images/${files[props.name] ?? `${props.name}.jpg`}`)
const url = (width) => img(src.value, { width, format: 'webp' })
const srcset = computed(() => widths.map((w) => `${url(w)} ${w}w`).join(', '))
const alt = computed(() => images.value?.alt?.[props.name] ?? '')
</script>

<template>
  <img
    :src="url(1200)"
    :srcset="srcset"
    :sizes="`(max-width: 860px) 100vw, ${desktop}`"
    :alt="alt"
    :loading="eager ? 'eager' : 'lazy'"
    :fetchpriority="eager ? 'high' : undefined"
    decoding="async"
  />
</template>
