import { createRouter, createWebHistory, type RouteLocationRaw } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { useCheckout } from '@/composables/useCheckout'

// Кожен прототип — окремий маршрут. Додавай нові екрани сюди.
export const router = createRouter({
  // BASE_URL: «/» locally, «/<repo>/» on GitHub Pages
  history: createWebHistory(import.meta.env.BASE_URL),
  // Opening/closing the cart only toggles ?cart on the same screen — the drawer manages scroll itself
  scrollBehavior: (to, from, saved) => (to.path === from.path ? false : (saved ?? { top: 0 })),
  routes: [
    {
      path: '/',
      name: 'base',
      // Desktop: the screen spans the whole window instead of the phone column (see App.vue)
      meta: { fullWidth: true },
      component: () => import('@/views/BaseScreen.vue'),
    },
    {
      // Figma: «Дані й доставка» 112:1507 → «Оплата» 112:1567 / 112:1613 → «Створення профілю» 125:5422
      path: '/checkout',
      // Desktop: full window; each step centres its own column (CheckoutLayout → --checkout-column)
      meta: { fullWidth: true },
      component: () => import('@/views/checkout/CheckoutLayout.vue'),
      children: [
        // meta.step drives the push/pop slide direction in CheckoutLayout;
        // meta.progress — the step lit in the steps bar (desktop: one bar in CheckoutLayout for all screens)
        { path: '', name: 'checkout-delivery', meta: { step: 1, progress: 1 }, component: () => import('@/views/checkout/CheckoutDelivery.vue') },
        { path: 'payment', name: 'checkout-payment', meta: { step: 2, progress: 2 }, component: () => import('@/views/checkout/CheckoutPayment.vue') },
        { path: 'done', name: 'checkout-done', meta: { step: 3, progress: 2 }, component: () => import('@/views/checkout/CheckoutDone.vue') },
        // Figma «Підтвердіть номер телефону» 125:5862 — after every payment went through
        // meta.step only orders screens for the slide direction — sub-steps of «Створення профілю» go in between
        { path: 'profile', name: 'checkout-profile', meta: { step: 3.1, progress: 3 }, component: () => import('@/views/checkout/CheckoutProfile.vue') },
        // Figma «Введіть код з SMS» 125:5940
        { path: 'profile/code', name: 'checkout-profile-code', meta: { step: 3.2, progress: 3 }, component: () => import('@/views/checkout/CheckoutProfileCode.vue') },
      ],
    },
  ],
})

// Прототип без бекенду: не пускаємо на кроки, для яких ще немає даних
router.beforeEach((to) => {
  const { lines } = useCart()
  const { deliveryConfirmed, placedOrder } = useCheckout()
  if (to.name === 'checkout-done') return placedOrder.value ? true : { name: 'base' }
  if (to.name === 'checkout-profile-code' && !useCheckout().profile.phone) return { name: 'checkout-profile' }
  if (to.name === 'checkout-profile' || to.name === 'checkout-profile-code') {
    if (!placedOrder.value) return { name: 'base' }
    return placedOrder.value.rows.every((r) => r.status === 'paid') ? true : { name: 'checkout-done' }
  }
  if (to.path.startsWith('/checkout') && !lines.value.length) return { name: 'base' }
  if (to.name === 'checkout-payment' && !deliveryConfirmed.value) return { name: 'checkout-delivery' }
  return true
})

/** True while an in-app control (not the browser) is stepping back through history */
let inAppBack = false
export function takeInAppBack() {
  const value = inAppBack
  inAppBack = false
  return value
}

/**
 * «Змінити», previous-step links, closing the cart: if the target is the entry right behind us,
 * step back in history instead of stacking a duplicate — so the browser Back stays a clean path.
 */
export function backTo(to: RouteLocationRaw, { replace = false } = {}) {
  const target = router.resolve(to).fullPath
  if (window.history.state?.back === target) {
    inAppBack = true
    router.back()
  } else if (replace) router.replace(to)
  else router.push(to)
}
