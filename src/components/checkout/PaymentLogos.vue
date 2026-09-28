<script setup lang="ts">
// Способи онлайн-оплати (Figma 112:1573) — офіційні знаки оплати однакової висоти.
// Apple Pay Mark (developer.apple.com/apple-pay/marketing), Google Pay Acceptance Mark
// (developers.google.com/pay/api/web/guides/brand-guidelines), 24 Pay (брендбук PrivatPay на liqpay.ua).
// Visa й Mastercard дають знак без картки — їхні офіційні знаки вставлено без змін у ту саму рамку,
// що в Apple Pay і 24 Pay (visa-mark.svg, mastercard-mark.svg)
import applePay from '@/assets/payment/apple-pay-mark.svg'
import googlePay from '@/assets/payment/google-pay-mark.svg'
import mastercard from '@/assets/payment/mastercard-mark.svg'
import pay24 from '@/assets/payment/24-pay-mark.svg'
import visa from '@/assets/payment/visa-mark.svg'

const marks = [
  { src: applePay, name: 'Apple Pay' },
  { src: googlePay, name: 'Google Pay' },
  { src: mastercard, name: 'Mastercard' },
  { src: pay24, name: '24 Pay' },
  { src: visa, name: 'Visa' },
]
</script>

<template>
  <ul class="pay-logos">
    <li v-for="mark in marks" :key="mark.name">
      <img :src="mark.src" :alt="mark.name" />
    </li>
  </ul>
</template>

<style scoped>
/* Apple і Google: усі знаки однакової висоти, жоден не менший за інші.
   Вільне поле — не менше ¼ висоти (Apple) і половини висоти «G» (Google): 8px між знаками 24px */
.pay-logos {
  --mark-h: 24px;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin: 3px 0 0;
  padding: 0;
  list-style: none;
}

.pay-logos li {
  display: flex;
}

.pay-logos img {
  display: block;
  width: auto;
  height: var(--mark-h);
}
</style>
