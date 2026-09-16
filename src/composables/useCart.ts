import { computed, ref } from 'vue'
import {
  DELIVERY_PRICE,
  demoLines,
  milestones,
  sampleToLine,
  type CartLine,
  type Sample,
} from '@/data/catalog'
import { demoProducts, type DemoProduct } from '@/data/demoProducts'
import { persist } from './persist'

// Прототип: true — при першому додаванні в порожній кошик підставляється вміст з макету
const SEED_DEMO_ON_FIRST_ADD = false

// Shared prototype state — one instance across all screens
const lines = ref<CartLine[]>([])
const drawerOpen = ref(false)
/**
 * While the cart is shown, the underlying screen is taken out of flow (position: absolute,
 * shifted so it stays visually in place) and the cart scrolls the document itself.
 * iOS 26 Safari only renders normal-flow document content behind its translucent bottom
 * toolbar — never fixed/sticky layers or inner scrollers — and a full-width fixed layer at
 * the bottom edge would make Safari paint a solid bar there.
 */
const baseFrozen = ref(false)
persist('cart', () => lines.value, (saved) => (lines.value = saved))
/** Window scroll offset of the screen when the cart opened — restored on close */
const baseScrollY = ref(0)
/** Document-relative `top` of the frozen screen */
const baseTop = ref(0)
/** How the cart leaves: 'close' slides right (dismiss), 'forward' slides left as the next screen pushes in */
const drawerExit = ref<'close' | 'forward'>('close')

const count = computed(() => lines.value.reduce((n, l) => n + l.qty, 0))
const goods = computed(() => lines.value.filter((l) => l.kind !== 'sample'))
const goodsCount = computed(() => goods.value.reduce((n, l) => n + l.qty, 0))
/** Сума товарів без семплів і подарунків — від неї рахуються пороги шкали */
const subtotal = computed(() => goods.value.reduce((s, l) => s + l.price * l.qty, 0))
/** Подарунки, що йдуть з товарами (один на рядок товару) — окремий рядок у підсумку */
const giftCount = computed(() => goods.value.filter((l) => l.gift).length)
const giftsTotal = computed(() => goods.value.reduce((s, l) => s + (l.gift?.price ?? 0), 0))
const freeDelivery = computed(() => subtotal.value >= milestones[0].amount)
const delivery = computed(() => (freeDelivery.value ? 0 : DELIVERY_PRICE))

const sampleLines = computed(() => lines.value.filter((l) => l.kind === 'sample'))
const samplesTotal = computed(() => sampleLines.value.reduce((s, l) => s + l.price * l.qty, 0))

/* ---------- Промокод ---------- */

/** Прототип: єдиний робочий код — −10% на товари без знижки */
const PROMO_CODES: Record<string, { percent: number; label: string }> = {
  SKIN10: { percent: 10, label: '−10% на догляд' },
}
const promoCode = ref<string | null>(null)
persist('promo', () => promoCode.value, (saved) => (promoCode.value = saved))

const promo = computed(() => (promoCode.value ? { code: promoCode.value, ...PROMO_CODES[promoCode.value] } : null))
/** Сума товарів без знижки — на неї діє промокод */
const promoBase = computed(() => goods.value.filter((l) => !l.oldPrice).reduce((s, l) => s + l.price * l.qty, 0))
const promoDiscount = computed(() => (promo.value ? Math.round(promoBase.value * promo.value.percent) / 100 : 0))

/** Застосовує код; повертає текст помилки або null */
function applyPromo(raw: string): string | null {
  const code = raw.trim().toUpperCase()
  if (!PROMO_CODES[code]) return 'Такого промокоду не існує. Перевірте, чи правильно його введено.'
  if (!promoBase.value) return 'Промокод не діє на товари зі знижкою.'
  promoCode.value = code
  return null
}

const total = computed(
  () => subtotal.value + giftsTotal.value + samplesTotal.value + delivery.value - promoDiscount.value,
)
const samplesAllowed = computed(() =>
  milestones.reduce((n, m) => (subtotal.value >= m.amount ? m.samples : n), 0 as number),
)

/** Діапазони суми між порогами: [0, 3000), [3000, 5000), [5000, 8000), [8000, 10000), [10000, ∞) */
const bandOf = (sum: number) => milestones.filter((m) => sum >= m.amount).length
const bandRange = (band: number) => [band ? milestones[band - 1].amount : 0, milestones[band]?.amount ?? Infinity]

const random = <T>(list: T[]) => list[Math.floor(Math.random() * list.length)]

/**
 * Демо-сценарій для шкали: кожне «Купити» переносить суму рівно в наступний діапазон —
 * 1-й товар не дотягує до 3 000 (платна доставка), 2-й — до 5 000, 3-й — до 8 000,
 * 4-й — до 10 000. Далі — випадковий товар.
 */
function pickDemoProduct(): DemoProduct {
  const inCart = new Set(lines.value.map((l) => l.id))
  const fresh = demoProducts.filter((p) => !inCart.has(p.id))
  const current = bandOf(subtotal.value)
  const target = lines.value.length ? current + 1 : 0

  if (target < milestones.length) {
    const [from, to] = bandRange(target)
    const fits = fresh.find((p) => subtotal.value + p.price >= from && subtotal.value + p.price < to)
    if (fits) return fits
  }
  return random(fresh.length ? fresh : demoProducts)
}

/** Adds a demo product (see pickDemoProduct) and returns it */
function add(): DemoProduct {
  const product = pickDemoProduct()

  if (!lines.value.length && SEED_DEMO_ON_FIRST_ADD) {
    lines.value = demoLines()
    return product
  }
  const line = lines.value.find((l) => l.id === product.id)
  if (line) line.qty++
  else {
    const { brand: _brand, url: _url, ...rest } = product
    lines.value.push({
      ...rest,
      qty: 1,
      // Fresh copy so toggling one line's set doesn't mutate the catalog entry
      setItems: rest.setItems?.slice(),
    })
  }
  return product
}

function increment(id: string) {
  const line = lines.value.find((l) => l.id === id)
  if (line && line.kind !== 'sample') line.qty++
}

function decrement(id: string) {
  const line = lines.value.find((l) => l.id === id)
  if (!line || line.kind === 'sample') return
  if (line.qty > 1) {
    line.qty--
    trimSamples()
  } else remove(id)
}

/** Після оформлення замовлення */
function clear() {
  lines.value = []
  promoCode.value = null
}

function remove(id: string) {
  lines.value = lines.value.filter((l) => l.id !== id)
  trimSamples()
}

/** Якщо сума впала нижче порогу — прибираємо зайві семпли */
function trimSamples() {
  const extra = sampleLines.value.length - samplesAllowed.value
  if (extra <= 0) return
  const drop = new Set(sampleLines.value.slice(-extra).map((l) => l.id))
  lines.value = lines.value.filter((l) => !drop.has(l.id))
}

function hasSample(id: string) {
  return lines.value.some((l) => l.id === id)
}

/** Toggle a gift sample; returns false when it can't be added (limit reached / locked) */
function toggleSample(sample: Sample) {
  if (hasSample(sample.id)) {
    lines.value = lines.value.filter((l) => l.id !== sample.id)
    return true
  }
  if (sampleLines.value.length >= samplesAllowed.value) return false
  lines.value.push(sampleToLine(sample))
  return true
}

export function useCart() {
  return {
    lines,
    count,
    goodsCount,
    subtotal,
    giftCount,
    giftsTotal,
    samplesTotal,
    delivery,
    freeDelivery,
    total,
    promo,
    promoBase,
    promoDiscount,
    applyPromo,
    removePromo: () => (promoCode.value = null),
    sampleLines,
    samplesAllowed,
    drawerOpen,
    baseFrozen,
    baseScrollY,
    baseTop,
    drawerExit,
    add,
    increment,
    decrement,
    remove,
    clear,
    hasSample,
    toggleSample,
    openDrawer: () => (drawerOpen.value = true),
    closeDrawer: () => (drawerOpen.value = false),
  }
}
