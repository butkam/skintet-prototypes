<script setup lang="ts">
// Figma 161:8204 — картка набору семплів у панелі подарунків: чекбокс, фото праворуч,
// назва Heading/S і опис Body/S. Обраний — рамка 2px, недоступний (ліміт) — 50% прозорості.
import { computed, onMounted, ref } from 'vue'
import SkCheckbox from './SkCheckbox.vue'

const props = defineProps<{
  title: string
  description?: string
  image: string
  selected?: boolean
  /** Limit reached and this one isn't selected */
  disabled?: boolean
}>()

// «Набір семплів “Осінній догляд”» → «Осінній догляд»
const name = computed(() => props.title.match(/[“"«](.+)[”"»]/)?.[1] ?? props.title)

// The description fills what the title leaves: 2 lines under a 2-line title, 3 under a 1-line one
const titleEl = ref<HTMLElement | null>(null)
const descLines = ref(2)
function measure() {
  const lineHeight = parseFloat(getComputedStyle(titleEl.value!).lineHeight) || 20
  descLines.value = titleEl.value!.offsetHeight > lineHeight * 1.5 ? 2 : 3
}
onMounted(() => {
  measure()
  document.fonts?.ready.then(measure)
})
</script>

<template>
  <button
    class="sample"
    :class="{ 'is-selected': selected, 'is-disabled': disabled }"
    type="button"
    role="checkbox"
    :aria-checked="!!selected"
    :aria-disabled="disabled || undefined"
    :aria-label="title"
  >
    <SkCheckbox class="sample__checkbox" :checked="selected" />
    <img class="sample__image" :src="image" alt="" />
    <span class="sample__text">
      <span ref="titleEl" class="sample__title heading-s">{{ name }}</span>
      <span v-if="description" class="sample__desc body-s" :style="{ WebkitLineClamp: descLines }">{{ description }}</span>
    </span>
  </button>
</template>

<style scoped>
.sample {
  position: relative;
  flex-shrink: 0;
  width: 123px;
  height: 156px;
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
  color: var(--fg-default);
  text-align: left;
  scroll-snap-align: start;
  transition: opacity 0.2s ease, transform 0.15s ease;
}

/* 2px selected border — drawn as an overlay so nothing shifts */
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

.sample__checkbox {
  position: absolute;
  top: var(--space-3);
  left: var(--space-3);
}

.sample__image {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  width: 56px;
  height: 56px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

/* Text starts 4px under the photo and stops 12px above the bottom edge */
.sample__text {
  position: absolute;
  top: 68px;
  left: var(--space-3);
  right: var(--space-3);
  bottom: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  overflow: hidden;
}

.sample__title,
.sample__desc {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.sample__title {
  flex-shrink: 0;
  -webkit-line-clamp: 2;
  /* A word wider than the card («бестселери») wraps, so the clamp ends it with «…» */
  overflow-wrap: anywhere;
}

.sample__desc {
  color: var(--neutral-600);
}
</style>
