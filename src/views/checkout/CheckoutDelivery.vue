<script setup lang="ts">
// Figma «Дані й доставка» (node 112:1507); delivery method states — 145:6600 · 174:8568 · 176:8690
import { computed, nextTick, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import SkIcon, { type IconName } from '@/components/SkIcon.vue'
import SkInput from '@/components/SkInput.vue'
import SkCheckbox from '@/components/SkCheckbox.vue'
import SkSegmented from '@/components/SkSegmented.vue'
import SkButton from '@/components/SkButton.vue'
import CheckoutTopBar from '@/components/checkout/CheckoutTopBar.vue'
import CheckoutOrder from '@/components/checkout/CheckoutOrder.vue'
import CheckoutAside from '@/components/checkout/CheckoutAside.vue'
import CityField from '@/components/checkout/CityField.vue'
import { findCity } from '@/data/cities'
import { formatPrice } from '@/data/catalog'
import { useCart } from '@/composables/useCart'
import { useWideCart } from '@/composables/useWideCart'
import { LAST_DELIVERY, formatPhoneInput, phoneDigits, useCheckout, type DeliveryMethod } from '@/composables/useCheckout'
import novaPoshta from '@/assets/images/nova-poshta.png'

const router = useRouter()
const cart = useCart()
const { contact, delivery, deliveryConfirmed } = useCheckout()
// Desktop: the form on the left, the order with «Перейти до оплати» in a column on the right
const wide = useWideCart()

const METHODS: DeliveryMethod[] = ['branch', 'courier', 'locker']
// `eta` — скільки йде посилка цим способом; `lastUsed` — hint under the field while it still
// holds the prefilled value (LAST_DELIVERY)
const methodMeta: Record<DeliveryMethod, { label: string; icon: IconName; eta: string; lastUsed: string }> = {
  branch: { label: 'Відділення', icon: 'Shop', eta: 'До 3-х робочих днів', lastUsed: 'Останнє відділення яким ви користувались.' },
  courier: { label: 'Адресна', icon: 'Home', eta: 'До 5-ти робочих днів', lastUsed: 'Остання адреса яку ви вказували.' },
  locker: { label: 'Поштомат', icon: 'Package', eta: 'До 3-х робочих днів', lastUsed: 'Останній поштомат яким ви користувались.' },
}
const detailField = computed<'branch' | 'address' | 'locker'>(() =>
  delivery.method === 'courier' ? 'address' : delivery.method,
)
const showLastUsed = computed(() => delivery[detailField.value] === LAST_DELIVERY[detailField.value])

// The prefilled branch, address and locker belong to the last city — drop them once the customer changes it
function onCity() {
  if (delivery.city !== LAST_DELIVERY.city) {
    for (const f of ['branch', 'address', 'locker'] as const) {
      if (delivery[f] === LAST_DELIVERY[f]) delivery[f] = ''
    }
  }
  touch()
}

/* ---------- Validation ---------- */

type Field = 'phone' | 'firstName' | 'lastName' | 'email' | 'city' | 'branch' | 'address' | 'locker'
const errors = reactive<Partial<Record<Field, string>>>({})
type Focusable = { focus: () => void; $el: HTMLElement }
const refs = reactive<Partial<Record<Field, Focusable | null>>>({})
const setRef = (f: Field) => (el: unknown) => (refs[f] = el as Focusable | null)
const submitted = ref(false)

function validate() {
  const e: Partial<Record<Field, string>> = {}
  if (phoneDigits(contact.phone).length !== 12) e.phone = 'Вкажіть номер телефону повністю'
  if (!contact.firstName.trim()) e.firstName = 'Вкажіть ім’я'
  if (!contact.lastName.trim()) e.lastName = 'Вкажіть прізвище'
  if (contact.email.trim() && !/^\S+@\S+\.\S+$/.test(contact.email.trim())) e.email = 'Перевірте імейл'
  if (!delivery.city.trim()) e.city = 'Вкажіть місто'
  else if (!findCity(delivery.city)) e.city = 'Оберіть місто зі списку'
  if (delivery.method === 'branch' && !delivery.branch.trim()) e.branch = 'Оберіть відділення'
  if (delivery.method === 'courier' && !delivery.address.trim()) e.address = 'Вкажіть вулицю й дім'
  if (delivery.method === 'locker' && !delivery.locker.trim()) e.locker = 'Вкажіть поштомат'
  for (const k of Object.keys(errors) as Field[]) delete errors[k]
  Object.assign(errors, e)
  return Object.keys(e) as Field[]
}

// Green check at the end of a field once it's filled in correctly
const valid = computed<Record<Field, boolean>>(() => ({
  phone: phoneDigits(contact.phone).length === 12,
  firstName: !!contact.firstName.trim(),
  lastName: !!contact.lastName.trim(),
  email: /^\S+@\S+\.\S+$/.test(contact.email.trim()),
  city: !!findCity(delivery.city),
  branch: !!delivery.branch.trim(),
  address: !!delivery.address.trim(),
  locker: !!delivery.locker.trim(),
}))

// Re-validate live once the user has tried to continue
function touch() {
  if (submitted.value) validate()
}

async function next() {
  submitted.value = true
  const invalid = validate()
  if (invalid.length) {
    await nextTick()
    const first = refs[invalid[0]]
    first?.focus()
    first && (first.$el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }
  deliveryConfirmed.value = true
  router.push({ name: 'checkout-payment' })
}

function onPhone(value: string) {
  contact.phone = formatPhoneInput(value)
  onContact('phone')
}

/* ---------- AutoFill: continue from the first empty field ---------- */

// iOS AutoFill Contact fills several fields at once, then moves focus to the next field in DOM order
// (e.g. «Ім’я», already filled). Detect the fill and continue from the first field that's still empty.
const FILL_ORDER: Field[] = ['phone', 'firstName', 'lastName', 'email', 'city']
const isEmpty: Record<string, () => boolean> = {
  phone: () => phoneDigits(contact.phone).length !== 12,
  firstName: () => !contact.firstName.trim(),
  lastName: () => !contact.lastName.trim(),
  email: () => !contact.email.trim(),
  city: () => !findCity(delivery.city),
}
const inputOf = (f: Field) => refs[f]?.$el?.querySelector?.('input') as HTMLInputElement | null | undefined
const fieldOf = (el: EventTarget | null) => FILL_ORDER.find((f) => inputOf(f) === el)

const burst = new Set<Field>()
let filledInBackground = false
let burstTimer: ReturnType<typeof setTimeout> | undefined
let autofillTarget: Field | undefined
let redirectUntil = 0

function onContact(field: Field) {
  touch()
  burst.add(field)
  // You can only type into the focused field — a value landing elsewhere is AutoFill
  if (document.activeElement !== inputOf(field)) filledInBackground = true
  clearTimeout(burstTimer)
  burstTimer = setTimeout(() => {
    const autofilled = burst.size > 1 || filledInBackground
    burst.clear()
    filledInBackground = false
    if (autofilled) continueAfterAutofill()
  }, 100)
}

function continueAfterAutofill() {
  autofillTarget = FILL_ORDER.find((f) => isEmpty[f]())
  if (!autofillTarget) return
  refs[autofillTarget]?.focus()
  // Safari may move focus itself a moment later — keep steering it for a short while
  redirectUntil = Date.now() + 1000
  setTimeout(steerFocus, 350)
}

function steerFocus() {
  if (!autofillTarget || Date.now() > redirectUntil) return
  const current = fieldOf(document.activeElement)
  if (current && current !== autofillTarget && !isEmpty[current]()) refs[autofillTarget]?.focus()
}

function onFocusIn(e: FocusEvent) {
  if (Date.now() > redirectUntil || !autofillTarget) return
  const field = fieldOf(e.target)
  if (field && field !== autofillTarget && !isEmpty[field]()) refs[autofillTarget]?.focus()
  else if (field === autofillTarget) redirectUntil = 0
}

// Keyboard «Далі» (enterkeyhint="next") moves down the form
function focusNext(field: Field) {
  const target = FILL_ORDER[FILL_ORDER.indexOf(field) + 1]
  if (target) refs[target]?.focus()
}
</script>

<template>
  <div class="page" :class="{ 'page--split': wide }">
    <CheckoutTopBar :step="1">
      <template v-if="!wide" #default>
        <CheckoutOrder />
      </template>
    </CheckoutTopBar>

    <CheckoutAside v-if="wide" class="page__aside">
      <SkButton block @click="next">Перейти до оплати</SkButton>
      <p class="legal body-s">
        Підтверджуючи ви погоджуєтесь з умовами оферти, політики конфіденційності, заявою про обробку персональних даних та
        приймаєте їх.
      </p>
    </CheckoutAside>

    <main class="page__content">
      <!-- Контактні дані -->
      <section class="section" aria-labelledby="contact-title" @focusin="onFocusIn">
        <h2 id="contact-title" class="section__title heading-s">Контактні дані</h2>
        <div class="fields">
          <SkInput
            :ref="setRef('phone')"
            v-model="contact.phone"
            placeholder="+38 (000) 000-00-00"
            type="tel"
            inputmode="tel"
            autocomplete="tel"
            :error="errors.phone"
            :valid="valid.phone"
            enterkeyhint="next"
            @input="onPhone"
            @keydown.enter.prevent="focusNext('phone')"
          />
          <div class="fields__row">
            <SkInput
              :ref="setRef('firstName')"
              v-model="contact.firstName"
              placeholder="Ім’я"
              autocomplete="given-name"
              :error="errors.firstName"
              :valid="valid.firstName"
              enterkeyhint="next"
              @input="onContact('firstName')"
              @keydown.enter.prevent="focusNext('firstName')"
            />
            <SkInput
              :ref="setRef('lastName')"
              v-model="contact.lastName"
              placeholder="Прізвище"
              autocomplete="family-name"
              :error="errors.lastName"
              :valid="valid.lastName"
              enterkeyhint="next"
              @input="onContact('lastName')"
              @keydown.enter.prevent="focusNext('lastName')"
            />
          </div>
          <SkInput
            :ref="setRef('email')"
            v-model="contact.email"
            placeholder="Імейл"
            type="email"
            inputmode="email"
            autocomplete="email"
            :error="errors.email"
            :valid="valid.email"
            enterkeyhint="next"
            @input="onContact('email')"
            @keydown.enter.prevent="focusNext('email')"
          />
        </div>

        <label class="subscribe body-m">
          <input v-model="contact.subscribe" class="visually-hidden" type="checkbox" />
          <SkCheckbox :checked="contact.subscribe" />
          Отримувати знижки й новини від Skin(tet)
        </label>
      </section>

      <!-- Доставка -->
      <section class="section section--delivery" aria-labelledby="delivery-title">
        <h2 id="delivery-title" class="section__title section__title--np heading-s">
          Доставка
          <span class="np-logo"><img :src="novaPoshta" alt="Нова Пошта" /></span>
        </h2>

        <CityField :ref="setRef('city')" v-model="delivery.city" :error="errors.city" :valid="valid.city" @input="onCity" />

        <SkSegmented v-model="delivery.method" class="methods" :options="METHODS" label="Спосіб доставки" block @update:model-value="touch">
          <template #default="{ option, active }">
            <SkIcon :name="methodMeta[option].icon" :size="16" :color="active ? 'var(--fg-default)' : 'var(--fg-muted)'" />
            {{ methodMeta[option].label }}
          </template>
        </SkSegmented>

        <!-- Figma 145:6600 — терміни доставки. Безкоштовна дописується до фрази зеленим,
             а реальна вартість виноситься в правий край рядка. -->
        <p class="eta body-m" aria-live="polite">
          <span>
            {{ methodMeta[delivery.method].eta
            }}<template v-if="cart.freeDelivery.value">, <span class="eta__free">безкоштовно</span></template>
          </span>
          <span v-if="!cart.freeDelivery.value" class="eta__price">{{ formatPrice(cart.delivery.value) }}</span>
        </p>

        <div class="method-detail">
          <SkInput
            v-if="delivery.method === 'branch'"
            :ref="setRef('branch')"
            v-model="delivery.branch"
            placeholder="Номер відділення"
            inputmode="search"
            :error="errors.branch"
            :valid="valid.branch"
            @input="touch"
          />
          <SkInput
            v-else-if="delivery.method === 'courier'"
            :ref="setRef('address')"
            v-model="delivery.address"
            placeholder="Вулиця, дім"
            autocomplete="street-address"
            :error="errors.address"
            :valid="valid.address"
            @input="touch"
          />
          <SkInput
            v-else
            :ref="setRef('locker')"
            v-model="delivery.locker"
            placeholder="Номер поштомату"
            inputmode="search"
            :error="errors.locker"
            :valid="valid.locker"
            @input="touch"
          />
          <p v-if="showLastUsed" class="method-detail__hint body-s">{{ methodMeta[delivery.method].lastUsed }}</p>
        </div>
      </section>

      <template v-if="!wide">
        <div class="page__cta">
          <SkButton block @click="next">Перейти до оплати</SkButton>
        </div>

        <p class="legal body-s">
          Підтверджуючи ви погоджуєтесь з умовами оферти, політики конфіденційності, заявою про обробку персональних даних та
          приймаєте їх.
        </p>
      </template>
    </main>
  </div>
</template>

<style scoped>
.page__content {
  display: flex;
  flex-direction: column;
  padding: var(--space-4) var(--space-4) calc(env(safe-area-inset-bottom) + var(--space-5));
}

/* ---------- Desktop: form | order ---------- */

/* Under the steps bar (CheckoutLayout keeps one for all steps): the form on the left,
   the order column on the right, level with the form */
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

.page__aside .legal {
  margin-top: var(--space-4);
}

.section__title {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: 0 var(--space-2);
  margin-bottom: var(--space-4);
}

.section__title--np {
  gap: var(--space-2);
  color: var(--action-secondary-fg);
}

/* Figma 112:1542 crops the logo's transparent padding: 108.7% × 138.3%, offset −6% / −19% */
.np-logo {
  position: relative;
  width: 62px;
  height: 19px;
  overflow: hidden;
}

.np-logo img {
  position: absolute;
  left: -5.97%;
  top: -19.15%;
  width: 108.72%;
  height: 138.3%;
  max-width: none;
}

.fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.fields__row {
  display: grid;
  grid-template-columns: 181fr 185fr;
  gap: var(--space-1);
}

.subscribe {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin: var(--space-4) 0 0;
  padding: 0 var(--space-2);
  color: var(--action-secondary-fg);
  cursor: pointer;
}

.subscribe:has(input:focus-visible) :deep(.sk-checkbox) {
  outline: var(--border-width-focus) solid var(--border-focus);
  outline-offset: 2px;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.section--delivery {
  margin-top: 36px;
}

.methods {
  margin-top: var(--space-4);
}

/* 12px під сегментед-контролом, 20px до поля з деталями способу */
.eta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
  margin: var(--space-3) 0 var(--space-5);
  padding: 0 var(--space-5);
  color: var(--fg-default);
}

.eta__free {
  color: var(--status-success-fg);
}

.eta__price {
  flex-shrink: 0;
}

.method-detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.method-detail__hint {
  padding-left: var(--space-5);
  color: var(--fg-muted);
}

/* In normal flow at the end of the page (not sticky), followed by the legal note */
.page__cta {
  margin-top: var(--space-8);
}

.legal {
  margin: var(--space-3) auto 0;
  max-width: 335px;
  text-align: center;
  color: var(--fg-muted);
}
</style>
