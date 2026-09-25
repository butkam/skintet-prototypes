import { prefersReducedMotion, spring } from '@/motion/spring'

/** A screen's big icon arriving: grows from small with a slight turn and a springy settle */
export function popIn(el: Element | null | undefined) {
  if (prefersReducedMotion() || !el) return
  const s = spring({ stiffness: 260, damping: 14, mass: 1 })
  el.animate([{ transform: 'scale(0.4) rotate(-12deg)', opacity: 0 }, { transform: 'scale(1) rotate(0)', opacity: 1 }], {
    duration: s.duration,
    easing: s.easing,
  })
}
