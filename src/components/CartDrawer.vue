<script setup lang="ts">
// Figma "iPhone 17 - 12" (node 112:2187) — порожній кошик, відкривається сайдбаром справа наліво
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import SkIcon from './SkIcon.vue'
import SkButton from './SkButton.vue'
import ProductMiniCard from './ProductMiniCard.vue'
import CartContents from './CartContents.vue'
import { useCart } from '@/composables/useCart'
import { prefersReducedMotion, spring } from '@/motion/spring'
import viewedImage from '@/assets/images/product-viewed.png'

const { lines, count, drawerOpen, baseFrozen, baseScrollY, baseTop, drawerExit, closeDrawer, add } = useCart()

const recentlyViewed = [
  { id: 1, title: 'Exo-PDRN Prismatic+ Super Mega Pro Max Deluxe with amazing formula', price: '1 700,00 ₴', image: viewedImage },
  { id: 2, title: 'Міцелярна вода для очищення', price: '4 600,00 ₴', image: viewedImage },
  { id: 3, title: 'Calmwise Soothing Cleanser Amazing Formular', price: '10 305,00 ₴', image: viewedImage },
  { id: 4, title: 'Exo-PDRN Prismatic+ Super Mega Pro Max Deluxe with amazing formula', price: '1 700,00 ₴', image: viewedImage },
]

const panel = ref<HTMLElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)
let returnFocus: HTMLElement | null = null

// Critically damped → швидко, без перельоту (щоб не відкривався зазор біля краю)
const slideSpring = { stiffness: 380, damping: 39, mass: 1 }

/* ---------- Open / close lifecycle ---------- */

// Opening: pin the current screen at its scroll offset; the cart then scrolls the document.
// flush: 'pre' → state is set before the cart is inserted, in the same render.
watch(drawerOpen, (open) => {
  if (!open) return
  returnFocus = document.activeElement as HTMLElement | null
  baseScrollY.value = window.scrollY
  // Document scrolls to 0 on enter, so this keeps the screen where it was on-screen
  baseTop.value = -window.scrollY
  baseFrozen.value = true
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && drawerOpen.value) closeDrawer()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  baseFrozen.value = false
})

/* ---------- Enter / leave animations ---------- */

function onEnter(el: Element, done: () => void) {
  const p = el.querySelector<HTMLElement>('.drawer')!
  window.scrollTo({ top: 0, behavior: 'instant' })
  if (prefersReducedMotion()) {
    p.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150 }).onfinish = done
    return
  }
  const sp = spring(slideSpring)
  p.animate([{ transform: 'translateX(100%)' }, { transform: 'translateX(0)' }], {
    duration: sp.duration,
    easing: sp.easing,
  }).onfinish = done
}

function onAfterEnter() {
  nextTick(() => closeButton.value?.focus({ preventScroll: true }))
}

function onLeave(el: Element, done: () => void) {
  const p = el.querySelector<HTMLElement>('.drawer')!

  // Forward (→ checkout): cart exits left while the new screen underneath slides in from the right
  if (drawerExit.value === 'forward' && !prefersReducedMotion()) {
    const frame = document.querySelector<HTMLElement>('.app-frame')
    const sp = spring(slideSpring)
    const opts = { duration: sp.duration, easing: sp.easing, fill: 'forwards' as const }
    frame?.animate([{ transform: 'translateX(100%)' }, { transform: 'translateX(0)' }], opts)
    p.animate([{ transform: p.style.transform || 'translateX(0)' }, { transform: 'translateX(-100%)' }], opts).onfinish = () => {
      frame?.getAnimations().forEach((a) => a.cancel())
      done()
    }
    return
  }

  // The cart may be scrolled: re-align the screen underneath with the current viewport
  baseTop.value = window.scrollY - baseScrollY.value
  const from = p.style.transform || 'translateX(0)'
  const opts = { duration: prefersReducedMotion() ? 120 : 260, easing: 'cubic-bezier(0.4, 0, 0.9, 0.6)', fill: 'forwards' as const }
  p.animate(
    prefersReducedMotion() ? [{ opacity: 1 }, { opacity: 0 }] : [{ transform: from }, { transform: 'translateX(100%)' }],
    opts,
  ).onfinish = done
}

function onAfterLeave() {
  const forward = drawerExit.value === 'forward'
  drawerExit.value = 'close'
  // Put the screen back into normal flow and restore where the user was
  baseFrozen.value = false
  nextTick(() => {
    window.scrollTo({ top: baseScrollY.value, behavior: 'instant' })
    if (!forward) returnFocus?.focus({ preventScroll: true })
    returnFocus = null
  })
}

/* ---------- Swipe right to close ---------- */

const drag = { tracking: false, active: false, startX: 0, startY: 0, dx: 0, lastX: 0, lastT: 0, velocity: 0, pointerId: -1 }

function onPointerDown(e: PointerEvent) {
  if (e.pointerType === 'mouse' && e.button !== 0) return
  if ((e.target as HTMLElement).closest('button, a, .viewed__track, .gifts__track')) return
  Object.assign(drag, { tracking: true, active: false, startX: e.clientX, startY: e.clientY, dx: 0, lastX: e.clientX, lastT: e.timeStamp, velocity: 0, pointerId: e.pointerId })
}

function onPointerMove(e: PointerEvent) {
  if (!drag.tracking || e.pointerId !== drag.pointerId || !panel.value) return
  const dx = e.clientX - drag.startX
  const dy = e.clientY - drag.startY

  if (!drag.active) {
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
    // Only a rightward, mostly-horizontal gesture becomes a drag; otherwise let the page scroll
    if (dx <= 0 || Math.abs(dy) > Math.abs(dx)) {
      drag.tracking = false
      return
    }
    drag.active = true
    try {
      panel.value.setPointerCapture(e.pointerId)
    } catch {
      // Pointer already released (e.g. synthetic events) — tracking still works without capture
    }
  }

  drag.dx = Math.max(0, dx)
  const dt = Math.max(1, e.timeStamp - drag.lastT)
  drag.velocity = ((e.clientX - drag.lastX) / dt) * 1000
  drag.lastX = e.clientX
  drag.lastT = e.timeStamp
  panel.value.style.transform = `translateX(${drag.dx}px)`
}

function onPointerUp(e: PointerEvent) {
  if (!drag.tracking || e.pointerId !== drag.pointerId) return
  drag.tracking = false
  if (!drag.active || !panel.value) return
  drag.active = false

  const width = panel.value.offsetWidth
  if (drag.dx > width * 0.35 || drag.velocity > 600) {
    closeDrawer()
    return
  }

  const releaseVelocity = drag.dx > 1 ? -drag.velocity / drag.dx : 0
  const sp = spring({ ...slideSpring, velocity: Math.max(-20, Math.min(20, Math.round(releaseVelocity))) })
  panel.value.animate([{ transform: `translateX(${drag.dx}px)` }, { transform: 'translateX(0)' }], { duration: sp.duration, easing: sp.easing })
  panel.value.style.transform = ''
}
</script>

<template>
  <Transition :css="false" @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave" @after-leave="onAfterLeave">
    <!-- In normal document flow (not fixed) so iOS Safari shows it behind the bottom toolbar -->
    <div v-if="drawerOpen" class="drawer-root">
      <section
        ref="panel"
        class="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      >
        <div class="drawer__body" :class="{ 'drawer__body--filled': lines.length }">
          <!-- Header lives inside the scroller so content fades out beneath it -->
          <header class="drawer__header header-fade" :class="{ 'drawer__header--solid': lines.length }">
            <button ref="closeButton" class="drawer__icon-btn" type="button" aria-label="Закрити кошик" @click="closeDrawer">
              <SkIcon name="CrossLarge" />
            </button>
            <h2 id="cart-drawer-title" class="drawer__title body-m">Кошик · {{ count }}</h2>
          </header>

          <CartContents v-if="lines.length" />

          <div v-else class="empty">
            <SkIcon name="ShoppingBagLarge" :size="48" />
            <p class="empty__title">Кошик пустий</p>
            <p class="empty__text body-l">
              Від 3 000 ₴ — безкоштовна доставка,<br />
              від 5 000 ₴ — семпли у подарунок
            </p>
            <SkButton variant="secondary" @click="closeDrawer">Перейти до товарів</SkButton>
          </div>

          <section v-if="!lines.length" class="viewed" aria-labelledby="viewed-title">
            <h3 id="viewed-title" class="viewed__title heading-s">Ви переглядали</h3>
            <div class="viewed__track">
              <ProductMiniCard
                v-for="item in recentlyViewed"
                :key="item.id"
                :title="item.title"
                :price="item.price"
                :image="item.image"
                @add="add"
              />
            </div>
          </section>
        </div>
      </section>
    </div>
  </Transition>
</template>

<style scoped>
.drawer-root {
  position: relative;
  z-index: 1;
  /* Hide the off-screen part while sliding, without creating a scroll container */
  overflow-x: clip;
}

/* Centred phone column on wide screens */
.drawer {
  --drawer-header-h: calc(env(safe-area-inset-top) + var(--space-4) * 2 + var(--icon-md));
  max-width: 440px;
  margin-inline: auto;
  min-height: 100vh;
  min-height: 100lvh;
  display: flex;
  flex-direction: column;
  background: var(--bg-canvas);
  color: var(--fg-default);
  box-shadow: var(--elevation-l);
  touch-action: pan-y;
  will-change: transform;
}

/* ---------- Header (node 112:2222) ---------- */

/* Sticky + background fade come from the global .header-fade */
.drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  padding: calc(env(safe-area-inset-top) + var(--space-4)) var(--space-5) var(--space-4);
}

/* Filled cart: the sticky progress scale supplies the fade, so the header is solid */
.drawer__header--solid::before {
  /* Bleed 2px under the stuck scale (z-index 11) to cover sub-pixel rounding gaps */
  inset: 0 0 -2px 0;
  background: var(--bg-canvas);
}

/* Figma 156:7038: hairline divider under the header, above the scale */
.drawer__header--solid::after {
  content: '';
  position: absolute;
  inset: auto 0 0 0;
  height: var(--border-width-hairline);
  background: var(--border-default);
  pointer-events: none;
}

.drawer__icon-btn {
  display: grid;
  place-items: center;
  width: var(--control-tap-target-min);
  height: var(--control-tap-target-min);
  margin: -10px;
  border-radius: var(--radius-full);
}
.drawer__icon-btn:focus-visible {
  outline: var(--border-width-focus) solid var(--border-focus);
  outline-offset: -4px;
}

.drawer__title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-weight: 400;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}


/* ---------- Body ---------- */

.drawer__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: calc(env(safe-area-inset-bottom) + var(--space-8));
}

/* Filled cart: sticky checkout supplies its own bottom spacing */
.drawer__body--filled {
  padding-bottom: 0;
}

/* Empty state (nodes 112:2188–2191) */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 92px var(--space-5) 0;
  text-align: center;
}

.empty__title {
  margin-top: var(--space-4);
  font-family: var(--font-family-text);
  font-size: var(--font-size-xl);
  line-height: var(--font-line-height-md);
  color: var(--action-secondary-fg);
}

.empty__text {
  margin: var(--space-4) 0;
  color: var(--action-primary-fg-disabled);
}

/* «Ви переглядали» (nodes 112:2192–2221) */
.viewed {
  margin-top: auto;
  padding-top: var(--space-12);
}

.viewed__title {
  text-align: center;
  margin-bottom: var(--space-3);
}

.viewed__track {
  display: flex;
  gap: var(--space-3);
  padding-inline: var(--space-5);
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: var(--space-5);
  scrollbar-width: none;
  touch-action: pan-x pan-y;
}
.viewed__track::-webkit-scrollbar {
  display: none;
}
</style>
