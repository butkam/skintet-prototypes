<script setup lang="ts">
// Figma nodes 112:2192–2221 — горизонтальна стрічка карток товарів з заголовком
// («Ви переглядали» в порожньому кошику, «Рекомендовані засоби» в повному)
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import ProductMiniCard from './ProductMiniCard.vue'
import ScrollArrows from './ScrollArrows.vue'
import { useCart } from '@/composables/useCart'
import { useTwoColumnCart } from '@/composables/useWideCart'
import { scrollShift } from '@/motion/scrollShift'
import { demoProducts } from '@/data/demoProducts'
import { formatPrice } from '@/data/catalog'
import { prefersReducedMotion } from '@/motion/spring'
import { LINE_ENTER_MS, snap, tween } from '@/motion/tween'

// `ids` — бажані товари, першими в стрічці. Коли з них поза кошиком лишилось менше `min`,
// стрічка добирає інші засоби з каталогу (без апаратів) — спершу ті, яких ще немає в кошику.
const props = withDefaults(
  defineProps<{ title: string; ids: string[]; align?: 'center' | 'start'; min?: number }>(),
  { align: 'center', min: 4 },
)

const { lines, add } = useCart()
const wide = useTwoColumnCart()

/** Щойно натиснуті: картка ще трохи стоїть з галочкою, а потім іде зі стрічки в кошик */
const added = ref<string[]>([])
const CHECK_HOLD_MS = 550

const fillers = computed(() =>
  demoProducts.filter((p) => p.category !== 'device' && !props.ids.includes(p.id)).map((p) => p.id),
)

// Товарів, що вже лежать у кошику, у стрічці не показуємо; щойно додані ще стоять з галочкою.
// Така картка ще займає своє місце в `min`: заміна дописується в кінець, лише коли вона йде.
// Інакше стрічка подовжувалась просто під пальцем, і Safari перескакував прив'язкою прокрутки
const items = computed(() => {
  const inCart = new Set(lines.value.map((l) => l.id))
  const shown: string[] = []
  let fresh = 0
  for (const id of [...props.ids, ...fillers.value]) {
    const pending = added.value.includes(id)
    if (inCart.has(id) && !pending) continue
    if (fresh >= props.min && !props.ids.includes(id)) continue
    shown.push(id)
    fresh++
  }
  // Каталог вичерпано — добираємо тим, що вже в кошику: «Купити» тоді просто додає ще одну штуку
  for (const id of [...props.ids, ...fillers.value]) {
    if (fresh >= props.min) break
    if (shown.includes(id)) continue
    shown.push(id)
    fresh++
  }
  return shown.map((id) => demoProducts.find((p) => p.id === id)).filter((p) => p !== undefined)
})

const titleId = `rail-${Math.random().toString(36).slice(2, 8)}`

const root = ref<HTMLElement | null>(null)
const timers: number[] = []
const holds: (() => void)[] = []
onBeforeUnmount(() => {
  timers.forEach(clearTimeout)
  holds.forEach((stop) => stop())
})

// Стрілки гортають саму стрічку (TransitionGroup віддає її як $el)
const track = ref<{ $el: HTMLElement } | null>(null)

// Спершу відгук на картці: «Купити» стає «Додано» з галочкою, товар ще не в кошику. Лише коли картка йде зі стрічки,
// товар лягає в кошик — рядок розгортається в списку одночасно з тим, як картка згортається.
// Інакше на телефоні рядок ставав першим ще до галочки, і все виглядало навпаки
function onAdd(id: string) {
  if (added.value.includes(id)) return
  added.value.push(id)
  timers.push(window.setTimeout(() => commit(id), CHECK_HOLD_MS))
}

// Новий рядок стає першим у списку, вище за стрічку. Видно його — він розгортається (CartLines → onEnter)
// і просто відсуває стрічку вниз, як будь-яка вставка. Поза екраном рядок стає одразу, і документ
// зсуваємо один раз — щоб вміст під пальцем не стрибнув. Щокадрово зсув міряється лише в широкому кошику:
// там стрічка в іншій колонці, а на iPhone щокадрове підкручування документа трусило кошик.
// Кадр списку зареєстровано раніше за наш, тож зсув міряємо вже після нього, у тому ж кадрі
async function commit(id: string) {
  const before = root.value?.getBoundingClientRect().top ?? 0
  added.value = added.value.filter((a) => a !== id)
  add(id)
  await nextTick()
  const hold = () => {
    if (!root.value?.isConnected) return
    const shift = root.value.getBoundingClientRect().top - before
    if (shift) scrollShift(root.value, shift)
  }
  hold()
  if (wide.value) holds.push(tween(LINE_ENTER_MS, hold))
}

/* Card leaves: fades while its width and the gap after it close, so the rest slide in */
// Поки картка згортається, прив'язку прокрутки вимкнено: стрічка на мить довша (заміна вже в кінці),
// і Safari перескакував до іншої картки замість того, щоб дати сусідам плавно під'їхати
let leaving = 0
function onLeave(el: Element, finish: () => void) {
  const node = el as HTMLElement
  if (prefersReducedMotion()) return finish()
  const track = node.parentElement!
  if (leaving++ === 0) track.style.scrollSnapType = 'none'
  const done = () => {
    if (--leaving === 0) track.style.scrollSnapType = ''
    finish()
  }
  const width = node.getBoundingClientRect().width
  // border-box: without the padding going too the card would stop at 16px and then jump
  const padding = parseFloat(getComputedStyle(node).paddingLeft)
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0
  node.style.overflow = 'hidden'
  tween(
    240,
    (p) => {
      node.style.opacity = `${1 - Math.min(1, p * 1.6)}`
      node.style.width = `${snap(width * (1 - p))}px`
      node.style.paddingInline = `${snap(padding * (1 - p))}px`
      node.style.marginRight = `${-snap(gap * p)}px`
    },
    done,
  )
}

/* Last card taken: the whole rail folds up — height and the gap above it close, content below rides up.
   Only then: when the parent drops the rail (empty cart → full) it just goes, the cart swaps anyway */
function onCollapse(el: Element, done: () => void) {
  const node = el as HTMLElement
  if (items.value.length || prefersReducedMotion()) return done()
  const height = node.getBoundingClientRect().height
  const margin = parseFloat(getComputedStyle(node).marginTop)
  node.style.overflow = 'hidden'
  tween(
    360,
    (p) => {
      node.style.opacity = `${1 - Math.min(1, p * 1.6)}`
      node.style.height = `${snap(height * (1 - p))}px`
      node.style.marginTop = `${snap(margin * (1 - p))}px`
    },
    done,
  )
}
</script>

<template>
  <Transition :css="false" @leave="onCollapse">
    <section v-if="items.length" ref="root" class="rail" :aria-labelledby="titleId">
      <h3 :id="titleId" class="rail__title heading-s" :class="`rail__title--${align}`">{{ title }}</h3>
      <div class="rail__viewport">
        <TransitionGroup ref="track" tag="div" class="rail__track" :css="false" @leave="onLeave">
          <ProductMiniCard
            v-for="p in items"
            :key="p.id"
            :title="p.title"
            :price="formatPrice(p.price)"
            :image="p.image"
            :added="added.includes(p.id)"
            @add="onAdd(p.id)"
          />
        </TransitionGroup>
        <ScrollArrows :target="track?.$el" />
      </div>
    </section>
  </Transition>
</template>

<style scoped>
.rail__title {
  margin-bottom: var(--space-3);
}
.rail__title--center {
  text-align: center;
}
.rail__title--start {
  padding-inline: var(--space-5);
}

.rail__track {
  display: flex;
  gap: var(--space-3);
  padding-inline: var(--space-5);
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: var(--space-5);
  scrollbar-width: none;
  touch-action: pan-x pan-y;
}
.rail__track::-webkit-scrollbar {
  display: none;
}

/* Стрілки (ScrollArrows) стоять по центру стрічки */
.rail__viewport {
  position: relative;
}
</style>
