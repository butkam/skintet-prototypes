<script setup lang="ts" generic="T extends string | number">
// Figma "Segmented Control" (node 112:1654): bg/surface pill, padding space/1, gap space/1.
// Segment: padding space/5 × space/3, Body/M. Selected: bg/canvas + Elevation/S, fg/default; others fg/muted.
// `block` (node 146:6765): stretches to full width, segments padded space/3 with a 16px icon + gap space/2.
// Segments never shrink — on narrow screens the control scrolls horizontally instead.
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { spring } from '@/motion/spring'

const props = defineProps<{ options: T[]; label?: string; block?: boolean }>()
const model = defineModel<T>({ required: true })
defineSlots<{ default?: (p: { option: T; active: boolean }) => unknown }>()

const root = ref<HTMLElement | null>(null)
const indicator = ref({ x: 0, w: 0, ready: false })
const s = spring({ stiffness: 420, damping: 30, mass: 1 })

function measure() {
  const btn = root.value?.querySelector<HTMLElement>(`[data-value="${model.value}"]`)
  if (!btn) return
  indicator.value = { x: btn.offsetLeft, w: btn.offsetWidth, ready: true }
}

// Keep the active segment fully visible when the control scrolls
function reveal() {
  const el = root.value
  const btn = el?.querySelector<HTMLElement>(`[data-value="${model.value}"]`)
  if (!el || !btn || el.scrollWidth <= el.clientWidth) return
  const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0
  const left = btn.offsetLeft - pad
  const right = btn.offsetLeft + btn.offsetWidth + pad - el.clientWidth
  if (left < el.scrollLeft) el.scrollTo({ left, behavior: 'smooth' })
  else if (right > el.scrollLeft) el.scrollTo({ left: right, behavior: 'smooth' })
}

// Block segments change width with the viewport — keep the indicator under the active one
let observer: ResizeObserver | undefined
onMounted(() => {
  measure()
  if (props.block && root.value) {
    observer = new ResizeObserver(measure)
    observer.observe(root.value)
  }
})
onBeforeUnmount(() => observer?.disconnect())
watch([model, () => props.options.length], () =>
  nextTick(() => {
    measure()
    if (props.block) reveal()
  }),
)

const style = computed(() => ({
  transform: `translateX(${indicator.value.x}px)`,
  width: `${indicator.value.w}px`,
  transition: indicator.value.ready ? `transform ${s.duration}ms ${s.easing}, width ${s.duration}ms ${s.easing}` : 'none',
}))
</script>

<template>
  <div ref="root" class="sk-segmented" :class="{ 'sk-segmented--block': block }" role="radiogroup" :aria-label="label">
    <span class="sk-segmented__indicator" :style="style" aria-hidden="true" />
    <button
      v-for="option in options"
      :key="option"
      class="sk-segmented__item body-m"
      :class="{ 'is-active': option === model }"
      type="button"
      role="radio"
      :aria-checked="option === model"
      :data-value="option"
      @click="model = option"
    >
      <slot :option="option" :active="option === model">{{ option }}</slot>
    </button>
  </div>
</template>

<style scoped>
.sk-segmented {
  position: relative;
  display: inline-flex;
  gap: var(--space-1);
  padding: var(--space-1);
  border-radius: var(--radius-full);
  background: var(--bg-surface);
}

.sk-segmented__indicator {
  position: absolute;
  top: var(--space-1);
  bottom: var(--space-1);
  left: 0;
  border-radius: var(--radius-full);
  background: var(--bg-canvas);
  box-shadow: var(--elevation-s);
}

.sk-segmented__item {
  position: relative;
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-full);
  color: var(--fg-muted);
  font-variant-numeric: tabular-nums;
  transition: color 0.2s ease;
}

.sk-segmented__item.is-active {
  color: var(--fg-default);
}

.sk-segmented__item:focus-visible {
  outline: var(--border-width-focus) solid var(--border-focus);
  outline-offset: -2px;
}

.sk-segmented--block {
  display: flex;
  background: var(--bg-subtle);
  width: 100%;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.sk-segmented--block::-webkit-scrollbar {
  display: none;
}

.sk-segmented--block .sk-segmented__item {
  display: flex;
  flex: 1 0 auto;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3);
  white-space: nowrap;
}
</style>
