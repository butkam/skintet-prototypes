<script setup lang="ts">
// Figma node 112:2194 — картка «Ви переглядали», 123×180
import SkIcon from './SkIcon.vue'

defineProps<{ title: string; price: string; image: string }>()
defineEmits<{ add: [] }>()
</script>

<template>
  <article class="mini-card">
    <img class="mini-card__image" :src="image" alt="" />
    <button class="mini-card__add" type="button" :aria-label="`Додати в кошик: ${title}`" @click="$emit('add')">
      <SkIcon name="PlusCircle" :size="30" />
    </button>
    <p class="mini-card__title body-s">{{ title }}</p>
    <p class="mini-card__price body-s">{{ price }}</p>
  </article>
</template>

<style scoped>
.mini-card {
  position: relative;
  flex-shrink: 0;
  width: 123px;
  height: 180px;
  padding: var(--space-2);
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
  color: var(--fg-default);
  scroll-snap-align: start;
}

.mini-card__image {
  width: 107px;
  height: 107px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

/* 30px glyph centred in a 44px tap target, glyph pinned to top-right of image */
.mini-card__add {
  position: absolute;
  top: 1px;
  right: 1px;
  display: grid;
  place-items: center;
  width: var(--control-tap-target-min);
  height: var(--control-tap-target-min);
  border-radius: var(--radius-full);
  transition: transform 0.2s ease;
}
.mini-card__add:active {
  transform: scale(0.88);
}
.mini-card__add:focus-visible {
  outline: var(--border-width-focus) solid var(--border-focus);
  outline-offset: -5px;
}

.mini-card__title {
  width: 99px;
  margin: 0 var(--space-1);
  height: 32px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.mini-card__price {
  margin: var(--space-1) var(--space-1) 0;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
</style>
