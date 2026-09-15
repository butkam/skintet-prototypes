<script setup lang="ts">
// Figma nodes 112:1858–1885 (шкала) + 112:2147 (прилиплий стан з фейдом)
// Два кореневі елементи: повідомлення прокручується, шкала прилипає під хедером.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import SkIcon from './SkIcon.vue'
import { formatAmount, milestones } from '@/data/catalog'
import { spring } from '@/motion/spring'

const props = defineProps<{ subtotal: number }>()

/*
 * Visible milestones depend on how far the order got (Доставка always stays):
 *   nothing / delivery reached → Доставка · 1 семпл
 *   1 семпл reached            → Доставка · 1 семпл · 2 семпли
 *   2 семпли reached           → Доставка · 2 семпли · 3 семпли
 *   3 семпли reached           → Доставка · 3 семпли
 * Stops re-spread between the first and last position as the set changes.
 */
const TRACK = 362
const FIRST = 28 // px — first stop centre (Figma)
const LAST = 356 // px — last stop centre (Figma)

const reached = computed(() => milestones.filter((m) => props.subtotal >= m.amount).length)

const visibleIdx = computed<number[]>(() => {
  switch (reached.value) {
    case 0:
    case 1:
      return [0, 1]
    case 2:
      return [0, 1, 2]
    case 3:
      return [0, 2, 3]
    default:
      return [0, 3]
  }
})

const isVisible = (i: number) => visibleIdx.value.includes(i)

/** Stop centre as a fraction of the track; hidden stops collapse into their nearest visible neighbour */
const stops = computed(() => {
  const vis = visibleIdx.value
  const spread = (k: number) => (vis.length === 1 ? LAST : FIRST + ((LAST - FIRST) * k) / (vis.length - 1)) / TRACK
  return milestones.map((_, i) => {
    const k = vis.indexOf(i)
    if (k >= 0) return spread(k)
    const below = [...vis].reverse().find((v) => v < i)
    return below !== undefined && i < vis[vis.length - 1] ? spread(vis.indexOf(below)) : LAST / TRACK
  })
})

const progress = computed(() => {
  const s = props.subtotal
  if (s <= 0) return 0
  let prevAmount = 0
  let prevPos = 0
  for (const i of visibleIdx.value) {
    const { amount } = milestones[i]
    const pos = stops.value[i]
    if (s < amount) return prevPos + ((s - prevAmount) / (amount - prevAmount)) * (pos - prevPos)
    prevAmount = amount
    prevPos = pos
  }
  return 1
})

/** Labels: first hugs the left edge, last hugs the right, middle ones centre under their stop */
function labelStyle(i: number) {
  const vis = visibleIdx.value
  const k = vis.indexOf(i)
  const hidden = k < 0
  const first = k === 0
  const last = k === vis.length - 1
  const left = hidden ? `${stops.value[i] * 100}%` : first ? '0%' : last ? '100%' : `${stops.value[i] * 100}%`
  const shift = hidden ? (stops.value[i] >= LAST / TRACK ? -100 : -50) : first ? 0 : last ? -100 : -50
  return {
    left,
    transform: `translateX(${shift}%)`,
    textAlign: (shift === 0 ? 'left' : shift === -100 ? 'right' : 'center') as 'left' | 'right' | 'center',
    opacity: hidden ? 0 : 1,
  }
}

// Figma 112:2407–2409: досягнуте (з галочкою) + наступна ціль приглушено
const achieved = computed(() => (props.subtotal >= milestones[0].amount ? 'Безкоштовна доставка' : null))

const message = computed(() => {
  const s = props.subtotal
  const next = milestones.find((m) => s < m.amount)
  if (!next) return 'Максимум подарунків у цьому замовленні'
  const left = formatAmount(next.amount - s)
  if (next.samples === 0) return `Ще ${left} до безкоштовної доставки`
  return `Ще ${left} — і зможете обрати ${next.samples === 1 ? 'семпл' : `${next.samples} семпли`}`
})

const fillSpring = spring({ stiffness: 170, damping: 22, mass: 1 })
const moveSpring = spring({ stiffness: 260, damping: 26, mass: 1 })
const moveTransition = `left ${moveSpring.duration}ms ${moveSpring.easing}, transform ${moveSpring.duration}ms ${moveSpring.easing}, opacity 0.25s ease`

/* ---------- Stuck detection → show fade ---------- */

const scale = ref<HTMLElement | null>(null)
const stuck = ref(false)
let raf = 0

// The cart scrolls the document (see useCart → baseFrozen), so watch the window
function check() {
  raf = 0
  if (!scale.value) return
  const top = parseFloat(getComputedStyle(scale.value).top) || 0
  stuck.value = window.scrollY > 0 && scale.value.getBoundingClientRect().top <= top + 0.5
}

const onScroll = () => (raf ||= requestAnimationFrame(check))

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  check()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div class="progress-msg body-s" aria-live="polite">
    <p v-if="achieved" class="progress-msg__achieved">
      <SkIcon name="Check" :size="18" class="progress-msg__check" />
      {{ achieved }}
    </p>
    <p :class="{ 'progress-msg__next': achieved }">{{ message }}</p>
  </div>

  <div
    ref="scale"
    class="progress"
    :class="{ 'is-stuck': stuck }"
    role="progressbar"
    :aria-valuenow="Math.round(progress * 100)"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuetext="message"
  >
    <div class="progress__track">
      <div class="progress__rail" />
      <div
        class="progress__fill"
        :style="{
          transform: `scaleX(${progress})`,
          transition: `transform ${fillSpring.duration}ms ${fillSpring.easing}`,
        }"
      />
      <span
        v-for="(m, i) in milestones"
        :key="m.amount"
        class="progress__stop"
        :class="{ 'is-hidden': !isVisible(i) }"
        :aria-hidden="!isVisible(i) || undefined"
        :style="{ left: `${stops[i] * 100}%`, transition: moveTransition }"
      >
        <SkIcon :name="m.icon" :size="16" :color="subtotal >= m.amount ? 'var(--fg-default)' : undefined" />
      </span>
    </div>

    <div class="progress__labels">
      <div
        v-for="(m, i) in milestones"
        :key="m.amount"
        class="progress__label body-s"
        :aria-hidden="!isVisible(i) || undefined"
        :style="{ ...labelStyle(i), transition: moveTransition }"
      >
        <span>{{ formatAmount(m.amount) }}</span>
        <span class="progress__label-caption">{{ m.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Always two lines tall so adding an item doesn't shift the page; lines sit flush,
   and the scale's own 16px top padding is the gap to the icons */
.progress-msg {
  box-sizing: content-box;
  min-height: calc(var(--font-line-height-xs) * 2);
  padding: var(--space-4) var(--space-5) 0;
}

.progress-msg__achieved {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: -3px;
}

.progress-msg__check {
  margin-block: -1px;
}

.progress-msg__next {
  color: var(--fg-muted);
}

.progress {
  position: sticky;
  top: var(--drawer-header-h);
  /* Above the header's own fade overhang */
  z-index: 11;
  padding: var(--space-4) var(--space-5) 0;
}

/* Figma 112:2148: canvas → transparent from 43.9%, 131px tall; only when stuck */
.progress::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 131px;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    var(--bg-canvas) 43.9%,
    color-mix(in oklch, var(--bg-canvas) 0%, transparent) 100%
  );
  opacity: 0;
  transition: opacity 0.2s ease;
}
.progress.is-stuck::before {
  opacity: 1;
}

.progress__track {
  position: relative;
  height: var(--icon-md);
}

.progress__rail,
.progress__fill {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: var(--border-width-thick);
  margin-top: -1px;
}

.progress__rail {
  background: var(--progress-track);
}

.progress__fill {
  background: var(--progress-fill);
  transform-origin: left center;
}

.progress__stop.is-hidden {
  opacity: 0;
}

.progress__stop {
  position: absolute;
  top: 0;
  display: grid;
  place-items: center;
  width: var(--icon-md);
  height: var(--icon-md);
  margin-left: calc(var(--icon-md) / -2);
  border-radius: var(--radius-full);
  background: var(--neutral-0);
}

.progress__labels {
  position: relative;
  height: 32px;
  margin-top: 1px;
}

.progress__label {
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.progress__label-caption {
  color: var(--fg-muted);
}
</style>
