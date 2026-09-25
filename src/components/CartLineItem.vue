<script setup lang="ts">
// Figma nodes 132:6137 (товар з подарунком), 132:6163 / 132:6183 (набір), 132:6233 (семпл)
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import SkIcon from './SkIcon.vue'
import { formatPrice, pluralItems, type CartLine } from '@/data/catalog'
import { prefersReducedMotion } from '@/motion/spring'
import { snap, tween } from '@/motion/tween'

const props = defineProps<{ line: CartLine }>()
const emit = defineEmits<{ increment: []; decrement: []; toggle: [] }>()

// Gift samples: one of each — removable, but the quantity can't grow
const single = computed(() => props.line.kind === 'sample')
const setCount = computed(() => props.line.setItems?.length ?? 0)

/* ---------- Розкриття складу набору ---------- */

// Висоту веде скрипт, кроками по цілому фізичному пікселю (див. motion/tween).
// Склад не має власної анімації: він нерухомий усередині контейнера, що росте,
// і просто відкривається, як шухляда. Коли склад проявлявся ще й прозорістю та
// зсувом, WebKit виносив його в окремий шар, обрізаний контейнером змінної висоти,
// і на iPhone сам список дрижав.
const setBox = ref<HTMLElement | null>(null)
let cancel: (() => void) | undefined

// flush 'pre': міряємо стару висоту до того, як клас is-open її змінить
watch(
  () => props.line.expanded,
  (open) => {
    const box = setBox.value
    if (!box) return
    cancel?.()
    if (prefersReducedMotion()) {
      box.style.height = ''
      return
    }

    const from = box.getBoundingClientRect().height
    const to = open ? box.scrollHeight : 0
    box.style.height = `${from}px`
    cancel = tween(
      350,
      (p) => (box.style.height = `${snap(from + (to - from) * p)}px`),
      // Далі висоту знову тримає клас: auto для відкритого, 0 для закритого
      () => (box.style.height = ''),
    )
  },
)
onBeforeUnmount(() => cancel?.())
</script>

<template>
  <article class="line" :class="`line--${line.kind}`">
    <div class="line__top">
      <img class="line__thumb" :src="line.image" alt="" />
      <div class="line__info">
        <h3 class="line__title heading-s">{{ line.title }}</h3>
        <p v-if="line.description && line.kind !== 'set'" class="line__desc body-s">{{ line.description }}</p>

        <template v-if="line.kind === 'set'">
          <button
            class="line__set-toggle body-s"
            type="button"
            :aria-expanded="line.expanded"
            @click="emit('toggle')"
          >
            {{ setCount }} {{ pluralItems(setCount) }} в наборі
            <SkIcon name="ChevronDownSmall" :size="16" class="line__chevron" :class="{ 'is-open': line.expanded }" />
          </button>
          <div ref="setBox" class="line__set" :class="{ 'is-open': line.expanded }">
            <ul class="line__set-list">
              <li v-for="(item, i) in line.setItems" :key="i" class="line__set-item">
                <img class="line__set-thumb" :src="item.image" alt="" />
                <span class="body-s">{{ item.title }}</span>
              </li>
            </ul>
          </div>
        </template>
      </div>
    </div>

    <div v-if="line.gift" class="line__gift">
      <!-- Фото подарунка, як у прев'ю складу набору; іконка лишається запасним варіантом -->
      <img v-if="line.gift.image" class="line__gift-thumb" :src="line.gift.image" alt="" />
      <span v-else class="line__gift-icon"><SkIcon name="GiftSmallDark" :size="16" /></span>
      <span class="line__gift-title body-s">{{ line.gift.title }}</span>
      <span class="line__gift-price heading-s">{{ formatPrice(line.gift.price) }}</span>
    </div>

    <div class="line__controls">
      <div class="qty">
        <button
          class="qty__btn"
          type="button"
          :aria-label="line.qty > 1 ? 'Зменшити кількість' : 'Видалити товар'"
          @click="emit('decrement')"
        >
          <!-- Trash drawn smaller than +/− (it reads heavier); the 32px button and 44px tap area stay -->
          <SkIcon
            :name="line.qty > 1 ? 'MinusMedium' : 'TrashCan'"
            :size="line.qty === 1 ? 28 : 32"
          />
        </button>
        <span class="qty__value body-l" aria-live="polite">{{ line.qty }}</span>
        <button class="qty__btn" type="button" :disabled="single" aria-label="Збільшити кількість" @click="emit('increment')">
          <SkIcon :name="single ? 'PlusMediumDisabled' : 'PlusMedium'" :size="32" />
        </button>
      </div>
      <div class="line__prices">
        <s v-if="line.oldPrice" class="line__old-price">{{ formatPrice(line.oldPrice * line.qty) }}</s>
        <span class="heading-s">{{ formatPrice(line.price * line.qty) }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
/* The thumbnail is taken out of flow: the text column, gift and controls keep the same gaps
   whatever the text length, and the row only grows to fit the image when the content is shorter */
.line {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-3);
  min-height: calc(var(--thumbnail-sample) + var(--space-5));
  padding-bottom: var(--space-5);
  border-bottom: var(--border-width-hairline) solid var(--border-default);
  background: var(--bg-canvas);
}

.line__top {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.line__thumb {
  position: absolute;
  top: 0;
  left: 0;
  width: var(--thumbnail-sample);
  height: var(--thumbnail-sample);
  border-radius: var(--radius-sm);
  object-fit: cover;
}

/* Text column always fills everything right of the thumbnail (16px gutter), at any screen width */
.line__info,
.line__controls {
  width: calc(100% - var(--thumbnail-sample) - var(--space-4));
}

.line__info {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  min-width: 0;
}

.line__title,
.line__desc {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.line__desc {
  color: var(--fg-muted);
}

/* ---------- Set ---------- */

.line__set-toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  align-self: flex-start;
  margin: -6px -8px;
  padding: 6px 8px;
  color: var(--fg-muted);
  transition: color 0.15s ease;
}

.line__chevron {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.line__chevron.is-open {
  transform: scaleY(-1);
}

/* Висоту під час руху веде скрипт (див. setBox); у спокої її тримає клас */
.line__set {
  height: 0;
  overflow: hidden;
}
.line__set.is-open {
  height: auto;
}

/* Відступ зверху постійний: інакше перемикання класу міняло б висоту
   ще до того, як скрипт її поміряє */
.line__set-list {
  margin: 0;
  padding: var(--space-2) 0 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.line__set-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
  color: var(--fg-muted);
}

.line__set-item span {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.line__set-thumb {
  flex-shrink: 0;
  width: var(--icon-md);
  height: var(--icon-md);
  border-radius: var(--radius-sm);
  background: var(--bg-surface);
  object-fit: cover;
}

/* ---------- Gift pill ---------- */

.line__gift {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  /* Starts 4px left of the text column, as in the design */
  width: calc(100% - var(--thumbnail-sample) - var(--space-3));
  padding: var(--space-2) 0 var(--space-2) var(--space-2);
  /* Концентрично до фото: його скруглення + відступ від краю пілюлі */
  border-radius: calc(var(--radius-sm) + var(--space-2)) 0 0 calc(var(--radius-sm) + var(--space-2));
  background: linear-gradient(to right, var(--bg-surface), color-mix(in oklch, var(--bg-surface) 0%, transparent));
}

.line__gift-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: var(--icon-md);
  height: var(--icon-md);
  border-radius: var(--radius-full);
  background: var(--neutral-0);
}

/* Same 24px square as the set previews */
.line__gift-thumb {
  flex-shrink: 0;
  width: var(--icon-md);
  height: var(--icon-md);
  border-radius: var(--radius-sm);
  background: var(--neutral-0);
  object-fit: cover;
}

.line__gift-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--fg-muted);
}

.line__gift-price {
  flex-shrink: 0;
  white-space: nowrap;
}

/* ---------- Controls ---------- */

.line__controls {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

/* Row is bottom-aligned (old price stacks above the price); pull the 32px stepper down
   by (32 − 20) / 2 so its centre lines up with the 20px current-price line */
.qty {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: calc((32px - var(--font-line-height-sm)) / -2);
}

.qty__btn {
  position: relative;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  transition: transform 0.15s ease, background-color 0.15s ease;
}
/* Extend tap target to 44px without shifting layout */
.qty__btn::after {
  content: '';
  position: absolute;
  inset: calc((32px - var(--control-tap-target-min)) / 2);
}
.qty__btn:active:not(:disabled) {
  transform: scale(0.85);
}
.qty__btn:disabled {
  cursor: default;
}
/* Лише там, де справді наводять мишею: на iOS тап лишає :hover «залиплим» (див. SkButton) */
@media (hover: hover) and (pointer: fine) {
  .qty__btn:hover:not(:disabled) {
    background: var(--action-secondary-bg-hover);
  }
  .line__set-toggle:hover {
    color: var(--fg-default);
  }
}
.qty__btn:focus-visible {
  outline: var(--border-width-focus) solid var(--border-focus);
}

.qty__value {
  min-width: 1ch;
  text-align: center;
  font-variant-numeric: tabular-nums;
}
.line__prices {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-1);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.line__old-price {
  font-family: var(--font-family-text);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  color: var(--fg-muted);
}
</style>
