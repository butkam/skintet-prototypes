<script setup lang="ts">
// Figma «Дані й доставка» (node 112:1507)
import { computed, nextTick, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import SkIcon from '@/components/SkIcon.vue'
import SkInput from '@/components/SkInput.vue'
import SkCheckbox from '@/components/SkCheckbox.vue'
import SkOptionCard from '@/components/SkOptionCard.vue'
import SkButton from '@/components/SkButton.vue'
import CheckoutTopBar from '@/components/checkout/CheckoutTopBar.vue'
import CheckoutOrder from '@/components/checkout/CheckoutOrder.vue'
import CityField from '@/components/checkout/CityField.vue'
import { findCity } from '@/data/cities'
import { formatPhoneInput, phoneDigits, useCheckout, type DeliveryMethod } from '@/composables/useCheckout'
import novaPoshta from '@/assets/images/nova-poshta.png'

const router = useRouter()
const { contact, delivery, deliveryConfirmed, deliveryPriceLabel } = useCheckout()

const methods: { id: DeliveryMethod; label: string; hint: string }[] = [
  { id: 'branch', label: 'Відділення', hint: 'До 3-х робочих днів' },
  { id: 'courier', label: 'Адресна', hint: 'До 5-х робочих днів' },
  { id: 'locker', label: 'Поштомат', hint: 'До 3-х робочих днів' },
]

/* ---------- Validation ---------- */

type Field = 'phone' | 'firstName' | 'lastName' | 'email' | 'city' | 'branch' | 'address' | 'locker'
const errors = reactive<Partial<Record<Field, string>>>({})
type Focusable = { focus: () => void; $el: HTMLElement }
const refs = reactive<Partial<Record<Field, Focusable | null>>>({})
const setRef = (f: Field) => (el: unknown) => (refs[f] = el as Focusable | null)
const submitted = ref(false)

const detailField = computed<Field>(() => (delivery.method === 'courier' ? 'address' : delivery.method))

function validate() {
  const e: Partial<Record<Field, string>> = {}
  if (phoneDigits(contact.phone).length !== 12) e.phone = 'Вкажіть номер телефону повністю'
  if (!contact.firstName.trim()) e.firstName = 'Вкажіть ім’я'
  if (!contact.lastName.trim()) e.lastName = 'Вкажіть прізвище'
  if (contact.email.trim() && !/^\S+@\S+\.\S+$/.test(contact.email.trim())) e.email = 'Перевірте імейл'
  if (!delivery.city.trim()) e.city = 'Вкажіть місто'
  else if (!findCity(delivery.city)) e.city = 'Оберіть місто зі списку'
  if (delivery.method === 'branch' && !delivery.branch.trim()) e.branch = 'Оберіть відділення'
  if (delivery.method === 'courier' && !delivery.address.trim()) e.address = 'Вкажіть адресу'
  if (delivery.method === 'locker' && !delivery.locker.trim()) e.locker = 'Оберіть поштомат'
  for (const k of Object.keys(errors) as Field[]) delete errors[k]
  Object.assign(errors, e)
  return Object.keys(e) as Field[]
}

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
  <div class="page">
    <CheckoutTopBar :step="1">
      <CheckoutOrder />
    </CheckoutTopBar>

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
            enterkeyhint="next"
            @input="onContact('email')"
            @keydown.enter.prevent="focusNext('email')"
          />
        </div>

        <label class="subscribe body-m">
          <input v-model="contact.subscribe" class="visually-hidden" type="checkbox" />
          <SkCheckbox :checked="contact.subscribe" />
          Хочу знижки й новини Skin(tet)
        </label>
      </section>

      <!-- Доставка -->
      <section class="section section--delivery" aria-labelledby="delivery-title">
        <h2 id="delivery-title" class="section__title section__title--np heading-s">
          Доставка
          <span class="np-logo"><img :src="novaPoshta" alt="Нова Пошта" /></span>
        </h2>

        <CityField :ref="setRef('city')" v-model="delivery.city" :error="errors.city" @input="touch" />

        <div class="methods" role="radiogroup" aria-label="Спосіб доставки">
          <template v-for="m in methods" :key="m.id">
            <SkOptionCard
              :label="m.label"
              :meta="deliveryPriceLabel"
              :hint="m.hint"
              :selected="delivery.method === m.id"
              @select="delivery.method = m.id; touch()"
            />
            <Transition name="reveal">
              <div v-if="delivery.method === m.id" class="method-detail">
                <SkInput
                  v-if="m.id === 'branch'"
                  :ref="setRef('branch')"
                  v-model="delivery.branch"
                  placeholder="Номер або адреса відділення"
                  inputmode="search"
                  :error="errors.branch"
                  @input="touch"
                />
                <SkInput
                  v-else-if="m.id === 'courier'"
                  :ref="setRef('address')"
                  v-model="delivery.address"
                  placeholder="Вулиця, будинок, квартира"
                  autocomplete="street-address"
                  :error="errors.address"
                  @input="touch"
                />
                <SkInput
                  v-else
                  :ref="setRef('locker')"
                  v-model="delivery.locker"
                  placeholder="Номер або адреса поштомату"
                  inputmode="search"
                  :error="errors.locker"
                  @input="touch"
                >
                  <template #trailing><SkIcon name="MagnifyingGlass" /></template>
                </SkInput>
                <p v-if="m.id === 'branch' && !errors[detailField]" class="method-detail__hint body-s">
                  Останнє відділення яким ви користувались.
                </p>
              </div>
            </Transition>
          </template>
        </div>
      </section>

      <div class="page__cta">
        <SkButton block @click="next">Перейти до оплати</SkButton>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page__content {
  display: flex;
  flex-direction: column;
  padding: var(--space-4) var(--space-4) calc(env(safe-area-inset-bottom) + var(--space-5));
}

.section__title {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: 0 var(--space-2);
  margin-bottom: var(--space-4);
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
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-top: var(--space-4);
}

.method-detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  /* Sits 8px under its card (16px list gap − 8px) */
  margin-top: calc(var(--space-2) - var(--space-4));
}

.method-detail__hint {
  padding-left: var(--space-5);
  color: var(--fg-muted);
}

.reveal-enter-active {
  transition: opacity 0.2s ease, transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.reveal-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
.reveal-leave-active {
  display: none;
}

/* In normal flow at the end of the page (not sticky) */
.page__cta {
  margin-top: var(--space-8);
}
</style>
