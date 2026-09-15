<script setup lang="ts">
// Логотипи способів онлайн-оплати (Figma 112:1573). Офіційні знаки з Wikimedia Commons.
import applePay from '@/assets/payment/apple-pay.svg'
import googlePay from '@/assets/payment/google-pay.svg'
import mastercard from '@/assets/payment/mastercard.svg'
import privat24 from '@/assets/payment/privat24.png'
import visa from '@/assets/payment/visa.svg'
</script>

<template>
  <ul class="pay-logos" aria-label="Apple Pay, Google Pay, Mastercard, Privat24 Pay, Visa">
    <li><img class="pay-logos__apple" :src="applePay" alt="" /></li>
    <li><img class="pay-logos__google" :src="googlePay" alt="" /></li>
    <li><img class="pay-logos__mastercard" :src="mastercard" alt="" /></li>
    <li class="pay-logos__privat">
      <img :src="privat24" alt="" />
      <span>Pay</span>
    </li>
    <li><img class="pay-logos__visa" :src="visa" alt="" /></li>
  </ul>
</template>

<style scoped>
/* Sizes match the proportions in the design strip (≈183 × 17) */
.pay-logos {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  height: 17px;
  margin: 3px 0 0;
  padding: 0;
  list-style: none;
}

.pay-logos li {
  display: flex;
  align-items: center;
}

.pay-logos img {
  display: block;
  width: auto;
}

.pay-logos__apple {
  height: 13px;
}

.pay-logos__google {
  height: 14px;
}

.pay-logos__mastercard {
  height: 14px;
}

.pay-logos__privat {
  gap: 3px;
}

.pay-logos__privat img {
  height: 15px;
}

.pay-logos__privat span {
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
  font-size: 13px;
  line-height: 1;
  letter-spacing: -0.01em;
  color: var(--neutral-1000);
}

.pay-logos__visa {
  height: 10px;
}
</style>
