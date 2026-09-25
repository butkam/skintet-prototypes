<script setup lang="ts">
// Figma «Замовлення прийнято» (node 125:5422); split installments paid one by one:
// awaiting (186:8838 → 186:8910) and a failed payment (125:5786)
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import SkIcon, { type IconName } from '@/components/SkIcon.vue'
import SkButton from '@/components/SkButton.vue'
import CheckoutTopBar from '@/components/checkout/CheckoutTopBar.vue'
import { useCheckout, type PaymentStatus } from '@/composables/useCheckout'
import { formatPrice } from '@/data/catalog'
import { prefersReducedMotion, spring } from '@/motion/spring'
import { useWideCart } from '@/composables/useWideCart'

const router = useRouter()
const { placedOrder, payNext, resetAfterOrder } = useCheckout()
const order = placedOrder.value!
// Desktop: the result sits in the middle of the page, under the steps bar
const wide = useWideCart()

const STATUS_ICON: Record<PaymentStatus, { name: IconName; size: number; color: string }> = {
  paid: { name: 'Check', size: 18, color: 'var(--status-success-fg)' },
  pending: { name: 'Hourglass', size: 18, color: 'var(--status-warning-fg)' },
  failed: { name: 'CrossSmall', size: 16, color: 'var(--status-danger-fg)' },
}
const ORDINALS = ['першу', 'другу', 'третю']

const unpaid = computed(() => order.rows.find((r) => r.status !== 'paid'))
const failed = computed(() => unpaid.value?.status === 'failed')
const paidCount = computed(() => order.rows.filter((r) => r.status === 'paid').length)
// A single paid row is a card / COD / one-group installments order: the old «paid» view
const split = computed(() => order.rows.length > 1)

const title = computed(() => {
  if (!failed.value) return `Замовлення ${order.number} прийнято`
  return paidCount.value ? (paidCount.value === 1 ? 'Одну оплату завершено' : 'Частину оплат завершено') : 'Оплату не завершено'
})

const failedNote = computed(() => {
  const i = order.rows.findIndex((r) => r.status === 'failed')
  const which = split.value ? `${ORDINALS[i] ?? ''} ` : ''
  return `Замовлення не скасоване. Завершіть ${which}оплату — доставка залишиться одна.`
})

const paying = ref(false)
async function pay() {
  if (paying.value) return
  paying.value = true
  await payNext()
  paying.value = false
}

const payLabel = computed(() =>
  paying.value ? 'Очікуємо відповідь банку…' : failed.value ? 'Завершити оплату' : 'Оплатити',
)
/** Поки чекаємо банк — самий лише текст, без суми й роздільника */
const payAmount = computed(() => (paying.value ? '' : formatPrice(unpaid.value?.amount ?? 0)))

const icon = ref<HTMLElement | null>(null)
onMounted(() => {
  if (prefersReducedMotion() || !icon.value) return
  const s = spring({ stiffness: 260, damping: 14, mass: 1 })
  icon.value.animate([{ transform: 'scale(0.4) rotate(-12deg)', opacity: 0 }, { transform: 'scale(1) rotate(0)', opacity: 1 }], {
    duration: s.duration,
    easing: s.easing,
  })
})

function toCatalog() {
  resetAfterOrder()
  router.push({ name: 'base' })
}
</script>

<template>
  <div class="page" :class="{ 'page--wide': wide }">
    <CheckoutTopBar :step="2" />

    <main class="done">
      <span ref="icon" class="done__icon"><SkIcon name="ShoppingBagLarge" :size="48" /></span>
      <h1 class="done__title heading-s">{{ title }}</h1>
      <p class="done__text body-s">Статус надішлемо в SMS на {{ order.phone }}. Відправимо завтра, {{ order.deliveryShort }}.</p>

      <ul class="done__rows">
        <li v-for="row in order.rows" :key="row.label" class="done__row">
          <span class="done__status">
            <Transition name="status" mode="out-in">
              <SkIcon :key="row.status" v-bind="STATUS_ICON[row.status]" />
            </Transition>
          </span>
          <span class="done__label body-m">{{ row.label }}</span>
          <span class="heading-s">{{ formatPrice(row.amount) }}</span>
        </li>
      </ul>

      <p v-if="failed" class="done__note body-m" role="alert">{{ failedNote }}</p>

      <div class="done__actions">
        <template v-if="unpaid">
          <SkButton block :disabled="paying" @click="pay">
            {{ payLabel }}
            <template v-if="payAmount" #amount>{{ payAmount }}</template>
          </SkButton>
          <SkButton v-if="failed" variant="secondary" block>Написати менеджеру</SkButton>
        </template>
        <template v-else>
          <SkButton block @click="router.push({ name: 'checkout-profile' })">Створити профіль</SkButton>
          <SkButton variant="secondary" block @click="toCatalog">Перейти до каталогу</SkButton>
        </template>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* ---------- Desktop: result centred under the steps bar ---------- */

/* Fills the screen under the steps bar (CheckoutLayout: its height + the 16px under its line) */
.page--wide {
  display: flex;
  flex-direction: column;
  min-height: calc(100svh - var(--checkout-header-h) - var(--checkout-steps-h, 0px) - var(--space-4));
}

/* In the middle of that space; a bit higher than the exact middle — the eye takes that for centred */
.page--wide .done {
  flex: 1;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  margin-inline: auto;
  padding: var(--space-10) 0 calc(var(--space-10) + 8vh);
}

.done {
  grid-column: 1 / -1;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  margin-inline: auto;
  padding: var(--space-10) 0 calc(var(--space-10) + 8vh);
}

.done {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px var(--space-4) calc(env(safe-area-inset-bottom) + var(--space-8));
  text-align: center;
}

.done__title {
  margin-top: var(--space-4);
  color: var(--action-secondary-fg);
}

.done__text {
  max-width: 283px;
  margin-top: var(--space-2);
  color: var(--fg-muted);
}

.done__rows {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;
  margin: var(--space-6) 0 0;
  padding: 15px 19px;
  border: var(--border-width-hairline) solid var(--border-default);
  border-radius: var(--radius-lg);
  list-style: none;
  text-align: left;
}

.done__row {
  /* Wrapped labels: price sits on the first line's baseline, the icon is centred on that line */
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  color: var(--action-secondary-fg);
}

/* Fixed slot, so labels stay aligned whichever status icon (16 or 18px) is shown.
   One text line tall, pinned to the top */
.done__status {
  display: grid;
  place-items: center;
  align-self: flex-start;
  width: 18px;
  height: var(--font-line-height-sm);
  flex-shrink: 0;
}

.done__label {
  flex: 1;
  min-width: 0;
}

.done__row .heading-s {
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

/* Figma 125:5853: left-aligned, 20px in from the card edges */
.done__note {
  align-self: stretch;
  margin-top: var(--space-2);
  padding-inline: var(--space-5);
  text-align: left;
  color: var(--fg-default);
}

.done__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
  margin-top: 36px;
}

/* Status change: the old icon fades out, the new one pops in */
.status-enter-active {
  transition: opacity 0.2s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.status-leave-active {
  transition: opacity 0.12s ease;
}
.status-enter-from {
  opacity: 0;
  transform: scale(0.5);
}
.status-leave-to {
  opacity: 0;
}
</style>
