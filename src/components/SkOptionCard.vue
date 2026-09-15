<script setup lang="ts">
// Figma nodes 112:1524 / 112:1569 / 112:1580 — option card with radio.
// radius/lg, border/default 1px · selected: border/focus 2px. Label Body/M, meta right Body/M, hint Body/S muted.
import SkRadio from './SkRadio.vue'

defineProps<{ label: string; meta?: string; hint?: string; selected?: boolean }>()
defineEmits<{ select: [] }>()
</script>

<template>
  <button
    class="sk-option"
    :class="{ 'is-selected': selected }"
    type="button"
    role="radio"
    :aria-checked="!!selected"
    @click="$emit('select')"
  >
    <span class="sk-option__row">
      <SkRadio :checked="selected" />
      <span class="sk-option__label body-m">{{ label }}</span>
      <span v-if="meta" class="sk-option__meta body-m">{{ meta }}</span>
    </span>
    <span v-if="hint || $slots.default" class="sk-option__extra">
      <span v-if="hint" class="sk-option__hint body-s">{{ hint }}</span>
      <slot />
    </span>
  </button>
</template>

<style scoped>
.sk-option {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  width: 100%;
  padding: 15px 15px 17px;
  border: var(--border-width-hairline) solid var(--border-default);
  border-radius: var(--radius-lg);
  background: var(--bg-canvas);
  color: var(--action-secondary-fg);
  text-align: left;
  /* Selected = 2px border without shifting content: 1px border + 1px inset ring */
  box-shadow: inset 0 0 0 0 transparent;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
}

.sk-option.is-selected {
  border-color: var(--border-focus);
  box-shadow: inset 0 0 0 1px var(--border-focus);
}

.sk-option:active {
  transform: scale(0.99);
}

.sk-option:focus-visible {
  outline: var(--border-width-focus) solid var(--border-focus);
  outline-offset: 3px;
}

.sk-option__row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.sk-option__label {
  flex: 1;
  min-width: 0;
}

.sk-option__meta {
  flex-shrink: 0;
  text-align: right;
}

.sk-option__extra {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  /* Align with the label: radio 18 + gap 12 */
  padding-left: calc(18px + var(--space-3));
}

.sk-option__hint {
  color: var(--fg-muted);
}
</style>
