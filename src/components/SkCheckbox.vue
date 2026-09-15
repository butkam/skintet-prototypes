<script setup lang="ts">
// Figma "Checkbox" (node 51:1253) — 18×18, radius/xs. Off: bg/canvas + border/strong · On: action/primary + check.
// Visual only: the interactive element is the parent (e.g. a card button).
import SkIcon from './SkIcon.vue'

defineProps<{ checked?: boolean }>()
</script>

<template>
  <span class="sk-checkbox" :class="{ 'is-checked': checked }" aria-hidden="true">
    <Transition name="sk-checkbox-pop">
      <SkIcon v-if="checked" name="CheckboxChecked" :size="18" class="sk-checkbox__on" />
    </Transition>
  </span>
</template>

<style scoped>
.sk-checkbox {
  position: relative;
  display: inline-block;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border: 1.5px solid var(--border-strong);
  border-radius: var(--radius-xs);
  background: var(--bg-canvas);
  transition: border-color 0.15s ease;
}

.sk-checkbox.is-checked {
  border-color: transparent;
}

.sk-checkbox__on {
  position: absolute;
  inset: -1.5px;
}

.sk-checkbox-pop-enter-active {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.15s ease;
}
.sk-checkbox-pop-leave-active {
  transition: transform 0.15s ease, opacity 0.15s ease;
}
.sk-checkbox-pop-enter-from,
.sk-checkbox-pop-leave-to {
  transform: scale(0.5);
  opacity: 0;
}
</style>
