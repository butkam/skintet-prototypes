<script setup lang="ts">
// Figma node 112:2194 — картка «Ви переглядали» / «Рекомендовані засоби», 123px завширшки, з кнопкою «Купити»
import SkIcon from './SkIcon.vue'

// `added` — товар щойно поклали в кошик: «Купити» стає «Додано» з галочкою
defineProps<{ title: string; price: string; image: string; added?: boolean }>()
defineEmits<{ add: [] }>()
</script>

<template>
  <article class="mini-card">
    <img class="mini-card__image" :src="image" alt="" />
    <p class="mini-card__title body-s">{{ title }}</p>
    <p class="mini-card__price body-s">{{ price }}</p>
    <button
      class="mini-card__buy body-m"
      :class="{ 'is-added': added }"
      type="button"
      :aria-label="added ? `Додано в кошик: ${title}` : `Купити: ${title}`"
      :disabled="added"
      @click="$emit('add')"
    >
      <Transition name="mini-card-label">
        <span v-if="added" key="added" class="mini-card__label">
          <SkIcon name="Check" :size="18" color="currentColor" />Додано
        </span>
        <span v-else key="buy" class="mini-card__label">Купити</span>
      </Transition>
    </button>
  </article>
</template>

<style scoped>
.mini-card {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 123px;
  padding: var(--space-2);
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
  color: var(--fg-default);
  scroll-snap-align: start;
}

.mini-card__image {
  width: 107px;
  height: 107px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

/* Кнопка на всю ширину картки під ціною: світла, щоб ряд карток не важчав.
   Ховер і «додано» — темна, як головна дія (SkButton primary) */
.mini-card__buy {
  position: relative;
  display: grid;
  place-items: center;
  height: var(--control-height-sm);
  margin-top: var(--space-2);
  border: var(--border-width-hairline) solid var(--border-default);
  border-radius: var(--radius-full);
  background: var(--action-secondary-bg);
  color: var(--action-secondary-fg);
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    transform 0.2s ease;
}
/* Зона тапу — 44px, хоч кнопка й нижча */
.mini-card__buy::before {
  content: '';
  position: absolute;
  inset: calc((var(--control-height-sm) - var(--control-tap-target-min)) / 2) 0;
}
/* Лише там, де справді наводять мишею: на iOS тап лишає :hover «залиплим» (див. SkButton) */
@media (hover: hover) and (pointer: fine) {
  .mini-card__buy:hover:not(:disabled) {
    border-color: var(--action-primary-bg);
    background: var(--action-primary-bg);
    color: var(--action-primary-fg);
  }
}
.mini-card__buy:active:not(:disabled) {
  transform: scale(0.96);
}
.mini-card__buy:focus-visible {
  outline: var(--border-width-focus) solid var(--border-focus);
  outline-offset: 2px;
}
.mini-card__buy.is-added {
  border-color: var(--action-primary-bg);
  background: var(--action-primary-bg);
  color: var(--action-primary-fg);
}

/* «Купити» і «Додано» в одній клітинці: нове з'являється одразу, поки старе ще зникає */
.mini-card__buy > * {
  grid-area: 1 / 1;
}
.mini-card__label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  white-space: nowrap;
}

/* «Купити» стискається, «Додано» з галочкою з'являється з легким перельотом */
.mini-card-label-leave-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
}
.mini-card-label-enter-active {
  transition: opacity 0.15s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.mini-card-label-enter-from,
.mini-card-label-leave-to {
  opacity: 0;
  transform: scale(0.7);
}

.mini-card__title {
  width: 99px;
  margin: var(--space-2) var(--space-1) 0;
  height: 32px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.mini-card__price {
  margin: var(--space-1) var(--space-1) 0;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
</style>
