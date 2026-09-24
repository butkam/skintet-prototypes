<script setup lang="ts">
// Figma states 156:6854 · 158:7074 · 158:7117 · 158:7221 · 158:7267 (шкала)
// Доступний поріг — темний підпис; отриманий — зелений з галочкою; від подарунка відмовились — червоний
// з хрестиком. Прилипає разом з панеллю CartGifts.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import SkIcon from './SkIcon.vue'
import { formatAmount, milestones } from '@/data/catalog'
import { spring } from '@/motion/spring'

const props = defineProps<{
  subtotal: number
  picked: number
  /** Покупець відмовився від семплів — доступні подарункові пороги перекреслюються */
  declined?: boolean
}>()

/** Поріг пройдено — подарунок доступний */
const isAvailable = (m: (typeof milestones)[number]) => props.subtotal >= m.amount
/** Подарунок справді отримано: доставка вмикається сама, семпли треба ще обрати */
const isClaimed = (m: (typeof milestones)[number]) => isAvailable(m) && (m.samples === 0 || props.picked >= m.samples)
/** Подарунок був доступний, але від семплів відмовились. Доставка сюди не входить — вона не семпл */
const isDeclined = (m: (typeof milestones)[number]) => !!props.declined && m.samples > 0 && isAvailable(m)

/*
 * Visible milestones depend on how far the order got (Доставка always stays):
 *   nothing / delivery reached → Доставка · 1 семпл
 *   1 семпл reached            → Доставка · 1 семпл · 2 семпли
 *   2 семпли reached           → Доставка · 2 семпли · 3 семпли
 *   3 семпли reached           → Доставка · 3 семпли
 * Stops slide between the first, middle and last position as the set changes.
 */
// Stop centres in px, anchored to the track edges rather than scaled, so labels keep clear of
// each other on narrower phones (Figma track is 362px)
const FIRST = 28 // from the left edge
const MIDDLE = 206 // fallback before labels are measured (Figma 158:7221)
const LAST_INSET = 6 // from the right edge (Figma: 356 of 362)

const track = ref<HTMLElement | null>(null)
const trackWidth = ref(362)
/** Rendered widths by milestone index: whole label, and its «від N ₴» line */
const labelWidths = ref<number[]>([])
const amountWidths = ref<number[]>([])
const labelEls: HTMLElement[] = []
const setLabelEl = (i: number) => (el: unknown) => {
  if (el) labelEls[i] = el as HTMLElement
}
let resizeObserver: ResizeObserver | undefined

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

// Middle label: centred in the free space between its neighbours' edges, so it gets equal room
// on both sides and moves right on wider screens. Its text is left-aligned inside.
const middleLabelPx = computed(() => {
  const vis = visibleIdx.value
  const wLeft = labelWidths.value[vis[0]]
  const wRight = labelWidths.value[vis[vis.length - 1]]
  if (vis.length < 3 || !wLeft || !wRight) return MIDDLE
  return (wLeft + trackWidth.value - wRight) / 2
})

// Middle stop: centred over the «від N ₴» line, which starts at the label's left edge
const middlePx = computed(() => {
  const i = visibleIdx.value[1]
  const wLabel = labelWidths.value[i]
  const wAmount = amountWidths.value[i]
  if (visibleIdx.value.length < 3 || !wLabel || !wAmount) return middleLabelPx.value
  return middleLabelPx.value - wLabel / 2 + wAmount / 2
})

/** Stop centre as a fraction of the track; hidden stops collapse into their nearest visible neighbour */
const stops = computed(() => {
  const vis = visibleIdx.value
  const w = trackWidth.value
  const last = (w - LAST_INSET) / w
  const spread = (k: number) => (k === 0 ? FIRST / w : k === vis.length - 1 ? last : middlePx.value / w)
  return milestones.map((_, i) => {
    const k = vis.indexOf(i)
    if (k >= 0) return spread(k)
    const below = [...vis].reverse().find((v) => v < i)
    return below !== undefined && i < vis[vis.length - 1] ? spread(vis.indexOf(below)) : last
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
  // All reached: the line stops at the last icon, not the track end (Figma 158:7267)
  return prevPos
})

/** Labels: first hugs the left edge, last hugs the right, middle one centres in the gap between them (text left-aligned) */
function labelStyle(i: number) {
  const vis = visibleIdx.value
  const k = vis.indexOf(i)
  const hidden = k < 0
  const first = k === 0
  const last = k === vis.length - 1
  const left = hidden
    ? `${stops.value[i] * 100}%`
    : first
      ? '0%'
      : last
        ? '100%'
        : `${(middleLabelPx.value / trackWidth.value) * 100}%`
  const shift = hidden ? (stops.value[i] >= (trackWidth.value - LAST_INSET) / trackWidth.value ? -100 : -50) : first ? 0 : last ? -100 : -50
  return {
    left,
    transform: `translateX(${shift}%)`,
    // Middle label box is centred, but its two lines align left
    textAlign: (shift === -100 ? 'right' : 'left') as 'left' | 'right',
    // Lines shrink to their text, so the «від N ₴» width can be measured for the middle stop
    alignItems: shift === -100 ? 'flex-end' : 'flex-start',
    opacity: hidden ? 0 : 1,
  }
}

const caption = (m: (typeof milestones)[number]) =>
  m.samples === 0 ? 'Безкоштовна доставка' : `${m.samples} ${m.samples === 1 ? 'подарунок' : 'подарунки'}`

// Screen readers only — the visible hint above the scale was removed
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

onMounted(() => {
  // offsetWidth ignores the translateX on labels; content changes (e.g. the check appearing) re-measure too
  resizeObserver = new ResizeObserver(() => {
    if (track.value) trackWidth.value = track.value.offsetWidth || trackWidth.value
    labelWidths.value = labelEls.map((el) => el?.offsetWidth ?? 0)
    amountWidths.value = labelEls.map((el) => (el?.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0)
  })
  if (track.value) resizeObserver.observe(track.value)
  labelEls.forEach((el) => el && resizeObserver!.observe(el))
})
onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <div
    class="progress"
    role="progressbar"
    :aria-valuenow="Math.round(progress * 100)"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuetext="message"
  >
    <div ref="track" class="progress__track">
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
        :ref="setLabelEl(i)"
        class="progress__label body-s"
        :aria-hidden="!isVisible(i) || undefined"
        :style="{ ...labelStyle(i), transition: moveTransition }"
      >
        <span class="progress__label-amount">від {{ formatAmount(m.amount) }}</span>
        <span
          class="progress__label-caption"
          :class="{ 'is-available': isAvailable(m), 'is-claimed': isClaimed(m), 'is-declined': isDeclined(m) }"
        >
          <SkIcon v-if="isDeclined(m)" name="CrossSmall" :size="16" color="var(--status-danger-fg)" class="progress__cross" />
          <SkIcon v-else-if="isClaimed(m)" name="Check" :size="18" color="var(--status-success-fg)" class="progress__check" />
          {{ caption(m) }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress {
  padding: var(--space-4) var(--space-5) 0;
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
  display: flex;
  align-items: center;
  color: var(--fg-muted);
  transition: color 0.3s ease;
}

/* Доступно, але ще не обрано — просто активний підпис */
.progress__label-caption.is-available {
  color: var(--fg-default);
}

.progress__label-caption.is-claimed {
  color: var(--status-success-fg);
}

.progress__label-caption.is-declined {
  color: var(--status-danger-fg);
}

/* 18px glyph in a 16px line, nudged 2px left of the label edge (Figma) */
.progress__check {
  flex-shrink: 0;
  margin: -1px 0 -1px -2px;
}

/* 16px cross takes the same 16px of the line as the check above: glyph starts ~1px from the edge */
.progress__cross {
  flex-shrink: 0;
  margin: 0 2px 0 -2px;
}
</style>
