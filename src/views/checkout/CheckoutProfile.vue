<script setup lang="ts">
// Figma «Підтвердіть номер телефону» (node 125:5862) — profile creation starts from the order's phone
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SkIcon from '@/components/SkIcon.vue'
import SkInput from '@/components/SkInput.vue'
import SkButton from '@/components/SkButton.vue'
import CheckoutTopBar from '@/components/checkout/CheckoutTopBar.vue'
import { holdKeyboard } from '@/composables/keyboardHandoff'
import { useWideCart } from '@/composables/useWideCart'
import { RESEND_SECONDS, formatPhoneInput, phoneDigits, useCheckout } from '@/composables/useCheckout'

const router = useRouter()
// Desktop: the screen sits in the middle of the page, as «Замовлення прийнято» before it
const wide = useWideCart()
const { contact, profile } = useCheckout()

// Prefilled with the number given at checkout (or the one already sent a code); editing here doesn't touch the order
const phone = ref(profile.phone || formatPhoneInput(contact.phone))
const error = ref('')
const input = ref<InstanceType<typeof SkInput> | null>(null)

function onPhone(value: string) {
  phone.value = formatPhoneInput(value)
  error.value = ''
}

function requestCode() {
  if (phoneDigits(phone.value).length !== 12) {
    error.value = 'Вкажіть номер телефону повністю'
    input.value?.focus()
    return
  }
  // Same number within the resend window — keep the running timer instead of «sending» again
  if (phone.value !== profile.phone || Date.now() - profile.codeSentAt >= RESEND_SECONDS * 1000) {
    profile.phone = phone.value
    profile.codeSentAt = Date.now()
  }
  // Still inside the tap: bring the keyboard up for the code field on the next screen
  holdKeyboard('numeric')
  router.push({ name: 'checkout-profile-code' })
}
</script>

<template>
  <div class="page" :class="{ 'page--wide': wide }">
    <CheckoutTopBar :step="3" />

    <main class="profile">
      <SkIcon name="PeopleCircleLarge" :size="48" />
      <h1 class="profile__title heading-s">Підтвердіть номер телефону</h1>
      <p class="profile__text body-s">
        Надішлемо код у SMS. Номер потрібен, щоб зберегти замовлення і повідомити про доставку.
      </p>

      <form class="profile__form" novalidate @submit.prevent="requestCode">
        <SkInput
          ref="input"
          v-model="phone"
          placeholder="+38 (000) 000-00-00"
          type="tel"
          inputmode="tel"
          autocomplete="tel"
          aria-label="Номер телефону"
          enterkeyhint="send"
          :error="error"
          @input="onPhone"
        />
        <SkButton type="submit" block>Отримати код</SkButton>
      </form>
    </main>
  </div>
</template>

<style scoped>
/* Figma: icon 136px below the steps bar, title +16, text +8, field +20, button +16 */
.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 118px var(--space-4) calc(env(safe-area-inset-bottom) + var(--space-8));
  text-align: center;
}

.profile__title {
  margin-top: var(--space-4);
  color: var(--action-secondary-fg);
}

.profile__text {
  max-width: 319px;
  margin-top: var(--space-2);
  color: var(--fg-muted);
}

.profile__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
  margin-top: var(--space-5);
  text-align: left;
}

/* ---------- Desktop: centred under the steps bar, like «Замовлення прийнято» ---------- */

/* Fills the screen under the steps bar (CheckoutLayout: its height + the 16px under its line) */
.page--wide {
  display: flex;
  flex-direction: column;
  min-height: calc(100svh - var(--checkout-header-h) - var(--checkout-steps-h, 0px) - var(--space-4));
}

/* No keyboard to make room for — in the middle, a bit higher than the exact middle */
.page--wide .profile {
  flex: 1;
  justify-content: center;
  padding-block: var(--space-10) calc(var(--space-10) + 8vh);
}
</style>
