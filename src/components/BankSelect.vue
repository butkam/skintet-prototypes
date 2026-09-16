<script setup lang="ts">
// Figma "Dropdown" (node 112:1648) with "Payment Provider" (112:1374): bank logo 24 (radius/sm) + chevron.
// Native <select> overlay → the OS picker on mobile.
import SkIcon from './SkIcon.vue'
import { BANKS, type Bank } from '@/composables/useCheckout'
import monobankLogo from '@/assets/images/bank-monobank.svg'
import privatbankLogo from '@/assets/images/bank-privatbank.jpg'

const model = defineModel<Bank>({ required: true })

const logos: Record<Bank, string> = { monobank: monobankLogo, privatbank: privatbankLogo }
</script>

<template>
  <label class="bank-select">
    <span class="bank-select__logo" :class="`bank-select__logo--${model}`">
      <img :src="logos[model]" alt="" />
    </span>
    <SkIcon name="ChevronDownDropdown" :size="16" />
    <select v-model="model" class="bank-select__native" aria-label="Банк для оплати частинами">
      <option v-for="b in BANKS" :key="b.id" :value="b.id">{{ b.name }}</option>
    </select>
  </label>
</template>

<style scoped>
.bank-select {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  height: 52px;
  padding: 0 var(--space-3);
  border-radius: var(--radius-full);
  background: var(--bg-surface);
  cursor: pointer;
}

.bank-select__logo {
  display: grid;
  place-items: center;
  width: var(--icon-md);
  height: var(--icon-md);
  /* Round: the monobank mark comes as a circle */
  border-radius: var(--radius-full);
  overflow: hidden;
}

.bank-select__logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


.bank-select__native {
  position: absolute;
  inset: 0;
  width: 100%;
  opacity: 0;
  font-size: 16px;
  cursor: pointer;
}

.bank-select:focus-within {
  outline: var(--border-width-focus) solid var(--border-focus);
  outline-offset: 2px;
}
</style>
