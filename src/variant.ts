/**
 * Кілька прототипів подарунків в одному застосунку, кожен за своєю адресою:
 *   /               — набори семплів на вибір у шторці під шкалою (Figma 160:7315)
 *   /gift-products/ — те саме, але на вибір звичайні товари (GiftProductCard)
 *   /2026-10-06/    — гілка «Товари на вибір» від 6 жовтня: поки така сама, далі змінюється окремо
 *   /gift-card/     — подарунок до замовлення карткою над товарами, без шторки (Figma 234:3047)
 *
 * Прототип обирається один раз — за адресою, з якою відкрили сторінку. Роутер працює під його
 * префіксом (router → history), а кошик і оформлення зберігаються в сесії окремо (persist),
 * тож усі переходи й дані лишаються в межах одного прототипу.
 */

/** Що пропонуємо на вибір у шторці: звичайні товари чи набори семплів */
export type GiftStyle = 'products' | 'samples'

type Prototype = {
  /** Адреса під BASE_URL; null — корінь */
  slug: string | null
  title: string
  giftStyle: GiftStyle
  /** Подарунок до замовлення карткою замість вибору в шторці */
  giftCard?: boolean
  /** Відгалуження від прототипу вище: у меню з кутиком перед назвою */
  branch?: boolean
}

const PROTOTYPES: Prototype[] = [
  { slug: null, title: 'Семпли на вибір', giftStyle: 'samples' },
  { slug: 'gift-products', title: 'Товари на вибір', giftStyle: 'products' },
  { slug: '2026-10-06', title: '6 жовтня', giftStyle: 'products', branch: true },
  { slug: 'gift-card', title: 'Подарунок карткою', giftStyle: 'samples', giftCard: true },
]

const path = window.location.pathname.slice(import.meta.env.BASE_URL.length)
const current =
  PROTOTYPES.find((p) => p.slug && (path === p.slug || path.startsWith(`${p.slug}/`))) ?? PROTOTYPES[0]

/** Адреса поточного прототипу — щоб змінювати лише один: `prototypeSlug === '2026-10-06'` */
export const prototypeSlug = current.slug

/** Подарунок до замовлення: від 3 000 ₴ разом з доставкою, від 5 000 ₴ його змінює інший */
export const giftCardModel = !!current.giftCard

export const giftStyle: GiftStyle = current.giftStyle

const baseOf = (p: Prototype) => (p.slug ? `${import.meta.env.BASE_URL}${p.slug}/` : import.meta.env.BASE_URL)

/** Корінь поточного прототипу: «/» або «/<slug>/» (на GitHub Pages — під «/<repo>/») */
export const prototypeBase = baseOf(current)

/** Ключ прототипу для сховища (persist): у кожного свій кошик і оформлення */
export const prototypeKey = current.slug ?? 'samples'

/** Для меню в хедері. Звичайні посилання, не роутер: прототип обирається під час завантаження сторінки */
export const prototypes = PROTOTYPES.map((p) => ({ title: p.title, href: baseOf(p), current: p === current, branch: !!p.branch }))
