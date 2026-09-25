// Прототипні дані кошика — з макету Figma "iPhone 17 - 9" (node 112:1857)
import exoImage from '@/assets/images/product-viewed.png'
import spwImage from '@/assets/images/cart-skin-spw.png'
import setItem2 from '@/assets/images/cart-set-item-2.png'
import setItem3 from '@/assets/images/cart-set-item-3.png'

export type SetItem = { title: string; image: string }

export type CartLine = {
  id: string
  kind: 'product' | 'set' | 'sample'
  title: string
  description?: string
  image: string
  price: number
  oldPrice?: number
  qty: number
  gift?: { title: string; price: number; image?: string }
  /** Для оплати частинами: апарати — до 6 платежів, косметика — до 3 */
  category?: 'device' | 'cosmetics'
  /** Коротка назва для графіку платежів, напр. «LED-маска» */
  shortName?: string
  setItems?: SetItem[]
  /** UI: set contents expanded */
  expanded?: boolean
}

export type Sample = { id: string; title: string; description: string; image: string; price: number }

const setItems: SetItem[] = Array.from({ length: 8 }, (_, i) => ({
  title: 'Calmwise Soothing Cleanser Amazing Formular',
  image: [exoImage, setItem2, setItem3][i % 3],
}))

export const EXO_PDRN_ID = 'exo-pdrn'

export const exoPdrn: Omit<CartLine, 'qty'> = {
  id: EXO_PDRN_ID,
  kind: 'product',
  title: 'Exo-PDRN Prismatic+ Super Mega Pro Max Deluxe with amazing formula',
  description: 'Тут опис товару або якийсь інший текст, максимум на два рядки поки не почне скорочуватись',
  image: exoImage,
  price: 4100,
  oldPrice: 5950,
  gift: { title: 'Брендовий масажер для ліфтингу Medik8 у подарунок', price: 1, image: setItem2 },
}

export const samples: Sample[] = [
  {
    id: 'sample-autumn',
    title: 'Набір семплів “Осінній догляд”',
    description: 'SAMPLE Deluxe Daily Radiance Vitamin C, Зразок денного крему з вітаміном С та СПФ-30, 5 мл',
    image: exoImage,
    price: 1,
  },
  { id: 'sample-bestsellers', title: 'Набір семплів “Засоби-бестселери”', description: 'Мініатюри найпопулярніших засобів', image: exoImage, price: 1 },
  { id: 'sample-secret', title: 'Набір семплів “Сікрет”', description: 'Добірка-сюрприз від Skin(tet)', image: exoImage, price: 1 },
  { id: 'sample-anti-age', title: 'Набір семплів “Антивіковий догляд”', description: 'Мініатюри сироваток і кремів з пептидами', image: exoImage, price: 1 },
]

export const sampleToLine = (s: Sample): CartLine => ({
  id: s.id,
  kind: 'sample',
  title: s.title,
  description: s.description,
  image: s.image,
  price: s.price,
  qty: 1,
})

/** Вміст кошика як на макеті — підставляється при першому додаванні товару */
export const demoLines = (): CartLine[] => [
  { ...exoPdrn, qty: 1 },
  { id: 'skin-spw', kind: 'set', title: 'Skin(SPW+)', image: spwImage, price: 22653, oldPrice: 26650, qty: 2, setItems, expanded: false },
  { id: 'skin-spw-mini', kind: 'set', title: 'Skin(SPW+)', image: spwImage, price: 22653, oldPrice: 26650, qty: 1, setItems, expanded: true },
  sampleToLine(samples[0]),
]

/* ---------- Пороги шкали ---------- */

export const DELIVERY_PRICE = 79

export const milestones = [
  { amount: 3000, label: 'Доставка', icon: 'FastShipping', samples: 0 },
  { amount: 5000, label: '1 семпл', icon: 'GiftSmall', samples: 1 },
  { amount: 8000, label: '2 семпли', icon: 'GiftSmall', samples: 2 },
  { amount: 10000, label: '3 семпли', icon: 'GiftSmall', samples: 3 },
] as const

/* ---------- Форматування ---------- */

const uah = new Intl.NumberFormat('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const uahShort = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 })

export const formatPrice = (n: number) => `${uah.format(n)} ₴`
export const formatAmount = (n: number) => `${uahShort.format(n)} ₴`
/** «990,00/міс» — installment payment per month */
export const formatMonthly = (n: number) => `${uah.format(n)}/міс`

/** 1 позиція · 2 позиції · 5 позицій */
export function pluralPositions(n: number) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'позиція'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'позиції'
  return 'позицій'
}

/** 1 платіж · 3 платежі · 6 платежів */
export function pluralPayments(n: number) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'платіж'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'платежі'
  return 'платежів'
}

/** 1 місяць · 3 місяці · 6 місяців */
export function pluralMonths(n: number) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'місяць'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'місяці'
  return 'місяців'
}

/** 1 товар · 3 товари · 6 товарів */
export function pluralItems(n: number) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'товар'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'товари'
  return 'товарів'
}

export function pluralSamples(n: number) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'семпл'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'семпли'
  return 'семплів'
}

/** безкоштовний семпл · безкоштовні семпли · безкоштовних семплів */
export function pluralFreeSamples(n: number) {
  const mod10 = n % 10
  const mod100 = n % 100
  const adjective =
    mod10 === 1 && mod100 !== 11
      ? 'безкоштовний'
      : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
        ? 'безкоштовні'
        : 'безкоштовних'
  return `${adjective} ${pluralSamples(n)}`
}
