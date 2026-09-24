// Анімації, що змінюють компоновку (висота рядка кошика, розкриття набору).
//
// Їх веде JS, а не CSS-перехід: кожну довжину можна округлити до цілого фізичного
// пікселя. Усе, що нижче, тоді зсувається рівно на цілі пікселі, а не повзе
// субпікселями, які на iPhone растеризуються щокадру трохи інакше.

/** Той самий характер, що й у cubic-bezier(0.2, 0.8, 0.2, 1): різкий старт, довгий доїзд */
export const easeOut = (t: number) => 1 - (1 - t) ** 4

/** Довжина, округлена до цілого фізичного пікселя */
export function snap(px: number) {
  const dpr = window.devicePixelRatio || 1
  return Math.round(px * dpr) / dpr
}

/**
 * Прогрес 0 → 1 на requestAnimationFrame. Відлік іде від першого кадру: мітка rAF
 * буває раніше за момент виклику, і тоді прогрес на старті виходив би від'ємним.
 * Повертає функцію скасування.
 */
export function tween(duration: number, onFrame: (p: number) => void, onDone?: () => void, ease = easeOut) {
  let start = -1
  let id = requestAnimationFrame(function step(now) {
    if (start < 0) start = now
    const t = Math.min(1, (now - start) / duration)
    onFrame(ease(t))
    if (t < 1) id = requestAnimationFrame(step)
    else onDone?.()
  })
  return () => cancelAnimationFrame(id)
}
