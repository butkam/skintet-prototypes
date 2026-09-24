<script setup lang="ts" generic="T extends string | number">
// Figma "Dropdown" (node 204:1383): bg/surface pill, 2px border swapping to border/focus when open,
// padding space/4, gap space/2, value Body/M + 16px chevron.
// Native <select> overlay → the OS picker on mobile.
import SkIcon from './SkIcon.vue'

defineProps<{ options: T[]; label?: string; format?: (option: T) => string }>()
const model = defineModel<T>({ required: true })
</script>

<template>
  <label class="sk-select">
    <span class="sk-select__value body-m">{{ format ? format(model) : model }}</span>
    <SkIcon name="ChevronDownDropdown" :size="16" />
    <select v-model="model" class="sk-select__native" :aria-label="label">
      <option v-for="option in options" :key="option" :value="option">
        {{ format ? format(option) : option }}
      </option>
    </select>
  </label>
</template>

<style scoped>
.sk-select {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  height: 48px;
  padding: 0 var(--space-4);
  border: 2px solid var(--bg-surface);
  border-radius: var(--radius-full);
  background: var(--bg-surface);
  color: var(--fg-default);
  font-variant-numeric: tabular-nums;
  cursor: pointer;
}

.sk-select__value {
  white-space: nowrap;
}

.sk-select__native {
  position: absolute;
  inset: 0;
  width: 100%;
  opacity: 0;
  /* 16px keeps iOS from zooming the page when the picker opens */
  font-size: 16px;
  cursor: pointer;
}

.sk-select:focus-within {
  border-color: var(--border-focus);
}
</style>
