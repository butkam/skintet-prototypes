<script setup lang="ts">
// Figma node 112:1994 (закрито — ціна «1 ₴») і 112:2392 (вибір — чекбокс, обраний з рамкою, інші задізейблені)
import SkCheckbox from './SkCheckbox.vue'
import { formatAmount } from '@/data/catalog'

defineProps<{
  title: string
  image: string
  price: number
  /** Choosing is unlocked (сума ≥ 5 000 ₴) */
  selectable?: boolean
  selected?: boolean
  /** Limit reached and this one isn't selected */
  disabled?: boolean
}>()
</script>

<template>
  <button
    class="sample"
    :class="{ 'is-selectable': selectable, 'is-selected': selected, 'is-disabled': disabled }"
    type="button"
    :role="selectable ? 'checkbox' : undefined"
    :aria-checked="selectable ? !!selected : undefined"
    :aria-disabled="disabled || undefined"
  >
    <img class="sample__image" :src="image" alt="" />
    <SkCheckbox v-if="selectable" class="sample__checkbox" :checked="selected" />
    <span v-else class="sample__price body-s">{{ formatAmount(price) }}</span>
    <span class="sample__title body-s">{{ title }}</span>
  </button>
</template>

<style scoped>
.sample {
  position: relative;
  flex-shrink: 0;
  width: 123px;
  height: 159px;
  padding: var(--space-2);
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
  color: var(--fg-default);
  text-align: left;
  scroll-snap-align: start;
  transition: opacity 0.2s ease, transform 0.15s ease;
}

/* 2px selected border (node 112:2393) — drawn as an overlay so nothing shifts */
.sample::after {
  content: '';
  position: absolute;
  inset: 0;
  border: var(--border-width-thick) solid var(--action-secondary-border);
  border-radius: inherit;
  opacity: 0;
  transform: scale(1.04);
  transition: opacity 0.15s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
}

.sample.is-selected::after {
  opacity: 1;
  transform: scale(1);
}

.sample:active:not(.is-disabled) {
  transform: scale(0.97);
}

.sample.is-disabled {
  opacity: 0.5;
  cursor: default;
}

.sample:focus-visible {
  outline: var(--border-width-focus) solid var(--border-focus);
  outline-offset: 2px;
}

.sample__image {
  width: 107px;
  height: 107px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

.sample__price {
  position: absolute;
  top: 13px;
  right: var(--space-3);
  color: var(--neutral-1000);
}

.sample__checkbox {
  position: absolute;
  top: var(--space-3);
  left: var(--space-3);
}

.sample__title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin: 0 var(--space-1);
}
</style>
