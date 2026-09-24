<script setup lang="ts">
// Figma 161:7810 (семпли ще недоступні) · 160:7315 (згорнуто) · 161:7952 (вибір наборів)
// Липка панель під хедером: шкала + семпли. Розгорнутий вибір лягає поверх товарів, не зсуваючи їх.
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import SkIcon from './SkIcon.vue'
import CartProgress from './CartProgress.vue'
import SampleCard from './SampleCard.vue'
import SampleCardSkeleton from './SampleCardSkeleton.vue'
import SkButton from './SkButton.vue'
import { useCart } from '@/composables/useCart'
import { formatAmount, formatPrice, milestones, pluralFreeSamples, samples } from '@/data/catalog'
import { prefersReducedMotion, spring } from '@/motion/spring'

const props = defineProps<{
  /** Кошик попросив обрати подарунок: дія переїжджає в панель, виходів з неї більше нема */
  offering?: boolean
  /** Назва цієї дії — рахує кошик, бо вона залежить від того, скільки слотів вільні */
  actionLabel?: string
}>()

const emit = defineEmits<{ order: [] }>()

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
  return `Оберіть ${n} ${n === 1 ? 'набір' : 'набори'} семплів у подарунок`
})

// Collapsed toggle: invite to pick while slots are free, then progress to the next gift
const toggleLabel = computed(() => {
  if (!limitReached.value) {
    // Щойно щось обрано — кажемо, скільки слотів лишилось, а не загальне запрошення
    const left = cart.samplesAllowed.value - picked.value
    return picked.value ? `Оберіть ще ${left} ${pluralFreeSamples(left)}` : 'Оберіть безкоштовні семпли'
  }
  const n = picked.value
  const next = milestones.find((m) => cart.subtotal.value < m.amount)
  if (!next) return 'Вітаємо, ви обрали всі подарунки!'
  const noun = n === 1 ? 'подарунок' : n < 5 ? 'подарунки' : 'подарунків'
  return `Ви обрали ${n} ${noun}, до наступного ще ${formatAmount(next.amount - cart.subtotal.value)}`
})

// Стан спільний з кошиком: «Замовити» відкриває цю саму панель
const open = cart.giftsOpen
// Slight overshoot: the arrow springs a touch past flat on its way over
const flip = spring({ stiffness: 320, damping: 24, mass: 1 })
// Picked samples move to the end of the list — but only from the second opening on,
// so cards never jump while the user is choosing
const order = ref(samples.map((s) => s.id))
let opens = 0
const orderedSamples = computed(() => order.value.map((id) => samples.find((s) => s.id === id)!))

/* ---------- Opening in three beats: height → skeleton → cards ---------- */

// The panel used to unfold and dump everything at once. Now the frame opens first,
// a skeleton holds the cards' place while their images decode, and only then do the
// cards fade in one after another.
const HEIGHT_MS = 400 // matches the grid-rows transition below
const SKELETON_MIN_MS = 380 // skeleton stays at least until the panel has finished unfolding

const ready = ref(false)
let imagesReady: Promise<unknown> | null = null
const preloadSamples = () =>
  (imagesReady ??= Promise.all(
    samples.map(
      (s) =>
        new Promise((resolve) => {
          const img = new Image()
          img.onload = img.onerror = resolve
          img.src = s.image
        }),
    ),
  ))

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

let openId = 0
let collapseTimer: number | undefined

watch(open, async (value) => {
  clearTimeout(collapseTimer)
  const id = ++openId

  if (!value) {
    // Swap back to the skeleton only once the panel is actually shut, so the change never flashes
    collapseTimer = window.setTimeout(() => {
      if (openId === id) ready.value = false
    }, HEIGHT_MS)
    return
  }

  // Reorder while the skeleton still covers the track — the cards never visibly jump
  if (++opens >= 2) {
    order.value = [...samples].sort((a, b) => Number(cart.hasSample(a.id)) - Number(cart.hasSample(b.id))).map((s) => s.id)
  }

  if (prefersReducedMotion()) {
    ready.value = true
    return
  }

  ready.value = false
  await Promise.all([preloadSamples(), wait(SKELETON_MIN_MS)])
  if (openId === id && open.value) ready.value = true
})

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

// Відмова (Figma 208:1858 → 208:2098): прибираємо обрані семпли, згортаємо панель
function decline() {
  cart.declineSamples()
  open.value = false
}

// Повернення: одразу показуємо вибір — інакше довелось би тапати ще раз по тоглу
function resume() {
  cart.resumeSamples()
  open.value = true
}

/* ---------- Overlay: панель лягає поверх списку, а не розсуває його ---------- */

// Панель абсолютна, тож її ріст узагалі не змінює потік. Обгортка тримає висоту
// згорнутого стану — різницю двох розмірів, знятих в один момент.
//
// Раніше панель була в потоці, а під неї підкладався від'ємний маржин у висоту
// пікера. Маржин приходив із ResizeObserver, тобто на кілька кадрів пізніше за
// сам ріст панелі, — і список під нею через це вібрував усю анімацію.
const root = ref<HTMLElement | null>(null)
const sheet = ref<HTMLElement | null>(null)
const picker = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | undefined

function syncHeight() {
  if (!root.value || !sheet.value) return
  // Дробові розміри, не offsetHeight: округлення до цілого лишало ±0.5px дихання
  const full = sheet.value.getBoundingClientRect().height
  const grown = picker.value?.getBoundingClientRect().height ?? 0
  root.value.style.height = `${full - grown}px`
}

onMounted(() => {
  // Синхронно, до першої промальовки, щоб список не підстрибнув на кадр
  syncHeight()
  resizeObserver = new ResizeObserver(syncHeight)
  if (sheet.value) resizeObserver.observe(sheet.value)
})
// The picker only exists once samples unlock
watch(picker, () => syncHeight())
onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  clearTimeout(collapseTimer)
})
</script>

<template>
  <div ref="root" class="gifts" data-sticky-top>
    <div ref="sheet" class="gifts__sheet" :class="{ 'is-open': open }">
      <CartProgress :subtotal="cart.subtotal.value" :picked="picked" />

      <!-- Locked: how much is left to the next goal -->
      <p v-if="!unlocked" class="gifts__hint body-s" aria-live="polite">
        <span class="gifts__hint-row">
          <SkIcon name="Sparkle" :size="20" />
          {{ lockedHint }}
        </span>
      </p>

      <template v-else>
        <div ref="picker" class="gifts__picker" :class="{ 'is-open': open }" :inert="!open || undefined">
          <div class="gifts__picker-inner" :class="{ 'is-offering': offering }">
            <div class="gifts__head">
              <h3 id="gifts-title" class="body-s">{{ pickerTitle }}</h3>
              <span class="gifts__counter body-s" aria-live="polite">{{ picked }}/{{ cart.samplesAllowed.value }}</span>
            </div>
            <!-- Figma 212:2305 — тиха відмова під заголовком, подалі від «Закрити».
                 Під час пропозиції її замінює кнопка «Без подарунків» — два виходи поруч зайві -->
            <button v-if="!offering" class="gifts__decline link body-s" type="button" @click="decline">
              Відмовитись від подарунків
            </button>
            <!-- Skeleton and cards share one grid cell: the track keeps its height through the swap -->
            <div class="gifts__stack">
              <div class="gifts__track gifts__track--skeleton" :class="{ 'is-gone': ready }" aria-hidden="true">
                <SampleCardSkeleton v-for="(s, i) in samples" :key="s.id" :style="{ '--d': `${i * 90}ms` }" />
              </div>
              <div
                class="gifts__track"
                :class="{ 'is-ready': ready }"
                role="group"
                aria-labelledby="gifts-title"
                :inert="!ready || undefined"
              >
                <div v-for="(s, i) in orderedSamples" :key="s.id" class="gifts__slot" :style="{ '--d': `${i * 45}ms` }">
                  <SampleCard
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

            <!-- Дія кошика на час вибору живе тут, під каруселлю -->
            <SkButton v-if="offering" class="gifts__action" block @click="emit('order')">
              {{ actionLabel }}
              <template #amount>{{ formatPrice(cart.total.value) }}</template>
            </SkButton>
          </div>
        </div>

        <!-- Figma 208:2098 — замість тогла лишається рядок з поверненням до вибору -->
        <p v-if="cart.samplesDeclined.value" class="gifts__declined body-s">
          <span>Ви відмовились від подарунків</span>
          <button class="gifts__resume link" type="button" @click="resume">Хочу семпли</button>
        </p>

        <button v-else-if="!offering" class="gifts__toggle body-s" type="button" :aria-expanded="open" @click="open = !open">
          {{ open ? 'Закрити' : toggleLabel }}
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
  /* Висоту згорнутої панелі ставить syncHeight; розгорнута виходить за межі */
  height: 0;
}

/* Figma: canvas, radius/lg at the bottom, Elevation/M */
.gifts__sheet {
  /* Поза потоком: анімація відкриття не рухає нічого під панеллю */
  position: absolute;
  inset: 0 0 auto;
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

/* 29px under the scale labels, 17px to the cards */
.gifts__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-top: 29px;
  padding-inline: var(--space-5);
  color: var(--fg-default);
}

.gifts__counter {
  flex-shrink: 0;
  color: var(--action-primary-fg-disabled);
  font-variant-numeric: tabular-nums;
}

/* 20px під лінком відмови (з них 4px дає падинг треку); -4px не дає обрізати пружину рамки обраної картки */
.gifts__stack {
  display: grid;
  margin: 16px 0 -4px;
}
.gifts__stack > * {
  grid-area: 1 / 1;
}

.gifts__track {
  display: flex;
  gap: var(--space-3);
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

/* The skeleton fades out from under the cards it was holding the place for */
.gifts__track--skeleton {
  overflow: hidden;
  pointer-events: none;
  transition: opacity 0.24s ease;
}
.gifts__track--skeleton.is-gone {
  opacity: 0;
}
/* No point sweeping a skeleton nobody can see */
.gifts__picker:not(.is-open) :deep(.sk-card)::after,
.gifts__track--skeleton.is-gone :deep(.sk-card)::after {
  animation-play-state: paused;
}

/* Cards arrive one after another, a beat apart (--d) */
.gifts__slot {
  flex-shrink: 0;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.26s ease, transform 0.38s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.gifts__track.is-ready .gifts__slot {
  opacity: 1;
  transform: none;
  transition-delay: var(--d);
}

/* Пропозиція: лінка відмови нема, тож карусель підходить до заголовка на ті ж 17px,
   що й до його появи; кнопка внизу замикає панель замість тогла */
.gifts__picker-inner.is-offering .gifts__stack {
  margin-top: 13px;
}

.gifts__picker-inner.is-offering {
  padding-bottom: var(--space-5);
}

.gifts__action {
  width: calc(100% - var(--space-5) * 2);
  margin: var(--space-5) var(--space-5) 0;
}

/* Figma 212:2305 — відмова як тихий лінк під заголовком: вага менша за «Закрити», тож дві дії
   більше не читаються як одна пара */
.gifts__decline {
  position: relative;
  /* block — інакше рядок inline-block додає під лінком ~2.5px базової лінії */
  display: block;
  width: fit-content;
  margin: var(--space-2) var(--space-5) 0;
}

/* Тап-зона до 32px заввишки, не рухаючи 16px рядок */
.gifts__decline::after {
  content: '';
  position: absolute;
  inset: -8px -12px;
}

.gifts__decline:focus-visible {
  outline: var(--border-width-focus) solid var(--border-focus);
  outline-offset: 2px;
  border-radius: var(--radius-xs);
}

/* ---------- Declined (208:2098): рядок замість тогла ---------- */

.gifts__declined {
  box-sizing: border-box;
  display: flex;
  /* Посилання тримається першого рядка, коли текст переноситься на вузькому екрані */
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
  /* Панель не нижча за згорнутий стан, але й не обрізає другий рядок */
  min-height: var(--gifts-footer-h);
  margin: 0;
  /* Текст на тій самій висоті, що й «Оберіть безкоштовні семпли» */
  padding: calc(var(--space-5) - (20px - var(--font-line-height-xs)) / 2) var(--space-5) var(--space-2);
  color: var(--fg-default);
}

.gifts__resume {
  flex-shrink: 0;
}

.gifts__resume:focus-visible {
  outline: var(--border-width-focus) solid var(--border-focus);
  outline-offset: 2px;
  border-radius: var(--radius-xs);
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
  .gifts__slot {
    opacity: 1;
    transform: none;
    transition: none;
  }
  .gifts__track--skeleton {
    transition: none;
  }
}
</style>
