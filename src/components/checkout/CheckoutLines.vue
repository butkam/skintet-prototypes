<script setup lang="ts">
// Order positions: thumb · title · qty × price · line sum. Shared by the expandable order (mobile)
// and the order column on desktop
import { useCart } from '@/composables/useCart'
import { formatPrice } from '@/data/catalog'

defineProps<{ size?: 'm' | 'l' }>()

const cart = useCart()
</script>

<template>
  <ul class="lines" :class="{ 'lines--l': size === 'l' }">
    <li v-for="line in cart.lines.value" :key="line.id" class="lines__line">
      <img class="lines__thumb" :src="line.image" alt="" />
      <div class="lines__text">
        <p class="lines__title body-m">{{ line.title }}</p>
        <p class="lines__meta body-s">{{ line.qty }} × {{ formatPrice(line.price) }}</p>
      </div>
      <span class="body-m">{{ formatPrice(line.price * line.qty) }}</span>
    </li>
  </ul>
</template>

<style scoped>
.lines {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Line sum sits on the title's baseline */
.lines__line {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
}

.lines__line > .body-m {
  flex-shrink: 0;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.lines__thumb {
  align-self: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

.lines--l {
  gap: var(--space-4);
}
.lines--l .lines__thumb {
  width: 56px;
  height: 56px;
}

.lines__text {
  flex: 1;
  min-width: 0;
}

.lines__title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.lines--l .lines__title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  white-space: normal;
}

.lines__meta {
  color: var(--fg-muted);
}
</style>
