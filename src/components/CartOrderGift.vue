<script setup lang="ts">
// Figma 234:3265 + 235:3285 — прототип /gift-card: подарунок до замовлення карткою над товарами.
// Картка з'являється від 3 000 ₴, від 5 000 ₴ її вміст змінюється на другий подарунок, нижче 3 000 ₴ — згортається
import SkIcon from './SkIcon.vue'
import glow from '@/assets/images/order-gift-glow.svg'
import { useCart } from '@/composables/useCart'
import { formatPrice } from '@/data/catalog'
import { popIn } from '@/motion/popIn'
import { prefersReducedMotion } from '@/motion/spring'
import { LINE_ENTER_MS, snap, tween } from '@/motion/tween'

const cart = useCart()

/** Значок подарунка підстрибує, щойно подарунок з'явився чи змінився на інший */
const popBadge = (el: Element) => popIn(el.querySelector('.order-gift__badge'))

/* ---------- Поява й зникнення: блок розсуває список, як новий рядок (CartLines) ---------- */

let cancel: (() => void) | undefined

function onEnter(el: Element, done: () => void) {
  const node = el as HTMLElement
  const finish = () => {
    for (const prop of ['overflow', 'height', 'opacity'] as const) node.style[prop] = ''
    done()
    popBadge(node)
  }
  if (prefersReducedMotion()) return done()
  // Поза екраном (сума перетнула поріг, коли товар додали зі стрічки внизу) розгортання ніхто
  // не побачить — картка стає одразу, а стрічку на місці тримає ProductRail → onAdd
  const rect = node.getBoundingClientRect()
  if (rect.bottom <= 0 || rect.top >= window.innerHeight) return finish()

  const height = rect.height
  node.style.overflow = 'hidden'
  const frame = (p: number) => {
    // Вміст проявляється, коли під нього вже є місце
    node.style.opacity = `${Math.max(0, (p - 0.35) / 0.65)}`
    node.style.height = `${snap(height * p)}px`
  }
  frame(0)
  cancel = tween(LINE_ENTER_MS, frame, finish)
}

function onLeave(el: Element, done: () => void) {
  cancel?.()
  if (prefersReducedMotion()) return done()
  const node = el as HTMLElement
  const height = node.getBoundingClientRect().height
  node.style.overflow = 'hidden'
  tween(
    280,
    (p) => {
      node.style.opacity = `${1 - Math.min(1, p * 1.6)}`
      node.style.height = `${snap(height * (1 - p))}px`
    },
    done,
  )
}
</script>

<template>
  <Transition :css="false" @enter="onEnter" @leave="onLeave">
    <div v-if="cart.orderGift.value" class="order-gift">
      <!-- Висота картки не залежить від довжини текстів: заміна подарунка не зсуває список -->
      <article class="order-gift__card" aria-labelledby="order-gift-title">
        <img class="order-gift__glow" :src="glow" alt="" />
        <Transition name="order-gift-swap" @enter="popBadge">
          <div :key="cart.orderGift.value.id" class="order-gift__body">
            <div class="order-gift__media">
              <img class="order-gift__photo" :src="cart.orderGift.value.image" alt="" />
              <span class="order-gift__badge"><SkIcon name="GiftSmallDark" :size="16" /></span>
            </div>
            <div class="order-gift__head">
              <h3 id="order-gift-title" class="order-gift__title heading-s">
                <span class="visually-hidden">Подарунок: </span>{{ cart.orderGift.value.title }}
              </h3>
              <span class="order-gift__price heading-s">{{ formatPrice(cart.orderGift.value.price) }}</span>
            </div>
            <p class="order-gift__desc body-s">{{ cart.orderGift.value.description }}</p>
          </div>
        </Transition>
      </article>
      <!-- Figma 235:3285 — стрічка з умовою виглядає з-під картки -->
      <p class="order-gift__note body-m" aria-live="polite">
        <Transition name="order-gift-swap">
          <span :key="cart.orderGift.value.amount">Подарунок до замовлення від {{ formatPrice(cart.orderGift.value.amount) }}</span>
        </Transition>
      </p>
    </div>
  </Transition>
</template>

<style scoped>
/* 16px під шторкою; 4px знизу + 20px відступу списку = 24px від стрічки до товарів (Figma 234:3051).
   Відступи всередині блока — щоб при появі й зникненні вони росли й згортались разом з ним */
.order-gift {
  --note-overlap: 32px;
  padding: var(--space-4) var(--space-4) var(--space-1);
}

/* Figma 234:3265: canvas, radius/lg, Elevation/M */
.order-gift__card {
  position: relative;
  z-index: 1;
  /* Старий і новий подарунок під час заміни — в одній клітинці, висота не стрибає */
  display: grid;
  overflow: clip;
  border-radius: var(--radius-lg);
  background: var(--bg-canvas);
  box-shadow: var(--elevation-m);
}

/* Ледь рожеве світіння праворуч угорі (Figma 235:3283: коло 365px, зсунуте за край) */
.order-gift__glow {
  position: absolute;
  top: -176px;
  left: 73px;
  width: 365px;
  height: 365px;
  pointer-events: none;
}

/* Фото 56px зліва; праворуч — назва з ціною (40px, два рядки) і опис (два рядки) */
.order-gift__body {
  grid-area: 1 / 1;
  position: relative;
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  grid-template-rows: 40px auto;
  column-gap: var(--space-2);
  row-gap: var(--space-2);
  padding: var(--space-5) var(--space-5) var(--space-3);
}

.order-gift__media {
  grid-row: 1 / 3;
  position: relative;
  width: 56px;
  height: 56px;
}

.order-gift__photo {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-md);
  background: var(--bg-canvas);
  object-fit: cover;
}

/* Значок подарунка на куті фото: 8px за його межами (Figma 234:3268) */
.order-gift__badge {
  position: absolute;
  top: calc(var(--space-2) * -1);
  left: calc(var(--space-2) * -1);
  display: grid;
  place-items: center;
  width: var(--icon-md);
  height: var(--icon-md);
  border-radius: var(--radius-full);
  background: var(--bg-canvas);
  filter: drop-shadow(0 4px 6px oklch(0% 0 0 / 0.08)) drop-shadow(0 0 0.5px oklch(0% 0 0 / 0.24));
}

/* Назва по центру свого 40px рядка, ціна — на першому рядку назви */
.order-gift__head {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  align-self: center;
}

.order-gift__title,
.order-gift__desc {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.order-gift__title {
  flex: 1;
  min-width: 0;
}

.order-gift__price {
  flex-shrink: 0;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

/* Два рядки завжди зарезервовані — картка однакової висоти з будь-яким подарунком */
.order-gift__desc {
  min-height: calc(var(--font-line-height-xs) * 2);
  margin: 0;
  color: var(--fg-muted);
}

/* Figma 235:3285: amber-стрічка з-під картки — видно 48px, текст по центру видимої частини */
.order-gift__note {
  display: grid;
  margin: calc(var(--note-overlap) * -1) 0 0;
  padding: calc(var(--note-overlap) + 14px) var(--space-5) 14px;
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  background: var(--status-warning-bg);
  color: var(--status-warning-fg);
  text-align: center;
}
.order-gift__note > span {
  grid-area: 1 / 1;
}

/* ---------- Заміна подарунка: старий вміст тане, новий проявляється на тому ж місці ---------- */

.order-gift-swap-enter-active {
  transition: opacity 0.26s ease, transform 0.38s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.order-gift-swap-leave-active {
  transition: opacity 0.16s ease;
}
.order-gift-swap-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.order-gift-swap-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .order-gift-swap-enter-active,
  .order-gift-swap-leave-active {
    transition: none;
  }
}
</style>
