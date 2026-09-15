<script setup lang="ts">
// Figma 112:1545–1550 / 112:1594–1605: icon · title (Body/L) · caption (Body/S muted) · right side
import SkIcon, { type IconName } from '@/components/SkIcon.vue'

defineProps<{ icon: IconName; title: string; caption?: string }>()
</script>

<template>
  <div class="summary-row">
    <SkIcon :name="icon" class="summary-row__icon" />
    <div class="summary-row__text">
      <p class="summary-row__title body-l">{{ title }}</p>
      <slot name="caption">
        <p v-if="caption" class="summary-row__caption body-s">{{ caption }}</p>
      </slot>
    </div>
    <div class="summary-row__aside">
      <slot name="aside" />
    </div>
  </div>
</template>

<style scoped>
/* Aside (sum / «Змінити») sits on the title's baseline; the icon stays top-aligned */
.summary-row {
  display: flex;
  align-items: baseline;
  gap: 11px;
}

.summary-row__icon {
  align-self: flex-start;
  margin-left: -2px;
}

.summary-row__text {
  flex: 1;
  min-width: 0;
}

.summary-row__title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.summary-row__caption {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--action-primary-fg-disabled);
}

.summary-row__aside {
  flex-shrink: 0;
  text-align: right;
}
</style>
