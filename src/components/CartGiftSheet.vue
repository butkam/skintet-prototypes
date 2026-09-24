<script setup lang="ts">
// Остання пропозиція перед оформленням: якщо лишились невибрані безкоштовні семпли,
// «Замовити» спершу піднімає шторку з тією ж каруселлю, що й у панелі подарунків.
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import SkButton from './SkButton.vue'
import SampleCard from './SampleCard.vue'
import { useCart } from '@/composables/useCart'
import { formatPrice, pluralFreeSamples, samples } from '@/data/catalog'
import { prefersReducedMotion, spring } from '@/motion/spring'

const open = defineModel<boolean>({ required: true })
const emit = defineEmits<{ confirm: [] }>()

const cart = useCart()

const picked = computed(() => cart.sampleLines.value.length)
const left = computed(() => Math.max(0, cart.samplesAllowed.value - picked.value))
const limitReached = computed(() => picked.value >= cart.samplesAllowed.value)

// Один рядок навіть на 375px: «у подарунок» дублює те, що й так каже підпис нижче
const title = computed(() => (left.value ? `Ще ${left.value} ${pluralFreeSamples(left.value)}` : 'Подарунки додано'))
// Слоти зайняті — кличемо не обирати, а перевірити вибір
const note = computed(() =>
  left.value ? 'Оберіть набір — на суму замовлення це не вплине' : 'Можна змінити вибір або замовляти',
)
// Кнопка каже правду про те, що станеться: без вибору замовлення піде без подарунка
const action = computed(() => (picked.value ? 'Замовити' : 'Замовити без подарунка'))

/* ---------- Відкриття / закриття ---------- */

const sheet = ref<HTMLElement | null>(null)
let returnFocus: HTMLElement | null = null

watch(open, (value) => {
  if (value) returnFocus = document.activeElement as HTMLElement | null
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) open.value = false
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

// Критично задемпфована, як і висувний кошик — швидко й без перельоту біля краю
const slideSpring = { stiffness: 380, damping: 39, mass: 1 }

function onEnter(el: Element, done: () => void) {
  const panel = el.querySelector<HTMLElement>('.sheet')!
  const scrim = el.querySelector<HTMLElement>('.sheet__scrim')!
  scrim.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease-out' })
  if (prefersReducedMotion()) {
    panel.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150 }).onfinish = done
    return
  }
  const sp = spring(slideSpring)
  panel.animate([{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], {
    duration: sp.duration,
    easing: sp.easing,
  }).onfinish = done
}

function onAfterEnter() {
  nextTick(() => sheet.value?.focus({ preventScroll: true }))
}

function onLeave(el: Element, done: () => void) {
  const panel = el.querySelector<HTMLElement>('.sheet')!
  const scrim = el.querySelector<HTMLElement>('.sheet__scrim')!
  const duration = prefersReducedMotion() ? 120 : 240
  scrim.animate([{ opacity: 1 }, { opacity: 0 }], { duration, easing: 'ease-in', fill: 'forwards' })
  panel.animate(
    prefersReducedMotion()
      ? [{ opacity: 1 }, { opacity: 0 }]
      : [{ transform: panel.style.transform || 'translateY(0)' }, { transform: 'translateY(100%)' }],
    { duration, easing: 'cubic-bezier(0.4, 0, 0.9, 0.6)', fill: 'forwards' },
  ).onfinish = done
}

function onAfterLeave() {
  returnFocus?.focus({ preventScroll: true })
  returnFocus = null
}

function confirm() {
  open.value = false
  emit('confirm')
}

/* ---------- Свайп вниз, щоб закрити ---------- */

const drag = { tracking: false, active: false, startX: 0, startY: 0, dy: 0, lastY: 0, lastT: 0, velocity: 0, pointerId: -1 }

function onPointerDown(e: PointerEvent) {
  if (e.pointerType === 'mouse' && e.button !== 0) return
  // Картки й кнопка мають власні жести
  if ((e.target as HTMLElement).closest('button, a, .sheet__track')) return
  Object.assign(drag, { tracking: true, active: false, startX: e.clientX, startY: e.clientY, dy: 0, lastY: e.clientY, lastT: e.timeStamp, velocity: 0, pointerId: e.pointerId })
}

function onPointerMove(e: PointerEvent) {
  if (!drag.tracking || e.pointerId !== drag.pointerId || !sheet.value) return
  const dx = e.clientX - drag.startX
  const dy = e.clientY - drag.startY

  if (!drag.active) {
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
    // Тільки рух униз і переважно вертикальний
    if (dy <= 0 || Math.abs(dx) > Math.abs(dy)) {
      drag.tracking = false
      return
    }
    drag.active = true
    try {
      sheet.value.setPointerCapture(e.pointerId)
    } catch {
      // Вказівник уже відпущено — стеження працює й без захоплення
    }
  }

  drag.dy = Math.max(0, dy)
  const dt = Math.max(1, e.timeStamp - drag.lastT)
  drag.velocity = ((e.clientY - drag.lastY) / dt) * 1000
  drag.lastY = e.clientY
  drag.lastT = e.timeStamp
  sheet.value.style.transform = `translateY(${drag.dy}px)`
}

function onPointerUp(e: PointerEvent) {
  if (!drag.tracking || e.pointerId !== drag.pointerId) return
  drag.tracking = false
  if (!drag.active || !sheet.value) return
  drag.active = false

  const height = sheet.value.offsetHeight
  if (drag.dy > height * 0.3 || drag.velocity > 600) {
    open.value = false
    return
  }

  const releaseVelocity = drag.dy > 1 ? -drag.velocity / drag.dy : 0
  const sp = spring({ ...slideSpring, velocity: Math.max(-20, Math.min(20, Math.round(releaseVelocity))) })
  sheet.value.animate([{ transform: `translateY(${drag.dy}px)` }, { transform: 'translateY(0)' }], { duration: sp.duration, easing: sp.easing })
  sheet.value.style.transform = ''
}
</script>

<template>
  <Teleport to="body">
    <Transition :css="false" @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave" @after-leave="onAfterLeave">
      <div v-if="open" class="sheet-root">
        <!-- touch-action: none — сторінка за шторкою не скролиться -->
        <div class="sheet__scrim" @click="open = false" />

        <section
          ref="sheet"
          class="sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gift-sheet-title"
          tabindex="-1"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
        >
          <span class="sheet__grabber" aria-hidden="true" />

          <div class="sheet__head">
            <h2 id="gift-sheet-title" class="heading-s">{{ title }}</h2>
            <p class="sheet__note body-s">{{ note }}</p>
          </div>

          <div class="sheet__track" role="group" aria-labelledby="gift-sheet-title">
            <SampleCard
              v-for="s in samples"
              :key="s.id"
              :title="s.title"
              :description="s.description"
              :image="s.image"
              :selected="cart.hasSample(s.id)"
              :disabled="limitReached && !cart.hasSample(s.id)"
              @click="cart.toggleSample(s)"
            />
          </div>

          <SkButton class="sheet__action" block @click="confirm">
            {{ action }}
            <template #amount>{{ formatPrice(cart.total.value) }}</template>
          </SkButton>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sheet-root {
  position: fixed;
  inset: 0;
  z-index: 50;
}

.sheet__scrim {
  position: absolute;
  inset: 0;
  background: var(--bg-scrim);
  touch-action: none;
}

/* Та сама колонка-телефон, що й у кошика */
.sheet {
  position: absolute;
  inset: auto 0 0 0;
  max-width: 440px;
  margin-inline: auto;
  padding-bottom: calc(env(safe-area-inset-bottom) + var(--space-5));
  background: var(--bg-canvas);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  box-shadow: var(--elevation-l);
  touch-action: pan-y;
  will-change: transform;
}

.sheet:focus-visible {
  outline: none;
}

.sheet__grabber {
  display: block;
  width: 36px;
  height: 4px;
  margin: var(--space-2) auto 0;
  border-radius: var(--radius-full);
  background: var(--border-strong);
}

.sheet__head {
  padding: var(--space-5) var(--space-5) 0;
}

.sheet__note {
  margin-top: var(--space-1);
  color: var(--fg-muted);
}

/* Карусель як у панелі подарунків: 4px по краях не дає обрізати рамку обраної картки */
.sheet__track {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-4);
  padding: 4px var(--space-5);
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: var(--space-5);
  scrollbar-width: none;
  touch-action: pan-x pan-y;
}
.sheet__track::-webkit-scrollbar {
  display: none;
}

.sheet__track > * {
  flex-shrink: 0;
}

.sheet__action {
  width: calc(100% - var(--space-5) * 2);
  margin: var(--space-5) var(--space-5) 0;
}
</style>
