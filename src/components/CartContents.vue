<script setup lang="ts">
// Figma "iPhone 17 - 9" (node 112:1857) — кошик з товарами
// Прилипання: шкала під хедером, «Замовити» внизу (node 112:2021)
// Широкий екран: дві колонки (хедер кошика лише над правою) — ліворуч подарунки, рекомендовані (стрічкою зі стрілками) й промокод, праворуч товари й оформлення
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import SkButton from './SkButton.vue'
import CartGifts from './CartGifts.vue'
import CartLines from './CartLines.vue'
import CartPromo from './CartPromo.vue'
import CartSummary from './CartSummary.vue'
import ProductRail from './ProductRail.vue'
import { useCart } from '@/composables/useCart'
import { useWideCart } from '@/composables/useWideCart'
import { formatPrice } from '@/data/catalog'
import { prefersReducedMotion } from '@/motion/spring'

const cart = useCart()
const wide = useWideCart()
const router = useRouter()

// «Замовити» → оформлення: close the cart, and land the next page at the top
// «Замовити»: open checkout underneath first, then push it in from the right while the cart exits left
async function checkout() {
  cart.baseScrollY.value = 0
  cart.baseTop.value = 0
  cart.drawerExit.value = 'forward'
  await router.push('/checkout')
  cart.closeDrawer()
}

const pickedSamples = computed(() => cart.sampleLines.value.length)

// Під промокодом; те, що вже в кошику, стрічка ховає сама
const RECOMMENDED_IDS = [
  'lift-complex-cream',
  'neuropeptide-deep-crease-serum',
  'advanced-pro-collagen-peptide-cream',
  'liquid-peptides-advanced-mp',
  'niacinamide-peptides',
  'cold-plasma-plus-advanced-hydrating-complex',
]

/* ---------- Подарунок перед оформленням ---------- */

// Перший тап по «Замовити» з вільним слотом не веде на оформлення, а розгортає
// панель подарунків — вона липка, тож видно і її, і кнопку. Другий тап іде далі.
const giftsOffered = ref(false)
const giftsLeft = computed(() => cart.samplesAllowed.value - pickedSamples.value)

// Поки не обрано жодного подарунка, кнопка каже, що замовлення піде без них.
// Щойно щось обрано — це вже звичайне «Замовити», хай і з вільними слотами
const orderLabel = computed(() =>
  giftsOffered.value && giftsLeft.value > 0 && !pickedSamples.value
    ? giftsLeft.value === 1
      ? 'Без подарунка'
      : 'Без подарунків'
    : 'Замовити',
)

// Дія живе в панелі, лише поки та відкрита: інакше (сума впала нижче порогу)
// кошик лишився б узагалі без кнопки. На широкому екрані панель — сусідня колонка,
// тож кнопка лишається на своєму місці під підсумком
const offering = computed(() => !wide.value && giftsOffered.value && cart.giftsOpen.value)

// Ліва колонка гортається окремо: на пропозицію подарунка повертаємо її до шкали
const side = ref<HTMLElement | null>(null)

function order() {
  if (!giftsOffered.value && giftsLeft.value > 0 && !cart.samplesDeclined.value) {
    giftsOffered.value = true
    cart.giftsOpen.value = true
    side.value?.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'instant' : 'smooth' })
    return
  }
  checkout()
}
</script>

<template>
  <div v-if="wide" class="cart cart--wide">
    <div class="cart__side">
      <div ref="side" class="cart__scroll">
        <CartGifts inline />
        <ProductRail class="cart__rail" title="Рекомендовані засоби" align="start" :ids="RECOMMENDED_IDS" />
      </div>
      <div class="cart__foot cart__foot--promo">
        <CartPromo />
      </div>
    </div>

    <div class="cart__main">
      <div class="cart__scroll">
        <CartLines class="cart__lines" />
      </div>
      <div class="cart__foot">
        <CartSummary />
        <div class="cart__checkout">
          <SkButton block @click="order">
            {{ orderLabel }}
            <template #amount>{{ formatPrice(cart.total.value) }}</template>
          </SkButton>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="cart">
    <CartGifts :offering="offering" :action-label="orderLabel" @order="checkout" />

    <CartLines class="cart__lines" />

    <div class="cart__promo">
      <CartPromo />
    </div>

    <ProductRail class="cart__rail" title="Рекомендовані засоби" align="start" :ids="RECOMMENDED_IDS" />

    <CartSummary class="cart__summary" />

    <div v-if="!offering" class="cart__checkout">
      <SkButton block @click="order">
        {{ orderLabel }}
        <template #amount>{{ formatPrice(cart.total.value) }}</template>
      </SkButton>
    </div>
  </div>
</template>

<style scoped>
.cart {
  display: flex;
  flex-direction: column;
  padding-bottom: calc(env(safe-area-inset-bottom) + var(--space-5));
}

/* 20px under the gifts panel (Figma 160:7315) */
.cart__lines {
  margin-top: var(--space-5);
}

/* ---------- Promo & summary (nodes 112:1976–1990) ---------- */

.cart__promo {
  /* Strip runs edge to edge; its row lines up with the lines above */
  --promo-inset: var(--space-5);
  margin-top: var(--space-4);
}

.cart__rail {
  margin-top: var(--space-8);
}

.cart__summary {
  margin-top: var(--space-8);
}

/* ---------- Checkout (in normal flow at the end of the cart, not sticky) ---------- */

.cart__checkout {
  margin-top: var(--space-8);
  padding: 0 var(--space-5);
}

/* ---------- Широкий екран: дві колонки однакової ширини ---------- */

/* Кожна колонка гортається сама; низ колонок (промокод і оформлення) стоїть на місці.
   Сітку дає дровер (CartDrawer → .drawer__body--filled): хедер у ній лише над правою колонкою,
   а ліва займає обидва рядки й починається з самого верху */
.cart--wide {
  display: contents;
}
.cart--wide .cart__side {
  grid-area: 1 / 1 / 3 / 2;
}
.cart--wide .cart__main {
  grid-area: 2 / 2;
}

.cart__side,
.cart__main {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.cart__side {
  border-right: var(--border-width-hairline) solid var(--border-default);
}

.cart__scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-bottom: var(--space-8);
}

.cart--wide .cart__rail {
  margin-top: var(--space-6);
}

.cart__foot {
  flex-shrink: 0;
  padding: var(--space-5) 0 calc(env(safe-area-inset-bottom) + var(--space-5));
  border-top: var(--border-width-hairline) solid var(--border-default);
}

.cart__foot .cart__checkout {
  margin-top: var(--space-5);
}

/* Смуга промокоду (Figma 223:2931) сама дає лінії, тож без межі футера.
   Її рядок стоїть на одній висоті з «Замовити» сусідньої колонки: 6px — власний відступ смуги */
.cart__foot--promo {
  --promo-inset: var(--space-5);
  padding: 0 0 calc(env(safe-area-inset-bottom) + var(--space-5) - 6px);
  border-top: 0;
}
</style>
