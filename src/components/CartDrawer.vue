<script setup lang="ts">
// Figma "iPhone 17 - 12" (node 112:2187) — порожній кошик, відкривається сайдбаром справа наліво
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import SkIcon from './SkIcon.vue'
import SkButton from './SkButton.vue'
import ProductRail from './ProductRail.vue'
import CartContents from './CartContents.vue'
import { useCart } from '@/composables/useCart'
import { useWideCart } from '@/composables/useWideCart'
import { prefersReducedMotion, spring } from '@/motion/spring'

const { lines, count, drawerOpen, baseFrozen, baseScrollY, baseTop, baseCovered, drawerExit, closeDrawer } = useCart()
// Широкий екран: дровер справа поверх затемненого екрана, а не на місці мобільної колонки
const wide = useWideCart()

// Різні товари з демо-каталогу — кожен зі своїм фото й ціною
const VIEWED_IDS = [
  'niacinamide-peptides',
  'neuropeptide-corrective-brightening-under-eye-cream',
  'cold-plasma-plus-advanced-hydrating-complex',
  'neuropeptide-the-cleansing-balm',
  'haircare-triple-keratin-repair-shampoo',
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
  setModal(wide.value)
})

// Обрізання body і #app знімає клас на <html> (див. base.css) — вони поза компонентом
watch(baseCovered, (still) => document.documentElement.classList.toggle('cart-still', still))

// Широкий кошик — фіксований шар поверх екрана, що лишається видно під затемненням:
// сторінка під ним не гортається (див. base.css → html.cart-modal)
function setModal(on: boolean) {
  document.documentElement.classList.toggle('cart-modal', on)
}

// Вікно розтягнули чи звузили з відкритим кошиком: перемикаємо режим на льоту
watch(wide, (isWide) => {
  if (!drawerOpen.value || !baseFrozen.value) return
  setModal(isWide)
  baseCovered.value = !isWide
  if (!isWide) window.scrollTo({ top: 0, behavior: 'instant' })
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && drawerOpen.value) closeDrawer()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  baseFrozen.value = false
  baseCovered.value = false
  setModal(false)
})

/* ---------- Enter / leave animations ---------- */

function onEnter(el: Element, done: () => void) {
  const p = el.querySelector<HTMLElement>('.drawer')!
  window.scrollTo({ top: 0, behavior: 'instant' })
  el.querySelector<HTMLElement>('.drawer-scrim')?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, easing: 'ease-out' })
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
  // Широкий кошик закриває екран лише частково — той лишається видно під затемненням
  baseCovered.value = !wide.value
  nextTick(() => closeButton.value?.focus({ preventScroll: true }))
}

function onLeave(el: Element, done: () => void) {
  const p = el.querySelector<HTMLElement>('.drawer')!
  // Екран під кошиком знову видно — він відкриється, поки кошик їде
  baseCovered.value = false
  // Елемент, що зникає, Vue вже не оновлює — повертаємо обрізання й тінь вручну
  el.classList.remove('is-still')

  el.querySelector<HTMLElement>('.drawer-scrim')?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: 'ease-in', fill: 'forwards' })

  // Forward (→ checkout): cart exits left while the new screen underneath slides in from the right.
  // Широкий кошик просто їде назад управо — оформлення вже стоїть під ним
  if (drawerExit.value === 'forward' && !wide.value && !prefersReducedMotion()) {
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
  baseCovered.value = false
  const forward = drawerExit.value === 'forward'
  drawerExit.value = 'close'
  // Put the screen back into normal flow and restore where the user was
  baseFrozen.value = false
  setModal(false)
  nextTick(() => {
    window.scrollTo({ top: baseScrollY.value, behavior: 'instant' })
    if (!forward) returnFocus?.focus({ preventScroll: true })
    returnFocus = null
  })
}

/* ---------- Swipe right to close ---------- */

const drag = { tracking: false, active: false, startX: 0, startY: 0, dx: 0, lastX: 0, lastT: 0, velocity: 0, pointerId: -1 }

function onPointerDown(e: PointerEvent) {
  // Мишею дровер не тягнуть — на широкому екрані закривають хрестиком, Esc чи кліком по затемненню
  if (e.pointerType === 'mouse' && (e.button !== 0 || wide.value)) return
  if ((e.target as HTMLElement).closest('button, a, .rail__track, .gifts__track')) return
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
    // Окремий шар лише на час свайпу, щоб рух ішов на GPU; екран під кошиком відкривається
    panel.value.style.willChange = 'transform'
    baseCovered.value = false
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
  const el = panel.value
  el.animate([{ transform: `translateX(${drag.dx}px)` }, { transform: 'translateX(0)' }], { duration: sp.duration, easing: sp.easing })
    .onfinish = () => {
      el.style.willChange = ''
      baseCovered.value = !wide.value
    }
  el.style.transform = ''
}
</script>

<template>
  <Transition :css="false" @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave" @after-leave="onAfterLeave">
    <!-- In normal document flow (not fixed) so iOS Safari shows it behind the bottom toolbar -->
    <div v-if="drawerOpen" class="drawer-root" :class="{ 'is-still': baseCovered, 'drawer-root--wide': wide }">
      <div v-if="wide" class="drawer-scrim" aria-hidden="true" @click="closeDrawer" />
      <section
        ref="panel"
        class="drawer"
        :class="{ 'drawer--split': wide && lines.length }"
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
          <header class="drawer__header header-fade" data-sticky-top :class="{ 'drawer__header--solid': lines.length }">
            <button ref="closeButton" class="drawer__icon-btn" type="button" aria-label="Закрити кошик" @click="closeDrawer">
              <SkIcon name="CrossLarge" />
            </button>
            <!-- Figma 218:2861: «Кошик» + кількість курсивом Nib Pro -->
            <h2 id="cart-drawer-title" class="drawer__title body-m">
              Кошик<span v-if="count" class="drawer__count">({{ count }})</span>
            </h2>
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

          <ProductRail v-if="!lines.length" class="viewed" title="Ви переглядали" :wrap="wide" :ids="VIEWED_IDS" />
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

/* Нерухомий кошик: обрізати нічого, а обрізання ламає липкі хедер і панель на iOS
   (див. base.css → html.cart-still). Бічні смуги тіні потрібні лише в русі —
   ховаємо, щоб без обрізання вони не розширили сторінку. */
.drawer-root.is-still {
  overflow-x: visible;
}
.drawer-root.is-still .drawer::before,
.drawer-root.is-still .drawer::after {
  display: none;
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
  position: relative;
  background: var(--bg-canvas);
  color: var(--fg-default);
  touch-action: pan-y;
  /* Ні will-change, ні clip-path: кожне з них робить кошик окремим GPU-шаром на всю
     висоту, і коли під час анімації (розкриття набору, згортання рядка) висота
     міняється щокадру, iOS перемальовує цей шар цілком — на iPhone весь екран
     ледь помітно дрижав. Перевірено на пристрої: зникає, лише коли прибрано обидва.
     Виїзд і так іде WAAPI-анімацією transform, яку браузер винесе на GPU сам,
     а на час свайпу will-change вмикає onPointerMove. */
}

/* Тінь лише з боків, смугами на всю висоту кошика: box-shadow вилазив би і під низ,
   де його відкриває гумовий overscroll iOS, а обрізати його було нічим, крім clip-path */
.drawer::before,
.drawer::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: var(--space-6);
  pointer-events: none;
}
.drawer::before {
  right: 100%;
  background: linear-gradient(to left, oklch(0% 0 0 / 0.12), transparent);
}
.drawer::after {
  left: 100%;
  background: linear-gradient(to right, oklch(0% 0 0 / 0.12), transparent);
}

/* ---------- Широкий екран: дровер справа поверх затемнення ---------- */

/* Фіксований шар на весь екран: екран під ним заморожений і видно крізь затемнення */
.drawer-root--wide {
  position: fixed;
  inset: 0;
  z-index: 20;
  overflow: hidden;
}

.drawer-scrim {
  position: absolute;
  inset: 0;
  background: var(--bg-scrim);
}

/* Порожній кошик — одна колонка як на телефоні; з товарами — дві по 440px.
   Ширину не анімуємо: вміст однаково змінюється цілком, а колонки посередині переходу стискались */
.drawer-root--wide .drawer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 440px;
  max-width: 100%;
  min-height: 0;
  margin: 0;
  box-shadow: var(--elevation-l);
}
.drawer-root--wide .drawer--split {
  width: 880px;
}
.drawer-root--wide .drawer::before,
.drawer-root--wide .drawer::after {
  display: none;
}

/* Гортається сам дровер (порожній стан), а з товарами — кожна колонка окремо */
.drawer-root--wide .drawer__body {
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
}
.drawer-root--wide .drawer__body--filled {
  overflow: hidden;
}

/* Заголовок ліворуч, хрестик праворуч — як у бокових панелях на десктопі */
.drawer-root--wide .drawer__header {
  flex-direction: row-reverse;
  padding: var(--space-5) var(--space-6);
}
.drawer-root--wide .drawer__icon-btn {
  margin: -10px -10px -10px 0;
}
.drawer-root--wide .drawer__title {
  position: static;
  transform: none;
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
  display: flex;
  align-items: baseline;
  gap: var(--space-1);
  font-weight: 400;
  white-space: nowrap;
}

.drawer__count {
  font-family: var(--font-family-display);
  font-style: italic;
  font-weight: 600;
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
</style>
