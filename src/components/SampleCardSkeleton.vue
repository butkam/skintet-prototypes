<script setup lang="ts">
// Плейсхолдер картки семплу: порожній прямокутник розміром із SampleCard.vue (123×156).
// Без начинки — тримає місце й ритм ряду, поки картки не під'їхали.
</script>

<template>
  <div class="sk-card" aria-hidden="true" />
</template>

<style scoped>
.sk-card {
  position: relative;
  flex-shrink: 0;
  width: 123px;
  height: 156px;
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
  overflow: hidden;
}

/* Світла хвиля по картці; --d розводить її по сусідах, щоб вона йшла вздовж ряду */
.sk-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, transparent 20%, var(--neutral-0) 50%, transparent 80%);
  opacity: 0.75;
  transform: translateX(-100%);
  animation: sk-sweep 1.3s ease-in-out infinite;
  animation-delay: var(--d, 0ms);
}

@keyframes sk-sweep {
  to {
    transform: translateX(100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .sk-card::after {
    display: none;
  }
}
</style>
