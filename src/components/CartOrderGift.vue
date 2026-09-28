<script setup lang="ts">
// Figma 234:3265 + 235:3285 — прототип /gift-card: подарунок до замовлення карткою над товарами.
// Картка з'являється від 3 000 ₴, від 5 000 ₴ її вміст змінюється на другий подарунок, нижче 3 000 ₴ — згортається.
// На телефоні (sticky) при прокрутці картка ховається під шкалу, з-під неї лишається видно стрічку з умовою:
// тап по стрічці або новий подарунок висувають картку, прокрутка ховає назад
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import SkIcon from './SkIcon.vue'
import glow from '@/assets/images/order-gift-glow.svg'
import { useCart } from '@/composables/useCart'
import { formatPrice } from '@/data/catalog'
import { popIn } from '@/motion/popIn'
import { prefersReducedMotion, spring } from '@/motion/spring'
import { LINE_ENTER_MS, snap, tween } from '@/motion/tween'

const props = defineProps<{
  /** Мобільний кошик: блок липне під шкалою (CartGifts), картка ховається під неї */
  sticky?: boolean
}>()

const cart = useCart()

/* ---------- Липка картка: ховається під шкалу, висувається з-під неї ---------- */

/** Скільки картки видно з-під шкали, коли вона схована: край з тінню над стрічкою (як на макеті) */
const PEEK = 12
/** Висунута картка стоїть під шкалою з тим самим відступом, що й у потоці (падинг блока) */
const GAP = 16

const root = ref<HTMLElement | null>(null)
const card = ref<HTMLElement | null>(null)
/** Картку хоч трохи сховано під шкалою — лише тоді стрічка її висуває */
const tucked = ref(false)
const revealed = ref(false)
/** На скільки висунути: до відступу GAP під шкалою */
const shift = ref(0)

const reveal = spring({ stiffness: 320, damping: 26, mass: 1 })

let observer: ResizeObserver | undefined
let observed: HTMLElement | null = null
let frame = 0
/** Остання дія користувача, що гортає сторінку: прокрутку самого кошика (ProductRail тримає стрічку) не рахуємо */
let lastInput = -Infinity

const scale = () => root.value?.parentElement?.querySelector<HTMLElement>(':scope > .gifts') ?? null

/** Низ липкої шкали на екрані */
function scaleBottom() {
  const el = scale()
  return el ? parseFloat(getComputedStyle(el).top) + el.getBoundingClientRect().height : 0
}

/** Верх картки без висування — за поточним зсувом, бо картка може бути ще на пів дороги назад */
function cardTop() {
  const moved = root.value ? new DOMMatrix(getComputedStyle(root.value).transform).m42 : 0
  return (card.value?.getBoundingClientRect().top ?? 0) - moved
}

/** Липне так, щоб від картки під шкалою лишався видно край PEEK */
function place() {
  const node = root.value
  if (!props.sticky || !node || !card.value) return
  const pad = parseFloat(getComputedStyle(node).paddingTop)
  node.style.top = `${scaleBottom() + PEEK - pad - card.value.getBoundingClientRect().height}px`
  sync()
}

function sync() {
  if (!root.value) return
  tucked.value = cardTop() < scaleBottom() + GAP - 0.5
}

function show() {
  sync()
  if (!tucked.value) return
  shift.value = scaleBottom() + GAP - cardTop()
  revealed.value = true
}

function hide() {
  clearTimeout(showTimer)
  revealed.value = false
}
const toggle = () => (revealed.value ? hide() : show())

function onScroll() {
  if (performance.now() - lastInput < 300) {
    clearTimeout(showTimer)
    if (revealed.value) hide()
  }
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(sync)
}

const markInput = () => (lastInput = performance.now())

// Тап по «+» на iPhone майже завжди трохи рухає палець — це ще не прокрутка.
// Інакше підкручування, яким стрічка тримається під пальцем, одразу ховало б щойно висунуту картку
const DRAG_PX = 10
let touchY = 0
const onTouchStart = (e: TouchEvent) => (touchY = e.touches[0]?.clientY ?? 0)
const onTouchMove = (e: TouchEvent) => Math.abs((e.touches[0]?.clientY ?? touchY) - touchY) > DRAG_PX && markInput()

// Сама картка виїжджає, коли список уже став на місце: поки рядок розгортається, стрічка щокадрово
// підкручує документ (ProductRail → onAdd), і рух поверх цього на iPhone смикав кошик
let showTimer: number | undefined
function showLater() {
  clearTimeout(showTimer)
  showTimer = window.setTimeout(show, LINE_ENTER_MS + 40)
}
const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '])
const onKey = (e: KeyboardEvent) => SCROLL_KEYS.has(e.key) && markInput()

// Блок з'являється й зникає разом з подарунком — спостерігаємо за картою й шкалою, поки він є
watch(
  root,
  (node) => {
    observer?.disconnect()
    observed = null
    if (!node || !props.sticky) return
    observer = new ResizeObserver(place)
    if (card.value) observer.observe(card.value)
    observed = scale()
    if (observed) observer.observe(observed)
    place()
  },
  { flush: 'post' },
)

// Де був список перед появою блока: onEnter тримає його там же. Блока ще нема — список шукаємо в кошику
let listTopBefore: number | null = null
watch(
  () => !!cart.orderGift.value,
  (has) => {
    const list = has && props.sticky ? document.querySelector('.cart .cart__lines') : null
    listTopBefore = list ? list.getBoundingClientRect().top : null
  },
  { flush: 'pre' },
)

// Новий подарунок (5 000 ₴ замість 3 000 ₴) висуває сховану картку — видно, що змінилось
watch(
  () => cart.orderGift.value?.id,
  (id, prev) => {
    if (id && prev && id !== prev) showLater()
  },
)

onMounted(() => {
  if (!props.sticky) return
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', place, { passive: true })
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchmove', onTouchMove, { passive: true })
  window.addEventListener('wheel', markInput, { passive: true })
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  cancelAnimationFrame(frame)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', place)
  clearTimeout(showTimer)
  window.removeEventListener('touchstart', onTouchStart)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('wheel', markInput)
  window.removeEventListener('keydown', onKey)
})

/** Значок подарунка підстрибує, щойно подарунок з'явився чи змінився на інший */
const popBadge = (el: Element) => popIn(el.querySelector('.order-gift__badge'))

/* ---------- Поява й зникнення: блок розсуває список, як новий рядок (CartLines) ---------- */

let cancel: (() => void) | undefined

/** Список за блоком повертається туди, де був до появи чи зникнення блока */
function holdList(list: Element | null, before: number) {
  const drift = (list?.getBoundingClientRect().top ?? before) - before
  if (drift) window.scrollBy({ top: drift, behavior: 'instant' })
}

function onEnter(el: Element, done: () => void) {
  const node = el as HTMLElement
  // Шаблонні ref-и прийдуть уже після цього хука, а місце під шкалою треба знати зараз
  root.value = node
  card.value = node.querySelector<HTMLElement>('.order-gift__card')
  place()
  const finish = () => {
    for (const prop of ['overflow', 'height', 'opacity'] as const) node.style[prop] = ''
    done()
    popBadge(node)
    // Подарунок з'явився, поки його місце під шкалою, — висуваємо картку, щоб його було видно
    showLater()
  }
  // Мобільний кошик: блок ніколи не розгортається в потоці. Росте він угорі кошика, а товар додають
  // унизу (стрічка «Рекомендовані», «+» кількості) — тож розгортання штовхало б усе під пальцем, і стрічка
  // тримала б його щокадровим прокручуванням документа. На iPhone від цього, та ще й з липким блоком,
  // трусився кошик. Тож блок стає одразу, прокрутка один раз повертає товари на місце,
  // а картка потім виїжджає з-під шкали (finish → showLater)
  const before = listTopBefore
  listTopBefore = null
  if (props.sticky && before !== null) {
    holdList(node.nextElementSibling, before)
    return finish()
  }
  const rect = node.getBoundingClientRect()
  if (prefersReducedMotion()) return finish()
  // Поза екраном (сума перетнула поріг, коли товар додали зі стрічки внизу) розгортання ніхто
  // не побачить — картка стає одразу, а стрічку на місці тримає ProductRail → onAdd
  if (rect.bottom <= 0 || rect.top >= window.innerHeight) return finish()

  const height = rect.height
  node.style.overflow = 'hidden'
  const frame = (p: number) => {
    // Вміст проявляється, коли під нього вже є місце
    node.style.opacity = `${Math.max(0, (p - 0.35) / 0.65)}`
    node.style.height = `${snap(height * p)}px`
  }
  frame(0)
  cancel = tween(LINE_ENTER_MS, frame, finish)
}

function onLeave(el: Element, done: () => void) {
  cancel?.()
  hide()
  const node = el as HTMLElement
  // Місце блока вже прогорнуто: згортання тягло б товари вгору під пальцем — прибираємо одразу, прокрутка тримає їх
  if (props.sticky && tucked.value) {
    const list = node.nextElementSibling
    const before = list?.getBoundingClientRect().top
    done()
    if (before !== undefined) holdList(list, before)
    return
  }
  if (prefersReducedMotion()) return done()
  const height = node.getBoundingClientRect().height
  node.style.overflow = 'hidden'
  tween(
    280,
    (p) => {
      node.style.opacity = `${1 - Math.min(1, p * 1.6)}`
      node.style.height = `${snap(height * (1 - p))}px`
    },
    done,
  )
}
</script>

<template>
  <Transition :css="false" @enter="onEnter" @leave="onLeave">
    <div
      v-if="cart.orderGift.value"
      ref="root"
      class="order-gift"
      :class="{ 'order-gift--sticky': sticky, 'is-revealed': revealed }"
      :style="{
        '--reveal': `${shift}px`,
        '--reveal-duration': `${reveal.duration}ms`,
        '--reveal-easing': reveal.easing,
      }"
    >
      <!-- Висота картки не залежить від довжини текстів: заміна подарунка не зсуває список -->
      <article ref="card" class="order-gift__card" aria-labelledby="order-gift-title">
        <img class="order-gift__glow" :src="glow" alt="" />
        <Transition name="order-gift-swap" @enter="popBadge">
          <div :key="cart.orderGift.value.id" class="order-gift__body">
            <div class="order-gift__media">
              <img class="order-gift__photo" :src="cart.orderGift.value.image" alt="" />
              <span class="order-gift__badge"><SkIcon name="GiftSmallDark" :size="16" /></span>
            </div>
            <div class="order-gift__head">
              <h3 id="order-gift-title" class="order-gift__title heading-s">
                <span class="visually-hidden">Подарунок: </span>{{ cart.orderGift.value.title }}
              </h3>
              <span class="order-gift__price heading-s">{{ formatPrice(cart.orderGift.value.price) }}</span>
            </div>
            <p class="order-gift__desc body-s">{{ cart.orderGift.value.description }}</p>
          </div>
        </Transition>
      </article>
      <!-- Figma 235:3285 — стрічка з умовою виглядає з-під картки -->
      <!-- Коли картку сховано під шкалою, стрічка її висуває -->
      <button
        class="order-gift__note body-s"
        :class="{ 'is-active': tucked || revealed }"
        type="button"
        :tabindex="tucked || revealed ? undefined : -1"
        :aria-expanded="tucked || revealed ? revealed : undefined"
        @click="toggle"
      >
        <span class="order-gift__note-text" aria-live="polite">
          <Transition name="order-gift-swap">
            <span :key="cart.orderGift.value.amount">Подарунок до замовлення від {{ formatPrice(cart.orderGift.value.amount) }}</span>
          </Transition>
        </span>
      </button>
    </div>
  </Transition>
</template>

<style scoped>
/* 16px під шторкою; 4px знизу + 20px відступу списку = 24px від стрічки до товарів (Figma 234:3051).
   Відступи всередині блока — щоб при появі й зникненні вони росли й згортались разом з ним */
.order-gift {
  --note-overlap: 32px;
  padding: var(--space-4) var(--space-4) var(--space-1);
}

/* Figma 234:3265: canvas, radius/lg, Elevation/M */
.order-gift__card {
  position: relative;
  z-index: 1;
  /* Старий і новий подарунок під час заміни — в одній клітинці, висота не стрибає */
  display: grid;
  overflow: clip;
  border-radius: var(--radius-lg);
  background: var(--bg-canvas);
  box-shadow: var(--elevation-m);
}

/* Ледь рожеве світіння праворуч угорі (Figma 235:3283: коло 365px, зсунуте за край) */
.order-gift__glow {
  position: absolute;
  top: -176px;
  left: 73px;
  width: 365px;
  height: 365px;
  pointer-events: none;
}

/* Фото 56px зліва; праворуч — назва з ціною (40px, два рядки) і опис (два рядки) */
.order-gift__body {
  grid-area: 1 / 1;
  position: relative;
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  grid-template-rows: 40px auto;
  column-gap: var(--space-2);
  row-gap: var(--space-2);
  padding: var(--space-5) var(--space-5) var(--space-3);
}

.order-gift__media {
  grid-row: 1 / 3;
  position: relative;
  width: 56px;
  height: 56px;
}

.order-gift__photo {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-md);
  background: var(--bg-canvas);
  object-fit: cover;
}

/* Значок подарунка на куті фото: 8px за його межами (Figma 234:3268) */
.order-gift__badge {
  position: absolute;
  top: calc(var(--space-2) * -1);
  left: calc(var(--space-2) * -1);
  display: grid;
  place-items: center;
  width: var(--icon-md);
  height: var(--icon-md);
  border-radius: var(--radius-full);
  background: var(--bg-canvas);
  filter: drop-shadow(0 4px 6px oklch(0% 0 0 / 0.08)) drop-shadow(0 0 0.5px oklch(0% 0 0 / 0.24));
}

/* Назва по центру свого 40px рядка, ціна — на першому рядку назви */
.order-gift__head {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  align-self: center;
}

.order-gift__title,
.order-gift__desc {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.order-gift__title {
  flex: 1;
  min-width: 0;
}

.order-gift__price {
  flex-shrink: 0;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

/* Два рядки завжди зарезервовані — картка однакової висоти з будь-яким подарунком */
.order-gift__desc {
  min-height: calc(var(--font-line-height-xs) * 2);
  margin: 0;
  color: var(--fg-muted);
}

/* Figma 235:3285: amber-стрічка з-під картки — 12px текст, по 8px від картки й до низу стрічки */
.order-gift__note {
  display: block;
  width: 100%;
  margin: calc(var(--note-overlap) * -1) 0 0;
  padding: calc(var(--note-overlap) + var(--space-2)) var(--space-5) var(--space-2);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  background: var(--status-warning-bg);
  /* Та сама тінь, що в картки й шкали: схована картка — це стрічка поверх товарів */
  box-shadow: var(--elevation-m);
  color: var(--status-warning-fg);
  text-align: center;
  cursor: default;
}
.order-gift__note.is-active {
  cursor: pointer;
}
.order-gift__note:focus-visible {
  outline: var(--border-width-focus) solid var(--border-focus);
  outline-offset: 2px;
}
.order-gift__note-text {
  display: grid;
}
.order-gift__note-text > span {
  grid-area: 1 / 1;
}

/* ---------- Мобільний кошик: блок липне так, що картка ховається під шкалою (place) ---------- */

/* Під шкалою (z-index 11) і хедером (10), над товарами. Прозорі відступи блока не перехоплюють тапів по товарах */
.order-gift--sticky {
  position: sticky;
  z-index: 9;
  pointer-events: none;
  transition: transform 0.26s cubic-bezier(0.4, 0, 0.2, 1);
}
.order-gift--sticky .order-gift__card,
.order-gift--sticky .order-gift__note {
  pointer-events: auto;
}

/* Висувається з-під шкали пружиною, ховається назад коротко й без перельоту */
.order-gift--sticky.is-revealed {
  transform: translateY(var(--reveal));
  transition: transform var(--reveal-duration) var(--reveal-easing);
}

/* ---------- Заміна подарунка: старий вміст тане, новий проявляється на тому ж місці ---------- */

.order-gift-swap-enter-active {
  transition: opacity 0.26s ease, transform 0.38s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.order-gift-swap-leave-active {
  transition: opacity 0.16s ease;
}
.order-gift-swap-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.order-gift-swap-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .order-gift--sticky,
  .order-gift--sticky.is-revealed,
  .order-gift-swap-enter-active,
  .order-gift-swap-leave-active {
    transition: none;
  }
}
</style>
