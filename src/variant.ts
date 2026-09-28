/**
 * Два прототипи подарунків в одному застосунку, кожен за своєю адресою:
 *   /           — семпли на вибір у шторці під шкалою (Figma 160:7315)
 *   /gift-card/ — подарунок до замовлення карткою над товарами, без шторки (Figma 234:3047)
 *
 * Прототип обирається один раз — за адресою, з якою відкрили сторінку. Роутер працює під його
 * префіксом (router → history), а кошик і оформлення зберігаються в сесії окремо (persist),
 * тож усі переходи й дані лишаються в межах одного прототипу.
 */
const GIFT_CARD_SLUG = 'gift-card'

const path = window.location.pathname.slice(import.meta.env.BASE_URL.length)

/** Подарунок до замовлення: від 3 000 ₴ разом з доставкою, від 5 000 ₴ його змінює інший */
export const giftCardModel = path === GIFT_CARD_SLUG || path.startsWith(`${GIFT_CARD_SLUG}/`)

/** Корінь поточного прототипу: «/» або «/gift-card/» (на GitHub Pages — під «/<repo>/») */
export const prototypeBase = giftCardModel
  ? `${import.meta.env.BASE_URL}${GIFT_CARD_SLUG}/`
  : import.meta.env.BASE_URL

/** Для меню в хедері. Звичайні посилання, не роутер: прототип обирається під час завантаження сторінки */
export const prototypes = [
  { title: 'Семпли на вибір', href: import.meta.env.BASE_URL, current: !giftCardModel },
  { title: 'Подарунок карткою', href: `${import.meta.env.BASE_URL}${GIFT_CARD_SLUG}/`, current: giftCardModel },
]
