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
 *                     /skin-id/2026-11-15.html — правки від 14.11 (docs/skin-id-feedback-2026-11-14.md);
 *                     ?nav=anchors — варіант Б: ранок і вечір на одній сторінці, чипи як якорі
 *                     /skin-id/2026-11-17.html — ще одна версія рутини (Figma «Checkout», Desktop 701:9334);
 *                     -empty / -ours / -own — пустий стан, тільки наші засоби, тільки засоби з полички
 *
 * Прототип обирається один раз — за адресою, з якою відкрили сторінку. Роутер працює під його
 * префіксом (router → history), а кошик і оформлення зберігаються в сесії окремо (persist),
 * тож усі переходи й дані лишаються в межах одного прототипу.
 */

import skinIdPages from '../public/skin-id/prototypes.json'

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
 *  Список Skin(ID) — public/skin-id/prototypes.json: з нього ж меню під логотипом на самих сторінках
 *  (public/skin-id/assets/prototype/proto-switch.js). href — від public/skin-id/; branch — стан тієї самої
 *  сторінки, у меню з кутиком під нею; hidden — старі прототипи, у меню не показуємо (сторінки лишаються за адресою) */
const STATIC_PAGES = skinIdPages.filter((p) => !('hidden' in p && p.hidden)).map((p) => ({
  path: `skin-id/${p.href === './' ? '' : p.href}`,
  title: p.title,
  branch: p.branch,
}))

/** Для меню в хедері. Звичайні посилання, не роутер: прототип обирається під час завантаження сторінки */
export const prototypes = [
  ...PROTOTYPES.map((p) => ({ title: p.title, href: baseOf(p), current: p === current, branch: !!p.branch })),
  ...STATIC_PAGES.map((p) => ({ title: p.title, href: `${import.meta.env.BASE_URL}${p.path}`, current: false, branch: p.branch })),
]
