<script setup lang="ts">
// Figma 161:7810 (семпли ще недоступні) · 160:7315 (згорнуто) · 161:7952 (вибір наборів)
// Липка панель під хедером: шкала + семпли. Розгорнутий вибір лягає поверх товарів, не зсуваючи їх.
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import SkIcon from './SkIcon.vue'
import CartProgress from './CartProgress.vue'
import SampleCard from './SampleCard.vue'
import { useCart } from '@/composables/useCart'
import { formatAmount, milestones, samples } from '@/data/catalog'
import { prefersReducedMotion, spring } from '@/motion/spring'

const cart = useCart()

const deliveryThreshold = milestones.find((m) => m.samples === 0)!.amount
const samplesThreshold = milestones.find((m) => m.samples === 1)!.amount
const unlocked = computed(() => cart.samplesAllowed.value > 0)
const picked = computed(() => cart.sampleLines.value.length)
const limitReached = computed(() => picked.value >= cart.samplesAllowed.value)

// Before samples unlock: the next goal and what's left to it
const lockedHint = computed(() => {
  const s = cart.subtotal.value
  return s < deliveryThreshold
    ? `До безкоштовної доставки ще ${formatAmount(deliveryThreshold - s)}`
    : `До безкоштовного семплу ще ${formatAmount(samplesThreshold - s)}`
})

const pickerTitle = computed(() => {
  const n = cart.samplesAllowed.value
  return `Оберіть ${n} ${n === 1 ? 'набір' : 'набори'} семплів`
})

const open = ref(false)
// Slight overshoot: the arrow springs a touch past flat on its way over
const flip = spring({ stiffness: 320, damping: 24, mass: 1 })
// Dropping below the threshold hides the picker
watch(unlocked, (value) => {
  if (!value) open.value = false
})

function toggleSample(sample: (typeof samples)[number], e: MouseEvent) {
  if (cart.toggleSample(sample) || prefersReducedMotion()) return
  // Can't add → gentle horizontal shake
  ;(e.currentTarget as HTMLElement).animate(
    [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(0)' }],
    { duration: 320, easing: 'ease-out' },
  )
}

/* ---------- Overlay: the picker grows over the list instead of pushing it ---------- */

// The panel sits in flow; a negative bottom margin equal to the picker's current height
// (updated every frame of the open/close animation) keeps everything below in place.
const picker = ref<HTMLElement | null>(null)
const overlap = ref(0)
let resizeObserver: ResizeObserver | undefined

onMounted(() => {
  resizeObserver = new ResizeObserver(() => (overlap.value = picker.value?.offsetHeight ?? 0))
  if (picker.value) resizeObserver.observe(picker.value)
})
// The picker only exists once samples unlock
watch(picker, (el, prev) => {
  if (prev) resizeObserver?.unobserve(prev)
  if (el) resizeObserver?.observe(el)
  else overlap.value = 0
})
onBeforeUnmount(() => resizeObserver?.disconnect())
</script>

<template>
  <div class="gifts" :style="{ marginBottom: `${-overlap}px` }">
    <div class="gifts__sheet" :class="{ 'is-open': open }">
      <CartProgress :subtotal="cart.subtotal.value" />

      <!-- Locked: how much is left to the next goal -->
      <p v-if="!unlocked" class="gifts__hint body-s" aria-live="polite">
        <span class="gifts__hint-row">
          <SkIcon name="Sparkle" :size="20" />
          {{ lockedHint }}
        </span>
      </p>

      <template v-else>
        <div ref="picker" class="gifts__picker" :class="{ 'is-open': open }" :inert="!open || undefined">
          <div class="gifts__picker-inner">
            <div class="gifts__head">
              <h3 id="gifts-title" class="heading-s">{{ pickerTitle }}</h3>
              <span class="gifts__counter body-s" aria-live="polite">{{ picked }}/{{ cart.samplesAllowed.value }}</span>
            </div>
            <div class="gifts__track" role="group" aria-labelledby="gifts-title">
              <SampleCard
                v-for="s in samples"
                :key="s.id"
                :title="s.title"
                :description="s.description"
                :image="s.image"
                :selected="cart.hasSample(s.id)"
                :disabled="limitReached && !cart.hasSample(s.id)"
                @click="toggleSample(s, $event)"
              />
            </div>
          </div>
        </div>

        <button class="gifts__toggle body-s" type="button" :aria-expanded="open" @click="open = !open">
          {{ open ? 'Закрити' : 'Оберіть безкоштовні семпли' }}
          <!-- Figma IconChevronLargeRight turned down, redrawn as a 1px stroke along the glyph's centre line
               so it can flip: it flattens into a line and bends the other way -->
          <svg class="gifts__chevron" :class="{ 'is-up': open }" viewBox="0 8.81 24 7.28" aria-hidden="true">
            <path d="M2.08 9.23 12 15.5 21.92 9.23" :style="{ transition: `transform ${flip.duration}ms ${flip.easing}` }" />
          </svg>
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.gifts {
  position: sticky;
  top: var(--drawer-header-h);
  /* Above the header's own fade overhang and the list below */
  z-index: 11;
}

/* Figma: canvas, radius/lg at the bottom, Elevation/M */
.gifts__sheet {
  /* Everything under the scale in the collapsed state — shared by the locked hint so the
     panel is the same height before and after samples unlock:
     20 (gap) + 16 (text) + 4 (gap) + 7.28 (arrow) + 8 (to the edge) */
  --gifts-footer-h: calc(var(--space-5) + var(--font-line-height-xs) + var(--space-1) + 7.28px + var(--space-2));
  background: var(--bg-canvas);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  box-shadow: var(--elevation-m);
}

/* ---------- Locked hint (161:7951) ---------- */

.gifts__hint {
  box-sizing: border-box;
  height: var(--gifts-footer-h);
  margin: 0;
  /* Text lines up with «Оберіть безкоштовні семпли»: 20px under the scale (the 20px row centres the 16px line) */
  padding: calc(var(--space-5) - (20px - var(--font-line-height-xs)) / 2) var(--space-5) 0;
  color: var(--fg-default);
}

.gifts__hint-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 20px;
}

/* ---------- Picker (161:8158) — height animates via grid 0fr → 1fr ---------- */

.gifts__picker {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.gifts__picker.is-open {
  grid-template-rows: 1fr;
}

.gifts__picker-inner {
  min-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.gifts__picker.is-open .gifts__picker-inner {
  opacity: 1;
  transition-delay: 0.08s;
}

/* 26px under the scale labels, 16px to the cards */
.gifts__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-top: 26px;
  padding-inline: var(--space-5);
  color: var(--fg-default);
}

.gifts__counter {
  flex-shrink: 0;
  color: var(--action-primary-fg-disabled);
  font-variant-numeric: tabular-nums;
}

.gifts__track {
  display: flex;
  gap: var(--space-3);
  /* 4px breathing room so the selected-border spring isn't clipped */
  margin: 12px 0 -4px;
  padding: 4px var(--space-5);
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: var(--space-5);
  scrollbar-width: none;
  touch-action: pan-x pan-y;
}
.gifts__track::-webkit-scrollbar {
  display: none;
}

/* ---------- Toggle: «Оберіть безкоштовні семпли ⌄» / «Закрити ⌃» ---------- */

.gifts__toggle {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  width: 100%;
  /* 20px from the scale to the text · 4px text → arrow · 8px arrow → bottom edge (measured to the glyph) */
  padding: var(--space-5) var(--space-5) var(--space-2);
  color: var(--fg-default);
}

.gifts__toggle:focus-visible {
  outline: var(--border-width-focus) solid var(--border-focus);
  outline-offset: -4px;
  border-radius: var(--radius-lg);
}

/* 24×7.28 — exactly the glyph, so the gaps above are measured to the arrow itself */
.gifts__chevron {
  display: block;
  width: 24px;
  height: 7.28px;
  overflow: visible;
}

.gifts__chevron path {
  fill: none;
  stroke: var(--fg-muted);
  stroke-width: 1px;
  /* Keeps the line 1px thick while it's squashed flat mid-flip */
  vector-effect: non-scaling-stroke;
  transform-box: view-box;
  transform-origin: 12px 12.45px;
}

.gifts__chevron.is-up path {
  transform: scaleY(-1);
}

@media (prefers-reduced-motion: reduce) {
  .gifts__chevron path {
    transition: none !important;
  }
}
</style>
