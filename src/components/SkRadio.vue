<script setup lang="ts">
// Figma "Radio" (node 112:1074) — 18×18, radius/full. Off: border/strong · On: action/primary ring + 8px dot.
// Visual only: the interactive element is the parent (e.g. an option card).
import SkIcon from './SkIcon.vue'

defineProps<{ checked?: boolean }>()
</script>

<template>
  <span class="sk-radio" :class="{ 'is-checked': checked }" aria-hidden="true">
    <Transition name="sk-radio-pop">
      <SkIcon v-if="checked" name="RadioSelected" :size="18" class="sk-radio__on" />
    </Transition>
  </span>
</template>

<style scoped>
.sk-radio {
  position: relative;
  display: inline-block;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border: 1.5px solid var(--border-strong);
  border-radius: var(--radius-full);
  background: var(--bg-canvas);
}

.sk-radio.is-checked {
  border-color: transparent;
}

.sk-radio__on {
  position: absolute;
  inset: -1.5px;
}

.sk-radio-pop-enter-active {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.15s ease;
}
.sk-radio-pop-leave-active {
  transition: opacity 0.12s ease;
}
.sk-radio-pop-enter-from {
  transform: scale(0.4);
  opacity: 0;
}
.sk-radio-pop-leave-to {
  opacity: 0;
}
</style>
