<script setup lang="ts">
// Подарунок-товар у панелі подарунків: картка «Рекомендованих» (ProductMiniCard, Figma 112:2194) без «Купити»,
// з чекбоксом зліва вгорі поверх фото. Стани — як у SampleCard: обраний — рамка 2px, недоступний (ліміт) — 50%.
import SkCheckbox from './SkCheckbox.vue'
import { formatAmount } from '@/data/catalog'

defineProps<{
  title: string
  image: string
  /** Ціна подарунка в кошику */
  price: number
  /** Повна ціна товару — закреслена поруч */
  oldPrice?: number
  /** Новинка: білий бейдж NEW справа вгорі, навпроти чекбокса */
  isNew?: boolean
  selected?: boolean
  /** Limit reached and this one isn't selected */
  disabled?: boolean
}>()
</script>

<template>
  <button
    class="gift-card"
    :class="{ 'is-selected': selected, 'is-disabled': disabled }"
    type="button"
    role="checkbox"
    :aria-checked="!!selected"
    :aria-disabled="disabled || undefined"
    :aria-label="isNew ? `${title}, новинка` : title"
  >
    <SkCheckbox class="gift-card__checkbox" :checked="selected" />
    <span v-if="isNew" class="gift-card__badge" aria-hidden="true">NEW</span>
    <img class="gift-card__image" :src="image" alt="" />
    <span class="gift-card__title body-s">{{ title }}</span>
    <!-- Ціни озвучує скрінрідер з кошика; тут вистачає назви -->
    <span class="gift-card__prices body-s" aria-hidden="true">
      <span>{{ formatAmount(price) }}</span>
      <s v-if="oldPrice" class="gift-card__old-price">{{ formatAmount(oldPrice) }}</s>
    </span>
  </button>
</template>

<style scoped>
.gift-card {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 123px;
  padding: var(--space-2);
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
  color: var(--fg-default);
  text-align: left;
  scroll-snap-align: start;
  transition: opacity 0.2s ease, transform 0.15s ease, background-color 0.15s ease;
}

/* 2px selected border — drawn as an overlay so nothing shifts (як у SampleCard) */
.gift-card::after {
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

.gift-card.is-selected::after {
  opacity: 1;
  transform: scale(1);
}

.gift-card:active:not(.is-disabled) {
  transform: scale(0.97);
}

/* Лише там, де справді наводять мишею: на iOS тап лишає :hover «залиплим» (див. SkButton) */
@media (hover: hover) and (pointer: fine) {
  .gift-card:hover:not(.is-disabled) {
    background: color-mix(in oklch, var(--bg-surface), var(--bg-subtle));
  }
}

.gift-card.is-disabled {
  opacity: 0.5;
  cursor: default;
}

.gift-card:focus-visible {
  outline: var(--border-width-focus) solid var(--border-focus);
  outline-offset: 2px;
}

/* На фото, 4px від його кута — та сама відстань від краю картки, що й у SampleCard */
.gift-card__checkbox {
  position: absolute;
  top: var(--space-3);
  left: var(--space-3);
  z-index: 1;
}

/* На одній лінії з чекбоксом: та сама висота 18px і ті ж 12px від краю картки */
.gift-card__badge {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  z-index: 1;
  display: grid;
  place-items: center;
  height: 18px;
  padding: 0 6px;
  /* Чорна, як рамка обраної картки; box-sizing: border-box лишає бейдж 18px */
  border: var(--border-width-hairline) solid var(--action-secondary-border);
  border-radius: var(--radius-full);
  background: var(--bg-canvas);
  color: var(--fg-default);
  font-size: 10px;
  line-height: 1;
  letter-spacing: 0.04em;
}

.gift-card__image {
  width: 107px;
  height: 107px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

.gift-card__title {
  width: 99px;
  height: 32px;
  margin: var(--space-2) var(--space-1) 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.gift-card__prices {
  display: flex;
  align-items: baseline;
  /* 8px, не 4: закреслена ціна не зливається з актуальною */
  gap: var(--space-2);
  margin: var(--space-1) var(--space-1) 0;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.gift-card__old-price {
  color: var(--fg-muted);
}
</style>
