<script setup>
// Big numbers in a row, separated by thin rules.
defineProps({ figures: { type: Array, required: true } })
</script>

<template>
  <dl class="figures">
    <div v-for="figure in figures" :key="figure.label" class="figure">
      <dt>{{ figure.value }}</dt>
      <dd>{{ figure.label }}</dd>
    </div>
  </dl>
</template>

<style scoped>
.figures {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  margin: 0;
}
.figure {
  padding: 0.5rem 1.5rem 0.5rem 0;
  margin-bottom: 1.5rem;
}
.figure + .figure {
  border-left: 1px solid rgb(35 31 27 / 0.25);
  padding-left: 1.5rem;
}
dt {
  font: 400 clamp(2.8rem, 5.5vw, 4.6rem) / 1 var(--serif);
  letter-spacing: -0.03em;
  font-variant-numeric: lining-nums;
}
dd {
  margin: 0.6rem 0 0;
  max-width: 18ch;
  color: var(--bark-soft);
}
@media (max-width: 560px) {
  .figure + .figure {
    border-left: 0;
    padding-left: 0;
  }
  .figure {
    border-top: 1px solid rgb(35 31 27 / 0.25);
    padding-top: 1rem;
  }
}
</style>
