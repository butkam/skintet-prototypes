<script setup lang="ts">
// Figma nodes 132:6137 (товар з подарунком), 132:6163 / 132:6183 (набір), 132:6233 (семпл)
import { computed } from 'vue'
import SkIcon from './SkIcon.vue'
import { formatPrice, pluralItems, type CartLine } from '@/data/catalog'

const props = defineProps<{ line: CartLine }>()
const emit = defineEmits<{ increment: []; decrement: []; toggle: [] }>()

// Gift samples: one of each — removable, but the quantity can't grow
const single = computed(() => props.line.kind === 'sample')
const setCount = computed(() => props.line.setItems?.length ?? 0)
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
          <div class="line__set" :class="{ 'is-open': line.expanded }">
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
}

.line__chevron {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.line__chevron.is-open {
  transform: scaleY(-1);
}

/* Height animation via grid 0fr → 1fr */
.line__set {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.line__set.is-open {
  grid-template-rows: 1fr;
}

.line__set-list {
  min-height: 0;
  overflow: hidden;
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.line__set.is-open .line__set-list {
  padding-top: var(--space-2);
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
  transition: transform 0.15s ease;
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
