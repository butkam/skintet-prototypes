<script setup lang="ts">
// Прототип «6 жовтня»: вибір подарунків унизу кошика, під «Рекомендованими засобами», а не в шторці під шкалою.
// Заголовок — як у стрічки рекомендованих (Heading/S), напроти нього лічильник «0/3», під ним відмова, далі — картки товарів.
// З'являється, щойно подарунки стали доступні (від 5 000 ₴)
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import GiftProductCard from './GiftProductCard.vue'
import ScrollArrows from './ScrollArrows.vue'
import TapHint from './TapHint.vue'
import { useCart } from '@/composables/useCart'
import { pluralGifts, samples } from '@/data/catalog'
import { prefersReducedMotion } from '@/motion/spring'
import { scrollShift } from '@/motion/scrollShift'

const props = defineProps<{
  /** «Замовити» без подарунка: кошик доїхав сюди — палець показує на картки, доки людина щось не зробить з ними */
  hint?: boolean
}>()

const cart = useCart()

const allowed = computed(() => cart.samplesAllowed.value)
const picked = computed(() => cart.sampleLines.value.length)
const limitReached = computed(() => picked.value >= allowed.value)
const title = computed(() => `Оберіть ${allowed.value} ${pluralGifts(allowed.value)}`)

const titleId = `gift-picker-${Math.random().toString(36).slice(2, 8)}`
const track = ref<HTMLElement | null>(null)
const root = ref<HTMLElement | null>(null)

// Обраний подарунок додає рядок у список товарів, а знятий — прибирає, і обидва вище за цей блок.
// Поза екраном рядок стає й зникає одразу (CartLines), а документ зсуваємо рівно на різницю, один раз:
// Safari на iPhone не тримає вміст під пальцем сам, і картки під пальцем стрибали — як колись зі стрічкою
// рекомендованих (ProductRail → commit)
async function toggle(sample: (typeof samples)[number], e: MouseEvent) {
  const before = root.value?.getBoundingClientRect().top ?? 0
  if (cart.toggleSample(sample)) {
    await nextTick()
    const shift = (root.value?.getBoundingClientRect().top ?? before) - before
    if (shift && root.value) scrollShift(root.value, shift)
    return
  }
  if (prefersReducedMotion()) return
  // Can't add → gentle horizontal shake (як у шторці)
  ;(e.currentTarget as HTMLElement).animate(
    [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(0)' }],
    { duration: 320, easing: 'ease-out' },
  )
}

/* ---------- Підказка пальцем (Figma 319:4830), як у широкому кошику ---------- */

// Палець з'являється, коли кошик уже доїхав до вибору (затримка TapHint), і зникає, щойно людина
// щось обрала, погортала картки чи відмовилась — вона вже там, куди ми показували. Раз побачив — досить
const hintSeen = ref(false)
const showHint = computed(() => props.hint && !hintSeen.value && !cart.samplesDeclined.value)
watch([picked, () => cart.samplesDeclined.value], ([n, declined]) => {
  if (props.hint && (n || declined)) hintSeen.value = true
})

function onTrackScroll() {
  if (showHint.value) hintSeen.value = true
}

// «Натискає» на другу видиму картку — хоч би як стрічку вже погортали: кінчик трохи лівіше її середини,
// на дві третини висоти. Видима — та, що цілком у вікні стрічки; на третій палець вилазив за край телефона.
// Від стрічки з обгорткою, а не від самої стрічки: та обрізає все, що виходить за її межі
const viewport = ref<HTMLElement | null>(null)
const hintAt = ref({ left: 0, top: 0 })
watch(showHint, (value) => {
  const el = track.value
  if (!value || !viewport.value || !el?.children.length) return
  const base = viewport.value.getBoundingClientRect()
  const frame = el.getBoundingClientRect()
  const cards = [...el.children].map((c) => c.getBoundingClientRect())
  const visible = cards.filter((c) => c.left >= frame.left - 1 && c.right <= frame.right + 1)
  const card = visible[1] ?? visible[0] ?? cards[0]
  hintAt.value = {
    left: card.left + card.width * 0.4 - base.left,
    top: card.top + card.height * 0.65 - base.top,
  }
}, { flush: 'post', immediate: true })

// Подарунок у хедері кошика веде сюди (CartDrawer)
watch(root, (el) => (cart.giftPicker.value = el), { immediate: true })
onBeforeUnmount(() => {
  if (cart.giftPicker.value === root.value) cart.giftPicker.value = null
})

defineExpose({ root })
</script>

<template>
  <section v-if="allowed > 0" ref="root" class="picker" :aria-labelledby="titleId">
    <div class="picker__head">
      <h3 :id="titleId" class="heading-s">{{ title }}</h3>
      <span v-if="!cart.samplesDeclined.value" class="picker__counter body-s" aria-live="polite">{{ picked }}/{{ allowed }}</span>
    </div>

    <!-- Відмова: замість карток — рядок з поверненням до вибору -->
    <p v-if="cart.samplesDeclined.value" class="picker__row body-s">
      <span>Ви відмовились від подарунків</span>
      <button class="picker__link link" type="button" @click="cart.resumeSamples()">Хочу подарунки</button>
    </p>

    <template v-else>
      <div class="picker__row body-s">
        <button class="picker__link link" type="button" @click="cart.declineSamples()">Відмовитись від подарунків</button>
      </div>

      <div ref="viewport" class="picker__viewport">
        <div ref="track" class="picker__track" role="group" :aria-labelledby="titleId" @scroll.passive="onTrackScroll">
          <GiftProductCard
            v-for="s in samples"
            :key="s.id"
            :title="s.title"
            :image="s.image"
            :is-new="s.isNew"
            :selected="cart.hasSample(s.id)"
            :disabled="limitReached && !cart.hasSample(s.id)"
            @click="toggle(s, $event)"
          />
        </div>
        <ScrollArrows :target="track" />
        <!-- Поява — всередині TapHint, коли кошик уже доїхав сюди; відхід — швидкий, щоб не заважати вибору -->
        <!-- type="transition": інакше Vue чекав би кінця анімації появи пальця (затримка + 0.3s) і прибирав його із запізненням -->
        <Transition name="picker-hint" type="transition">
          <TapHint v-if="showHint" class="picker__hint" :delay="700" :style="{ left: `${hintAt.left}px`, top: `${hintAt.top}px` }" />
        </Transition>
      </div>
    </template>
  </section>
</template>

<style scoped>
/* Виділено, як смужка промокоду (CartPromo → .promo::before): заливка neutral/100 (70%) і тонкі лінії
   border/strong зверху й знизу розходяться від центру й тануть до країв — на 214.5px в обидва боки.
   Лише вбік, не вгору-вниз: блок високий, і кругле світіння лишило б заголовок і картки на білому.
   Білі картки (outlined) стоять на заливці */
.picker {
  --line: transparent calc(50% - 214.5px), var(--border-strong) 50%, transparent calc(50% + 214.5px);
  --fill: transparent calc(50% - 214.5px), color-mix(in oklch, var(--neutral-100) 70%, transparent) 50%, transparent calc(50% + 214.5px);
  padding-block: var(--space-8);
  background:
    linear-gradient(to right, var(--line)) top / 100% var(--border-width-hairline) no-repeat,
    linear-gradient(to right, var(--line)) bottom / 100% var(--border-width-hairline) no-repeat,
    linear-gradient(to right, var(--fill));
}

.picker__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
  padding-inline: var(--space-5);
}

/* Відмова (або повернення до вибору) під заголовком */
.picker__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
  margin: var(--space-2) 0 0;
  padding-inline: var(--space-5);
  color: var(--fg-default);
}

.picker__link {
  position: relative;
  flex-shrink: 0;
}

/* Тап-зона до 32px заввишки, не рухаючи 16px рядок */
.picker__link::after {
  content: '';
  position: absolute;
  inset: -8px -12px;
}

.picker__link:focus-visible {
  outline: var(--border-width-focus) solid var(--border-focus);
  outline-offset: 2px;
  border-radius: var(--radius-xs);
}

.picker__counter {
  flex-shrink: 0;
  color: var(--fg-muted);
  font-variant-numeric: tabular-nums;
}

/* Стрілки (ScrollArrows) стоять по центру стрічки; 16px від «Відмовитись» до карток */
.picker__viewport {
  position: relative;
  margin-top: var(--space-4);
}

/* Та сама стрічка, що й у рекомендованих; 4px зверху й знизу — щоб пружина рамки обраної картки не обрізалась */
.picker__track {
  display: flex;
  gap: var(--space-3);
  padding: 4px var(--space-5);
  margin-block: -4px;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: var(--space-5);
  scrollbar-width: none;
  touch-action: pan-x pan-y;
}
.picker__track::-webkit-scrollbar {
  display: none;
}

/* Над картками й стрілками; кліки проходять крізь палець (TapHint) */
.picker__hint {
  z-index: 2;
}
.picker-hint-leave-active {
  transition: opacity 0.16s ease;
}
.picker-hint-leave-to {
  opacity: 0;
}
</style>
