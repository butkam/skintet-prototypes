// Damped-spring easing for the Web Animations API / CSS, via `linear()`.
// Physics: m·x'' + c·x' + k·x = 0, starting at 1 and settling at 0 → progress = 1 - x.

export type SpringOptions = {
  stiffness?: number
  damping?: number
  mass?: number
  /** Initial velocity in progress-units per second (e.g. from a released drag). */
  velocity?: number
}

export type Spring = { easing: string; duration: number }

const cache = new Map<string, Spring>()

export function spring({ stiffness = 300, damping = 20, mass = 1, velocity = 0 }: SpringOptions = {}): Spring {
  const key = `${stiffness}|${damping}|${mass}|${velocity}`
  const hit = cache.get(key)
  if (hit) return hit

  const step = 1 / 120
  const restDelta = 0.001
  const maxTime = 3
  let x = 1
  let v = -velocity
  let t = 0
  let settledFor = 0
  const values: number[] = [0]

  while (t < maxTime) {
    const a = (-stiffness * x - damping * v) / mass
    v += a * step
    x += v * step
    t += step
    values.push(1 - x)
    settledFor = Math.abs(x) < restDelta && Math.abs(v) < restDelta * 10 ? settledFor + step : 0
    if (settledFor > 0.05) break
  }
  values[values.length - 1] = 1

  // Downsample to keep the linear() string compact while preserving overshoot.
  const points = 64
  const stride = Math.max(1, Math.floor(values.length / points))
  const sampled: string[] = []
  for (let i = 0; i < values.length; i += stride) sampled.push(values[i].toFixed(4))
  if (sampled[sampled.length - 1] !== '1.0000') sampled.push('1')

  const result = { easing: `linear(${sampled.join(', ')})`, duration: Math.round(t * 1000) }
  cache.set(key, result)
  return result
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Presets tuned for this project */
export const springs = {
  /** Toast entrance — noticeable bounce */
  bouncy: { stiffness: 260, damping: 16, mass: 1 },
  /** Snap back after a cancelled drag */
  snappy: { stiffness: 500, damping: 30, mass: 1 },
  /** Small pops (badge, pulse) */
  pop: { stiffness: 600, damping: 14, mass: 1 },
} satisfies Record<string, SpringOptions>
