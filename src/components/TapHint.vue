<script setup lang="ts">
// Figma 319:4830 — підказка «зверніть увагу сюди»: палець-емоджі ☝️, нахилений до вмісту,
// тупцяє вздовж своєї осі, а з кожним дотиком під кінчиком розходяться кола, як по воді.
// Палець — картинка, а не символ: емоджі в кожній системі мальовані по-своєму, і кінчик
// опинявся в різних місцях. Fluent Emoji 3D від Microsoft, MIT (assets/emoji/LICENSE-fluentui-emoji.txt)
import finger from '@/assets/emoji/index-pointing-up.png'

// Точка (0, 0) компонента — кінчик пальця: батько ставить його туди, куди треба показати.
// Лише декор — ні фокусу, ні кліків, скрінрідер його не бачить.
withDefaults(
  defineProps<{
    /** Нахил пальця: 0 — вгору, від'ємний — ліворуч */
    angle?: number
    /** Через скільки мс після вставки палець проявиться й почне перший тик */
    delay?: number
  }>(),
  { angle: -40, delay: 0 },
)
</script>

<template>
  <span class="tap-hint" :style="{ '--start': `${delay}ms` }" aria-hidden="true">
    <span class="tap-hint__ripples">
      <span v-for="i in 3" :key="i" class="tap-hint__ring" :style="{ '--i': i - 1 }" />
    </span>
    <span class="tap-hint__hand" :style="{ transform: `rotate(${angle}deg)` }">
      <img class="tap-hint__finger" :src="finger" alt="" draggable="false" />
    </span>
  </span>
</template>

<style scoped>
.tap-hint {
  /* Один такт: палець підходить, торкається (36%), затримується й відходить. Кола — з миті дотику */
  --beat: 1.4s;
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
  /* Поява — це перший тик: палець проявляється, поки підходить до вмісту, і з дотиком уже видимий.
     Окремого скейлу нема, тож нічого не накладається на сам рух */
  animation: tap-hint-in 0.3s ease var(--start) backwards;
}

@keyframes tap-hint-in {
  from {
    opacity: 0;
  }
}

/* ---------- Розводи: 3 кола з одного центру, кожне ширше й пізніше за попереднє ---------- */

.tap-hint__ripples {
  position: absolute;
  inset: 0;
}

.tap-hint__ring {
  --size: calc(28px + var(--i) * 18px);
  position: absolute;
  left: calc(var(--size) / -2);
  top: calc(var(--size) / -2);
  width: var(--size);
  height: var(--size);
  border-radius: var(--radius-full);
  border: 1.5px solid var(--fg-default);
  background: oklch(22.21% 0 0 / 0.04);
  opacity: 0;
  animation: tap-hint-ripple var(--beat) cubic-bezier(0.2, 0.7, 0.3, 1) calc(var(--start) + var(--i) * 90ms) infinite;
}

@keyframes tap-hint-ripple {
  0%,
  35.9% {
    transform: scale(0.2);
    opacity: 0;
  }
  36% {
    transform: scale(0.2);
    opacity: 0.55;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

/* ---------- Палець: нахил на обгортці, рух — уздовж власної осі ---------- */

.tap-hint__hand {
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: 0 0;
}

/* Подушечка пальця в картинці — на 71% ширини й 16% висоти (кінчик — на 10.5%); її й ставимо в (0, 0).
   Картинка з прозорими полями навколо руки, тож тінь нічим не обрізається */
.tap-hint__finger {
  --size: 72px;
  position: absolute;
  left: calc(var(--size) * -0.71);
  top: calc(var(--size) * -0.16);
  width: var(--size);
  height: var(--size);
  max-width: none;
  user-select: none;
  /* backwards: до старту палець стоїть відведеним — з цієї точки й починається перший тик */
  animation: tap-hint-poke var(--beat) cubic-bezier(0.45, 0, 0.3, 1) var(--start) infinite backwards;
  /* Легка тінь, щоб жовтий палець не губився на світлих картках */
  filter: drop-shadow(0 4px 8px oklch(22.21% 0 0 / 0.16));
}

@keyframes tap-hint-poke {
  0% {
    transform: translateY(14px);
  }
  36% {
    transform: translateY(0);
  }
  52% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(14px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .tap-hint__finger {
    animation: none;
  }
  /* Без руху — одне тихе коло на місці дотику */
  .tap-hint__ring {
    animation: none;
  }
  .tap-hint__ring:first-child {
    opacity: 0.3;
  }
}
</style>
