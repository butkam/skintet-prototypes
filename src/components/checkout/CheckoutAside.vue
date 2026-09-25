<script setup lang="ts">
// Desktop order column: what the step already knows (#before, e.g. delivery on «Оплата»), the order's positions
// (collapsed by default), the totals and the step's action (slot) — always in view
import { nextTick, ref } from 'vue'
import SkIcon from '@/components/SkIcon.vue'
import CartSummary from '@/components/CartSummary.vue'
import CheckoutLines from './CheckoutLines.vue'
import { useCheckout } from '@/composables/useCheckout'
import { prefersReducedMotion, spring } from '@/motion/spring'

const { positions } = useCheckout()
const open = ref(false)
const details = ref<HTMLElement | null>(null)

// Open, the list takes whatever the column has left (flex) — only known after layout. So the height is
// measured before and after the switch and animated in between; a grid-rows transition let the column
// jump to the full height first and only then animate inside it
const s = spring({ stiffness: 380, damping: 39, mass: 1 }) // critically damped, as the step slides
let running: Animation | undefined

async function toggle() {
  const el = details.value
  const from = el?.offsetHeight ?? 0
  running?.cancel()
  open.value = !open.value
  await nextTick()
  if (!el || prefersReducedMotion()) return
  const to = el.offsetHeight
  running = el.animate([{ height: `${from}px` }, { height: `${to}px` }], { duration: s.duration, easing: s.easing })
}
</script>

<template>
  <aside class="aside" aria-labelledby="aside-title">
    <div v-if="$slots.before" class="aside__before">
      <slot name="before" />
    </div>
    <div class="aside__head">
      <h2 id="aside-title" class="heading-s">Замовлення</h2>
      <button
        class="aside__toggle body-s"
        type="button"
        :aria-expanded="open"
        aria-controls="aside-lines"
        @click="toggle"
      >
        {{ positions }}
        <SkIcon name="ChevronDownSmall" :size="16" class="aside__chevron" :class="{ 'is-open': open }" />
      </button>
    </div>
    <!-- A long order scrolls inside; the totals and the action stay put -->
    <div
      id="aside-lines"
      ref="details"
      class="aside__details"
      :class="{ 'is-open': open }"
      :inert="!open || undefined"
    >
      <CheckoutLines class="aside__lines" size="l" />
    </div>
    <CartSummary class="aside__summary" />
    <div v-if="$slots.default" class="aside__action">
      <slot />
    </div>
  </aside>
</template>

<style scoped>
.aside {
  display: flex;
  flex-direction: column;
  /* Sticks 32px under the steps' line (--checkout-steps-h, set by CheckoutTopBar), 16px off the bottom */
  max-height: calc(100svh - var(--checkout-header-h) - var(--checkout-steps-h, 0px) - var(--space-8) - var(--space-4));
  padding-block: var(--space-6) var(--space-5);
  border-radius: var(--radius-lg);
  /* Halfway between the surface and the page: no lighter grey in the tokens */
  background: color-mix(in oklch, var(--bg-surface) 50%, var(--bg-canvas));
}

.aside__before {
  flex-shrink: 0;
  padding: 0 var(--space-6) var(--space-5);
  margin-bottom: var(--space-5);
  border-bottom: var(--border-width-hairline) solid var(--border-subtle);
}

.aside__head {
  flex-shrink: 0;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-4);
  padding-inline: var(--space-6);
  margin-bottom: var(--space-5);
}

.aside__head h2 {
  margin: 0;
}

/* The padding keeps the tap area without shifting the text */
.aside__toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  margin: -6px -8px;
  padding: 6px 8px;
  color: var(--fg-muted);
  transition: color 0.15s ease;
}

.aside__toggle:hover {
  color: var(--fg-default);
}

.aside__chevron {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.aside__chevron.is-open {
  transform: scaleY(-1);
}

/* Open, it takes whatever height the column has left and scrolls; height animated in toggle() */
.aside__details {
  flex: 0 1 auto;
  min-height: 0;
  height: 0;
  overflow: hidden;
  overscroll-behavior: contain;
  padding-inline: var(--space-6);
}
.aside__details.is-open {
  height: auto;
  overflow-y: auto;
}

/* Inside the list, not on the scroller: padding there would keep it from collapsing to 0 */
.aside__details .aside__lines {
  padding-bottom: var(--space-5);
}

@media (prefers-reduced-motion: reduce) {
  .aside__chevron {
    transition: none;
  }
}

.aside .aside__summary {
  flex-shrink: 0;
  padding-top: var(--space-4);
  padding-inline: var(--space-6);
  border-top: var(--border-width-hairline) solid var(--border-subtle);
}

.aside__action {
  flex-shrink: 0;
  margin-top: var(--space-5);
  padding-inline: var(--space-5);
}
</style>
