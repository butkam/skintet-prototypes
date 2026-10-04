<script lang="ts">
// The step the last mounted bar showed — each screen has its own bar on the phone, the next one picks up from here
let shownStep: number | null = null
</script>

<script setup lang="ts">
// Figma 112:1544 / 112:1593 / 125:5494 — sticky steps bar with progress line
// Steps bar: solid, hard edge, sticky. The slot bar below it (order, chosen address) scrolls with the page
import { nextTick, ref, watch } from 'vue'
import SkIcon from '@/components/SkIcon.vue'
import { spring } from '@/motion/spring'
import { useWideCart } from '@/composables/useWideCart'
import { backTo } from '@/router'

// `persistent` — the one bar CheckoutLayout keeps on desktop across all steps; the steps' own bars render
// only on the phone, where each screen slides in with its bar
const props = defineProps<{ step: 1 | 2 | 3; persistent?: boolean }>()
// Desktop: «Увійти» moves from the header to the right end of the steps, sized like a step
const wide = useWideCart()

const steps = [
  { label: 'Дані й доставка', to: 'checkout-delivery' },
  { label: 'Оплата', to: 'checkout-payment' },
  { label: 'Створення профілю', to: null },
] as const

const list = ref<HTMLElement | null>(null)
const nav = ref<HTMLElement | null>(null)
// The desktop order column sticks right under the steps
const navHeight = ref(0)
const fill = ref(0)
const animate = ref(false)
const s = spring({ stiffness: 170, damping: 26, mass: 1 })

// Progress line fills up to the right edge of the current step label (0 — before the first one)
function edge(step: number) {
  const current = list.value?.querySelectorAll<HTMLElement>('[data-step]')[step - 1]
  return current && list.value ? current.offsetLeft + current.offsetWidth - list.value.offsetLeft : 0
}

function measure() {
  if (list.value) fill.value = edge(props.step)
}

// Set up whenever the bar appears — on mount, or later when the window crosses the desktop breakpoint
watch(nav, (el, _, onCleanup) => {
  if (!el) return
  // Start where the previous screen's bar left off (on a fresh load — the previous step), then spring to
  // the current one: between screens of one step (phone → SMS code) the line doesn't run again
  animate.value = false
  fill.value = edge(shownStep ?? props.step - 1)
  shownStep = props.step
  requestAnimationFrame(() => {
    animate.value = true
    measure()
  })
  document.fonts?.ready.then(measure)
  const resizeObserver = new ResizeObserver(() => {
    navHeight.value = nav.value?.offsetHeight ?? 0
    // Also on the page (the layout, for the persistent bar): the desktop order column sticks right under the steps
    nav.value
      ?.closest<HTMLElement>('.checkout__page, .checkout')
      ?.style.setProperty('--checkout-steps-h', `${navHeight.value}px`)
  })
  resizeObserver.observe(el)
  onCleanup(() => resizeObserver.disconnect())
}, { flush: 'post' })
watch(
  () => props.step,
  (step) => {
    shownStep = step
    nextTick(measure)
  },
)

function go(i: number) {
  const target = steps[i].to
  if (i + 1 < props.step && target) backTo({ name: target })
}
</script>

<template>
  <!-- Only the steps stick; the slot bar scrolls away under them -->
  <div v-if="!!persistent === wide" class="topbar">
    <nav ref="nav" class="topbar__steps" aria-label="Кроки оформлення" data-sticky-top>
      <div class="topbar__row">
        <ol ref="list" class="topbar__list">
          <template v-for="(item, i) in steps" :key="item.label">
            <li
              :data-step="i + 1"
              class="topbar__step body-s"
              :class="{ 'is-done': i + 1 <= step }"
              :aria-current="i + 1 === step ? 'step' : undefined"
            >
              <button v-if="i + 1 < step && item.to" type="button" @click="go(i)">{{ item.label }}</button>
              <span v-else>{{ item.label }}</span>
            </li>
            <li v-if="i < steps.length - 1" class="topbar__sep body-s" aria-hidden="true">›</li>
          </template>
        </ol>
        <button v-if="wide" class="topbar__login body-s" type="button">
          <!-- currentColor: the icon fades together with the text on hover -->
          <SkIcon name="PeopleCircle" :size="16" color="currentColor" />
          Увійти
        </button>
      </div>
      <div class="topbar__track">
        <span
          class="topbar__fill"
          :style="{ width: `${fill}px`, transition: animate ? `width ${s.duration}ms ${s.easing}` : 'none' }"
        />
      </div>
    </nav>
    <div v-if="$slots.default" class="topbar__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* Children stick within the page, not within this wrapper */
.topbar {
  display: contents;
}

.topbar__steps,
.topbar__content {
  padding-inline: var(--space-5);
}

.topbar__steps {
  position: sticky;
  top: var(--checkout-header-h);
  z-index: 15;
  /* Ends right at the progress line, so scrolling content disappears exactly under it */
  padding-top: var(--space-4);
}
/* Nothing below the steps: the gap under the line is margin, so it stays transparent and content
   scrolls away exactly at the line */
.topbar__steps:last-child {
  margin-bottom: var(--space-4);
}

/* The 16px gap under the line belongs to the slot bar */
.topbar__content {
  padding-block: var(--space-4);
}

/* Steps: solid canvas, hard edge — content passes under it without a fade */
.topbar__steps::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: var(--bg-canvas);
}


.topbar__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

/* The padding keeps the tap area without shifting the text */
.topbar__login {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  margin: -6px -8px;
  padding: 6px 8px;
  color: var(--fg-default);
  transition: color 0.15s ease;
}

@media (hover: hover) and (pointer: fine) {
  .topbar__login:hover {
    color: var(--fg-muted);
  }
}

/* In step with the text (the icon's own tint transition is slower) */
.topbar__login .sk-icon {
  transition-duration: 0.15s;
}

.topbar__list {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
  white-space: nowrap;
}

.topbar__step,
.topbar__sep {
  color: var(--fg-muted);
  transition: color 0.3s ease;
}

.topbar__step.is-done {
  color: var(--fg-default);
}

.topbar__step button {
  color: inherit;
}

.topbar__track {
  position: relative;
  height: var(--border-width-thick);
  margin-top: 11px;
  background: var(--progress-track);
}

.topbar__fill {
  position: absolute;
  inset: 0 auto 0 0;
  background: var(--progress-fill);
}

</style>
