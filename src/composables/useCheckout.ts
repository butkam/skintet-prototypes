import { computed, reactive, ref } from 'vue'
import { useCart } from './useCart'
import { persist } from './persist'
import { formatPrice, pluralPositions, type CartLine } from '@/data/catalog'

/* ---------- Types ---------- */

export type DeliveryMethod = 'branch' | 'courier' | 'locker'
export type PaymentMethod = 'card' | 'installments' | 'cod'
export type Bank = 'monobank' | 'privatbank'
export type GroupKind = 'device' | 'cosmetics'

export type PlacedOrder = {
  number: string
  phone: string
  deliveryShort: string
  rows: { label: string; amount: number }[]
}

/* ---------- Shared state (one checkout per session) ---------- */

const contact = reactive({ phone: '', firstName: '', lastName: '', email: '', subscribe: false })

/** What the customer used last time — prefilled as in the design */
export const LAST_DELIVERY: Readonly<Record<'city' | 'branch' | 'address' | 'locker', string>> = {
  city: 'Дніпро',
  branch: '№ 12 · вул. Хрещатик, 22',
  address: 'вул. Донецьке шосе, 7',
  locker: '№ 34512 · просп. Дмитра Яворницького, 52',
}

const delivery = reactive({
  ...LAST_DELIVERY,
  method: 'branch' as DeliveryMethod,
})

// Nothing preselected — the customer picks a method themselves
const payment = reactive({ method: null as PaymentMethod | null })

/** Chosen payments count and bank per installment group */
const plans = reactive<Record<GroupKind, { payments: number; bank: Bank }>>({
  device: { payments: 3, bank: 'monobank' },
  cosmetics: { payments: 2, bank: 'privatbank' },
})

const deliveryConfirmed = ref(false)
const placedOrder = ref<PlacedOrder | null>(null)

// Survives reloads, so Back always lands on a filled-in step
persist(
  'checkout',
  () => ({ v: 2, contact, delivery, payment, plans, deliveryConfirmed: deliveryConfirmed.value, placedOrder: placedOrder.value }),
  (saved) => {
    Object.assign(contact, saved.contact)
    Object.assign(delivery, saved.delivery)
    // v1 sessions carry the old preselected «Після доставки» — don't bring it back
    if (saved.v === 2) Object.assign(payment, saved.payment)
    Object.assign(plans, saved.plans)
    deliveryConfirmed.value = saved.deliveryConfirmed
    placedOrder.value = saved.placedOrder
  },
)

/* ---------- Installment rules ---------- */

export const PAYMENT_OPTIONS: Record<GroupKind, number[]> = {
  device: [3, 4, 5, 6],
  cosmetics: [2, 3],
}

export const BANKS: { id: Bank; name: string }[] = [
  { id: 'monobank', name: 'Monobank' },
  { id: 'privatbank', name: 'ПриватБанк' },
]

/* ---------- Helpers ---------- */

export const phoneDigits = (value: string) => value.replace(/\D/g, '')

/**
 * «+38 (067) 584-52-64» while typing. Accepts whatever AutoFill/paste brings —
 * «+380 (93) 559 08 42», «00380…», «093…», «93…» — and always keeps the leading 0 of the operator code.
 */
export function formatPhoneInput(value: string) {
  let d = phoneDigits(value)
  if (d.startsWith('00')) d = d.slice(2)
  if (d.startsWith('38')) d = d.slice(2)
  if (d && !d.startsWith('0')) d = '0' + d
  d = d.slice(0, 10)
  if (!d) return ''
  let out = '+38 (' + d.slice(0, 3)
  // «)» only once the 4th digit arrives, so Backspace can remove it
  if (d.length > 3) out += ')'
  if (d.length > 3) out += ' ' + d.slice(3, 6)
  if (d.length > 6) out += '-' + d.slice(6, 8)
  if (d.length > 8) out += '-' + d.slice(8, 10)
  return out
}

/** «+380 67 584 52 64» for summaries */
export function formatPhoneDisplay(value: string) {
  const d = phoneDigits(value).replace(/^38/, '')
  if (d.length !== 10) return value
  return `+38${d[0]} ${d.slice(1, 3)} ${d.slice(3, 6)} ${d.slice(6, 8)} ${d.slice(8, 10)}`
}

const monthDay = new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long' })
const monthName = new Intl.DateTimeFormat('uk-UA', { month: 'long' })
const addMonths = (k: number) => {
  const d = new Date()
  d.setMonth(d.getMonth() + k)
  return d
}

/* ---------- Composable ---------- */

export function useCheckout() {
  const cart = useCart()

  const branchNumber = computed(() => delivery.branch.match(/№\s*(\d+)/)?.[1] ?? '')
  const lockerNumber = computed(() => delivery.locker.match(/(\d+)/)?.[1] ?? delivery.locker)

  const deliveryPriceLabel = computed(() =>
    cart.freeDelivery.value ? 'Безкоштовно' : formatPrice(cart.delivery.value),
  )

  const deliveryTitle = computed(() => {
    const city = delivery.city.trim()
    switch (delivery.method) {
      case 'branch':
        return `Відділення НП №${branchNumber.value}, ${city}`
      case 'locker':
        return `Поштомат НП №${lockerNumber.value}, ${city}`
      default:
        return `Адресна доставка, ${city}`
    }
  })

  const deliveryShort = computed(() => {
    const city = delivery.city.trim()
    switch (delivery.method) {
      case 'branch':
        return `НП №${branchNumber.value}, ${city}`
      case 'locker':
        return `поштомат НП №${lockerNumber.value}, ${city}`
      default:
        return `кур’єром, ${city}`
    }
  })

  const recipientLine = computed(() =>
    [`${contact.firstName} ${contact.lastName}`.trim(), formatPhoneDisplay(contact.phone), deliveryPriceLabel.value]
      .filter(Boolean)
      .join(', '),
  )

  const positions = computed(() => `${cart.count.value} ${pluralPositions(cart.count.value)}`)

  /* ----- Installments: split the cart by product type ----- */

  const groups = computed(() => {
    const goods = cart.lines.value.filter((l) => l.kind !== 'sample')
    const devices = goods.filter((l) => l.category === 'device')
    const cosmetics = goods.filter((l) => l.category !== 'device')
    const sum = (ls: CartLine[]) => ls.reduce((s, l) => s + l.price * l.qty + (l.gift?.price ?? 0), 0)
    // Samples and delivery ride along with cosmetics (or devices if there are none)
    const extras = cart.samplesTotal.value + cart.delivery.value

    const list: { kind: GroupKind; title: string; amount: number }[] = []
    if (devices.length) {
      const title =
        devices.length === 1 && devices[0].qty === 1
          ? (devices[0].shortName ?? devices[0].title)
          : `Апарати (${devices.reduce((n, l) => n + l.qty, 0)} ${pluralPositions(devices.length)})`
      list.push({ kind: 'device', title, amount: sum(devices) + (cosmetics.length ? 0 : extras) })
    }
    if (cosmetics.length) {
      const n = cosmetics.reduce((c, l) => c + l.qty, 0)
      list.push({ kind: 'cosmetics', title: `Косметика (${n} ${pluralPositions(n)})`, amount: sum(cosmetics) + extras })
    }

    return list.map((g, i) => {
      const n = plans[g.kind].payments
      const regular = Math.floor((g.amount / n) * 100) / 100
      const first = Math.round((g.amount - regular * (n - 1)) * 100) / 100
      return {
        ...g,
        index: i + 1,
        payments: n,
        regular,
        first,
        paymentAt: (k: number) => (k === 0 ? first : k < n ? regular : 0),
      }
    })
  })

  const isSplit = computed(() => groups.value.length > 1)

  /** Figma 112:1680–1689: per-month totals; the tail where amounts repeat collapses into a range */
  const schedule = computed(() => {
    const months = Math.max(0, ...groups.value.map((g) => g.payments))
    const amounts = Array.from({ length: months }, (_, k) =>
      Math.round(groups.value.reduce((s, g) => s + g.paymentAt(k), 0) * 100) / 100,
    )
    const payers = (k: number) => groups.value.filter((g) => k < g.payments).map((g) => g.kind).join()

    // Collapse the final run (≥ 2 months) paid by the same groups with the same amount
    let start = months - 1
    while (start > 1 && amounts[start - 1] === amounts[months - 1] && payers(start - 1) === payers(months - 1)) start--
    const collapse = months - start >= 2 && start > 0

    const rows: { label: string; value: string }[] = []
    const last = collapse ? start : months
    for (let k = 0; k < last; k++) {
      rows.push({ label: k === 0 ? 'Сьогодні' : monthDay.format(addMonths(k)), value: formatPrice(amounts[k]) })
    }
    if (collapse) {
      rows.push({
        label: `${monthName.format(addMonths(start))} – ${monthName.format(addMonths(months - 1))}`,
        value: `по ${formatPrice(amounts[months - 1])}`,
      })
    }
    return { rows, today: amounts[0] ?? 0 }
  })

  function placeOrder() {
    const rows =
      payment.method === 'installments'
        ? groups.value.map((g) => ({
            label: isSplit.value ? `Оплата ${g.index}, ${g.title}` : `Перший платіж, ${g.title}`,
            amount: g.first,
          }))
        : [
            {
              label: payment.method === 'card' ? 'Оплачено карткою' : 'Оплата при отриманні',
              amount: cart.total.value,
            },
          ]

    placedOrder.value = {
      number: String(Math.floor(10000 + Math.random() * 90000)),
      phone: formatPhoneDisplay(contact.phone),
      deliveryShort: deliveryShort.value,
      rows,
    }
    cart.clear()
    deliveryConfirmed.value = false
    payment.method = null
  }

  function resetAfterOrder() {
    placedOrder.value = null
  }

  return {
    contact,
    delivery,
    payment,
    plans,
    deliveryConfirmed,
    placedOrder,
    deliveryPriceLabel,
    deliveryTitle,
    recipientLine,
    positions,
    groups,
    isSplit,
    schedule,
    placeOrder,
    resetAfterOrder,
  }
}
