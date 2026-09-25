<script setup lang="ts">
// Figma 112:1544 / 112:1593 / 125:5494 — sticky steps bar with progress line
// Steps bar: solid, hard edge. The slot bar below it fades out at the bottom so content disappears under it
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
// The slot bar sticks right under the steps
const navHeight = ref(0)
const fill = ref(0)
const animate = ref(false)
const s = spring({ stiffness: 170, damping: 26, mass: 1 })

// Progress line fills up to the right edge of the current step label
function measure() {
  const items = list.value?.querySelectorAll<HTMLElement>('[data-step]')
  const current = items?.[props.step - 1]
  if (!current || !list.value) return
  fill.value = current.offsetLeft + current.offsetWidth - list.value.offsetLeft
}

// Set up whenever the bar appears — on mount, or later when the window crosses the desktop breakpoint
watch(nav, (el, _, onCleanup) => {
  if (!el) return
  // Start from the previous step's edge, then spring to the current one
  animate.value = false
  const items = list.value?.querySelectorAll<HTMLElement>('[data-step]')
  const prev = props.step > 1 ? items?.[props.step - 2] : null
  fill.value = prev && list.value ? prev.offsetLeft + prev.offsetWidth - list.value.offsetLeft : 0
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
watch(() => props.step, () => nextTick(measure))

function go(i: number) {
  const target = steps[i].to
  if (i + 1 < props.step && target) backTo({ name: target })
}
</script>

<template>
  <!-- Steps and the slot bar are separate sticky layers: content marked [data-topbar-scroll]
       (e.g. the expanded order) unsticks and scrolls away under the steps -->
  <div v-if="!!persistent === wide" class="topbar" :style="{ '--topbar-steps-h': `${navHeight}px` }">
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
    <div v-if="$slots.default" class="topbar__content" data-sticky-top>
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
  position: sticky;
  padding-inline: var(--space-5);
}

.topbar__steps {
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
  top: calc(var(--checkout-header-h) + var(--topbar-steps-h));
  z-index: 14;
  padding-block: var(--space-4);
}

/* Unstuck: scrolls with the page, passing under the steps */
.topbar__content:has([data-topbar-scroll]) {
  position: relative;
  top: auto;
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

/* Figma: solid canvas, fading out over the last 18px */
.topbar__content::before {
  content: '';
  position: absolute;
  inset: 0 0 -18px 0;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    var(--bg-canvas) calc(100% - 18px),
    color-mix(in oklch, var(--bg-canvas) 0%, transparent) 100%
  );
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
  color: var(--action-primary-fg-disabled);
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
