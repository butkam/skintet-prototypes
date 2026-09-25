<script setup lang="ts">
// Figma «Оплата» (node 112:1567) і «Декілька платежів» (node 112:1613)
import { computed, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import SkOptionCard from '@/components/SkOptionCard.vue'
import SkButton from '@/components/SkButton.vue'
import SkSelect from '@/components/SkSelect.vue'
import BankSelect from '@/components/BankSelect.vue'
import CartPromo from '@/components/CartPromo.vue'
import CheckoutTopBar from '@/components/checkout/CheckoutTopBar.vue'
import CheckoutSummaryRow from '@/components/checkout/CheckoutSummaryRow.vue'
import CheckoutAside from '@/components/checkout/CheckoutAside.vue'
import { useCart } from '@/composables/useCart'
import { useWideCart } from '@/composables/useWideCart'
import { PAYMENT_OPTIONS, formatPhoneDisplay, useCheckout } from '@/composables/useCheckout'
import { formatAmount, formatMonthly, formatPrice, pluralMonths, pluralPayments } from '@/data/catalog'
import PaymentLogos from '@/components/checkout/PaymentLogos.vue'
import WalletButton from '@/components/checkout/WalletButton.vue'
import { detectWallet, loadGooglePay, type Wallet } from '@/composables/wallet'
import { backTo } from '@/router'

const router = useRouter()
const cart = useCart()
const { contact, payment, plans, deliveryTitle, recipientLine, groups, isSplit, schedule, placeOrder, settleOrder } = useCheckout()
// Desktop: the payment form on the left; delivery, the order and the pay button in a column on the right
const wide = useWideCart()

// Desktop: the select has room for «4 місяці»; the phone keeps the bare number
const monthsLabel = (n: number) => `${n} ${pluralMonths(n)}`

// The column's totals already show the delivery price — here only who receives it
const recipient = computed(() =>
  [`${contact.firstName} ${contact.lastName}`.trim(), formatPhoneDisplay(contact.phone)].filter(Boolean).join(', '),
)

const installments = computed(() => payment.method === 'installments')

const installmentsHint = computed(() =>
  isSplit.value ? 'У вашому кошику діють різні умови' : groups.value[0]?.kind === 'device' ? 'До 6 платежів без переплат' : 'До 3 платежів без переплат',
)

// Імітація сервера: графік на проді рахує бекенд (банк, ставки, промокод), тож після кожної зміни
// умов чекаємо на відповідь. Скелетон — лише в графіку, спінер — лише в кнопці, решта екрана живе.
// Нова зміна до відповіді перезапускає очікування: показуємо тільки останній результат
const scheduleLoading = ref(false)
let scheduleTimer: ReturnType<typeof setTimeout> | undefined
watch(
  [installments, plans, () => cart.total.value],
  () => {
    clearTimeout(scheduleTimer)
    scheduleLoading.value = installments.value
    if (installments.value) scheduleTimer = setTimeout(() => (scheduleLoading.value = false), 600 + Math.random() * 400)
  },
  { deep: true, immediate: true },
)
onUnmounted(() => clearTimeout(scheduleTimer))

// «Після доставки» — без суми, щоб не здавалося, що гроші спишуть просто зараз
const cta = computed(() =>
  installments.value
    ? { action: 'Оформити', amount: `Зараз ${formatPrice(schedule.value.today)}` }
    : payment.method === 'cod'
      ? { action: 'Оформити замовлення', amount: '' }
      : { action: 'Оплатити', amount: formatPrice(cart.total.value) },
)

// «Онлайн карткою» → справжня кнопка Apple Pay / Google Pay замість «Оплатити».
// pay.js тягнемо одразу, щоб кнопка була готова, щойно обрали картку; не завантажився — лишається «Оплатити»
const wallet = ref<Wallet | null>(detectWallet())
if (wallet.value === 'google') loadGooglePay().catch(() => (wallet.value = null))
const walletPay = computed(() => (payment.method === 'card' ? wallet.value : null))

// Кнопка з'являється лише після вибору способу оплати, тож тут він уже є
function submit() {
  placeOrder()
  placed = true
  router.replace({ name: 'checkout-done' })
}

// Unmounted only after the slide-out transition — the screen keeps its content while it leaves
let placed = false
onUnmounted(() => placed && settleOrder())
</script>

<template>
  <div class="page" :class="{ 'page--split': wide }">
    <CheckoutTopBar :step="2">
      <template v-if="!wide" #default>
        <CheckoutSummaryRow icon="Shipping" :title="deliveryTitle" :caption="recipientLine">
          <template #aside>
            <RouterLink
              :to="{ name: 'checkout-delivery' }"
              class="body-m"
              @click.prevent="backTo({ name: 'checkout-delivery' })"
            >
              Змінити
            </RouterLink>
          </template>
        </CheckoutSummaryRow>
      </template>
    </CheckoutTopBar>

    <CheckoutAside v-if="wide" class="page__aside">
      <template #before>
        <section class="ship" aria-labelledby="ship-title">
          <div class="ship__head">
            <h2 id="ship-title" class="heading-s">Доставка</h2>
            <RouterLink
              :to="{ name: 'checkout-delivery' }"
              class="ship__change body-s"
              @click.prevent="backTo({ name: 'checkout-delivery' })"
            >
              Змінити
            </RouterLink>
          </div>
          <p class="body-m">{{ deliveryTitle }}</p>
          <p v-if="recipient" class="ship__recipient body-s">{{ recipient }}</p>
        </section>
      </template>
      <!-- The button and the note below are teleported here (one markup for both layouts) -->
      <template v-if="payment.method" #default>
        <div id="payment-action" />
      </template>
    </CheckoutAside>

    <main class="page__content">
      <section aria-labelledby="payment-title">
        <h2 id="payment-title" class="section__title heading-s">Спосіб оплати</h2>

        <div class="methods" role="radiogroup" aria-label="Спосіб оплати">
          <SkOptionCard label="Онлайн карткою" :selected="payment.method === 'card'" @select="payment.method = 'card'">
            <PaymentLogos />
          </SkOptionCard>

          <div class="installments" :class="{ 'is-open': installments }">
            <SkOptionCard
              label="Оплата частинами"
              :hint="installmentsHint"
              :selected="installments"
              @select="payment.method = 'installments'"
            />

            <Transition name="reveal">
              <div v-if="installments" class="installments__body">
                <!-- Figma 202:911 — сіра смуга на всю ширину відділяє розгорнуту опцію від сусідніх -->
                <div class="band">
                  <!-- Figma 112:1640 -->
                  <div v-if="isSplit" class="info">
                  <p class="body-m">Замовлення розділиться на дві оплати</p>
                    <p class="info__text body-s">
                      Кількість платежів залежить від типу товару: апарати&nbsp;— до 6, косметика&nbsp;— до 3. Це одне&nbsp;замовлення й одна&nbsp;доставка.
                    </p>
                  </div>

                  <!-- Figma 112:1643 / 112:1663 -->
                  <article v-for="g in groups" :key="g.kind" class="plan">
                    <header class="plan__head">
                      <p class="body-m">{{ isSplit ? `Оплата ${g.index} · ${g.title}` : g.title }}</p>
                      <p class="heading-s">{{ formatMonthly(g.regular) }}</p>
                    </header>
                    <!-- Same terms at both banks -->
                    <p class="plan__label body-s">до {{ Math.max(...PAYMENT_OPTIONS[g.kind]) }} міс під 0,01%</p>
                    <div class="plan__controls">
                      <BankSelect v-model="plans[g.kind].bank" />
                      <SkSelect
                        v-model="plans[g.kind].payments"
                        :options="PAYMENT_OPTIONS[g.kind]"
                        :format="wide ? monthsLabel : undefined"
                        label="Кількість платежів"
                      />
                    </div>
                    <p class="plan__label body-s">
                      {{ g.payments }} {{ pluralPayments(g.payments) }} по {{ formatAmount(Math.round(g.regular)) }} · перший сьогодні
                    </p>
                  </article>

                  <!-- Figma 112:1615, 112:1680–1690 -->
                  <section
                    class="schedule"
                    aria-labelledby="schedule-title"
                    :aria-busy="scheduleLoading || undefined"
                  >
                    <h3 id="schedule-title" class="schedule__title heading-s">Графік платежів</h3>
                    <!-- Поки чекаємо, текст стає прозорим і сам є смужкою скелетона: той самий шрифт,
                         та сама ширина — висота й ширина рядків не змінюються ні на піксель -->
                    <dl class="schedule__rows" :class="{ 'is-loading': scheduleLoading }">
                      <div v-for="row in schedule.rows" :key="row.label" class="schedule__row">
                        <dt class="body-s"><span class="bone">{{ row.label }}</span></dt>
                        <dd class="body-m"><span class="bone">{{ row.value }}</span></dd>
                      </div>
                      <div class="schedule__row schedule__row--total">
                        <dt class="body-s">Разом</dt>
                        <dd class="heading-s"><span class="bone">{{ formatPrice(cart.total.value) }}</span></dd>
                      </div>
                    </dl>
                  </section>
                </div>

                <!-- Поза смугою: у макеті примітка читається вже на чистому тлі -->
                <p v-if="isSplit" class="installments__note body-s">
                  У банківській виписці буде дві операції — це не подвійне списання. Доставка одна,
                  {{ cart.freeDelivery.value ? 'безкоштовна' : formatPrice(cart.delivery.value) }}.
                </p>
              </div>
            </Transition>
          </div>

          <SkOptionCard label="Після доставки" :selected="payment.method === 'cod'" @select="payment.method = 'cod'" />
        </div>
      </section>

      <!-- Same promo state as in the cart: a code applied there shows up here already applied -->
      <CartPromo class="promo" />

      <!-- Desktop: moves into the order column; `defer` — the target renders in this same pass -->
      <Teleport v-if="payment.method" to="#payment-action" :disabled="!wide" defer>
        <div class="page__cta">
          <template v-if="walletPay">
            <WalletButton :wallet="walletPay" @pay="submit" />
            <!-- Не в кожного картка в гаманці — звичайна оплата лишається поруч -->
            <SkButton variant="secondary" block @click="submit">
              Картою
              <template #amount>{{ cta.amount }}</template>
            </SkButton>
          </template>
          <SkButton v-else block :loading="scheduleLoading" @click="submit">
            {{ cta.action }}
            <template v-if="cta.amount" #amount>{{ cta.amount }}</template>
          </SkButton>
        </div>

        <p class="legal body-s">
          Підтверджуючи ви погоджуєтесь з умовами оферти, політики конфіденційності, заявою про обробку персональних даних та
          приймаєте їх.
        </p>
      </Teleport>
    </main>
  </div>
</template>

<style scoped>
.page__content {
  display: flex;
  flex-direction: column;
  padding: var(--space-4) var(--space-4) calc(env(safe-area-inset-bottom) + var(--space-5));
}

/* ---------- Desktop: form | delivery & order ---------- */

/* Same grid as «Дані й доставка»: the form and the column under the steps bar */
.page--split {
  --checkout-column: 1080px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 400px;
  column-gap: var(--space-16);
  align-items: start;
}

.page--split .page__content {
  padding-bottom: var(--space-16);
}

.page__aside {
  grid-column: 2;
  grid-row: 1;
  position: sticky;
  /* Level with the form's first line (the steps' margin + the form's top padding), and stays there */
  top: calc(var(--checkout-header-h) + var(--checkout-steps-h, 0px) + var(--space-8));
  margin: var(--space-4) var(--space-5) var(--space-4) 0;
}

/* The column already spaces its action */
.page__aside .page__cta {
  margin-top: 0;
}

.page__aside .legal {
  margin-top: var(--space-4);
}

.ship__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-3);
}

.ship__head h2 {
  margin: 0;
}

/* The padding keeps the tap area without shifting the text */
.ship__change {
  margin: -6px -8px;
  padding: 6px 8px;
  color: var(--fg-muted);
  transition: color 0.15s ease;
}

.ship__change:hover {
  color: var(--fg-default);
}

.ship__recipient {
  margin-top: var(--space-1);
  color: var(--fg-muted);
}

.section__title {
  padding: 0 var(--space-2);
  margin-bottom: var(--space-4);
  color: var(--action-secondary-fg);
}

.methods {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* ---------- Installments ---------- */

/* The option card stays above the band that slides under it */
.installments > :first-child {
  position: relative;
  z-index: 1;
}

.installments__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-top: var(--space-4);
}

.installments__note {
  color: var(--fg-muted);
}

/* Figma 202:911 — full-bleed neutral/50 band behind the open option, fading at both ends.
   `isolation` keeps the z-index: -1 layer inside this block, otherwise it slips under the
   page's own white background and disappears. */
.band {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.band::before {
  content: '';
  position: absolute;
  /* 16 (gap above) + 36 (into the card, right under its label) */
  top: -52px;
  bottom: 0;
  left: calc(var(--space-4) * -1);
  right: calc(var(--space-4) * -1);
  z-index: -1;
  background: linear-gradient(
    to bottom,
    var(--neutral-0) 0%,
    var(--neutral-50) 15%,
    var(--neutral-50) 85%,
    var(--neutral-0) 100%
  );
}

.info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: 15px 23px 17px;
  border: var(--border-width-hairline) solid var(--neutral-100);
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
}

.info__text {
  color: var(--neutral-700);
}

.plan {
  padding: 15px 23px 17px 19px;
  border: var(--border-width-hairline) solid var(--border-default);
  border-radius: var(--radius-lg);
  background: var(--bg-canvas);
}

.plan__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-3);
  padding-left: var(--space-1);
  color: var(--action-secondary-fg);
}

.plan__head .body-m {
  min-width: 0;
}

.plan__head .heading-s {
  flex-shrink: 0;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.plan__label {
  padding-left: var(--space-1);
  color: var(--fg-muted);
}

.plan__head + .plan__label {
  margin-top: var(--space-1);
}

.plan__controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  margin: var(--space-3) 0;
}

.schedule {
  padding: var(--space-1) var(--space-2) 0;
}

.schedule__title {
  margin-bottom: var(--space-4);
}

.schedule__rows {
  margin: 0;
}

.schedule__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  min-height: 28px;
  font-variant-numeric: tabular-nums;
}

.schedule__row dt,
.schedule__row dd {
  margin: 0;
}

.schedule__row--total {
  margin-top: var(--space-2);
  padding-top: var(--space-2);
  border-top: var(--border-width-hairline) solid var(--border-default);
}

/* Скелетон графіка: текст прозорий, а його рамка стає смужкою зі світлою хвилею, як у SampleCardSkeleton.
   inline-block з line-height: 1 — смужка заввишки з шрифт, а висоту рядка далі тримає line-height батька */
.bone {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  line-height: 1;
  border-radius: var(--radius-full);
  overflow: hidden;
  transition: color 0.2s ease, background-color 0.2s ease;
}
.is-loading .bone {
  color: transparent;
  background-color: var(--neutral-100);
}
.is-loading .bone::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, transparent 20%, var(--neutral-0) 50%, transparent 80%);
  opacity: 0.75;
  transform: translateX(-100%);
  animation: bone-sweep 1.3s ease-in-out infinite;
}
@keyframes bone-sweep {
  to {
    transform: translateX(100%);
  }
}
@media (prefers-reduced-motion: reduce) {
  .is-loading .bone::after {
    display: none;
  }
}

.reveal-enter-active {
  transition: opacity 0.25s ease, transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.reveal-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.reveal-leave-active {
  display: none;
}

/* ---------- Bottom ---------- */

/* Figma 223:2931 — strip across the whole screen, 24px from the options and the button */
.promo {
  margin: var(--space-6) calc(var(--space-4) * -1) 0;
}

/* In normal flow at the end of the page (not sticky), followed by the legal note */
.page__cta {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--space-6);
}

.legal {
  margin: var(--space-4) auto 0;
  max-width: 335px;
  text-align: center;
  color: var(--fg-muted);
}
</style>
