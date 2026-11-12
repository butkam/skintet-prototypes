/**
 * Кілька прототипів подарунків в одному застосунку, кожен за своєю адресою:
 *   /               — набори семплів на вибір у шторці під шкалою (Figma 160:7315)
 *   /gift-products/ — те саме, але на вибір звичайні товари (GiftProductCard)
 *   /2026-10-06/    — гілка «Товари на вибір» від 6 жовтня: поки така сама, далі змінюється окремо
 *   /gift-card/     — подарунок до замовлення карткою над товарами, без шторки (Figma 234:3047)
 *   /skin-id/       — статична копія сторінки результату Skin(ID) з skintet.com з новим меню каталогу
 *                     (public/skin-id, не Vue; меню — public/skin-id/menu). /catalog-menu/ лише перекидає сюди;
 *                     /skin-id/empty.html — пустий стан: аналіз полички ще не готовий
 *                     /skin-id/classic.html — копія зі старою карткою «Повна рутина» (до аналізу полички)
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

/** Статичні копії сторінок skintet.com у public/<slug>/ — не Vue, тож лише пункт у меню (див. vite.config → staticPages).
 *  path — під BASE_URL; branch — стан тієї самої сторінки, у меню з кутиком під нею */
const STATIC_PAGES = [
  { path: 'skin-id/', title: 'Skin(ID)', branch: false },
  // аналіз полички ще не готовий після 10 хв: звичайна схема і пропозиція надіслати розбір на пошту
  { path: 'skin-id/empty.html', title: 'Пустий стан', branch: true },
  { path: 'skin-id/classic.html', title: 'Класична картка', branch: true },
]

/** Для меню в хедері. Звичайні посилання, не роутер: прототип обирається під час завантаження сторінки */
export const prototypes = [
  ...PROTOTYPES.map((p) => ({ title: p.title, href: baseOf(p), current: p === current, branch: !!p.branch })),
  ...STATIC_PAGES.map((p) => ({ title: p.title, href: `${import.meta.env.BASE_URL}${p.path}`, current: false, branch: p.branch })),
]
