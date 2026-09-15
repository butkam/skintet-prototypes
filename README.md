# Skin(tet) · Prototypes

Робочі прототипи мобільного веб e-commerce Skin(tet) (косметика). Vue 3 + Vite + TypeScript + vue-router.

Дизайн: [Figma · Skin(tet) · Checkout](https://www.figma.com/design/Ezs4oEkDbws55FK7c6kfrL/Skin-tet--%C2%B7-Checkout)

## Посилання

https://butkam.github.io/skintet-prototypes/ — оновлюється автоматично після кожного push у `main` (GitHub Actions → Pages).

## Запуск

```bash
npm install
npm run dev
```

`--host` уже увімкнено — відкривай адресу з `Network:` на телефоні в тій самій Wi‑Fi.

## Структура

- `src/styles/tokens.css` — усі змінні з Figma (Primitives, Semantic Color, Spacing, Radius, Sizing, Typography, Elevation). `bg/canvas` → `--bg-canvas`.
- `src/styles/typography.css` — текстові стилі: `.display-*`, `.heading-*`, `.body-l/m/s`.
- `src/components/` — компоненти дизайн-системи (`SkButton`, `SkIcon`, `AppNavigation`).
- `src/views/` — екрани-прототипи. Новий прототип = новий файл у `views/` + маршрут у `src/router/index.ts`.
- `public/fonts/` — Sailec, Nib Pro (ліцензійні шрифти, не публікувати у відкритий доступ).
