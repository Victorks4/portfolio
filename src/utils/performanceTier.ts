export type PerformanceTier = 'low' | 'medium' | 'high'

export type PerformanceConfig = {
  tier: PerformanceTier
  particleCount: number
  enableBloom: boolean
  enablePostShader: boolean
  pixelRatio: number
  enableLenis: boolean
  lenisDuration: number
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function isCoarsePointer(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(pointer: coarse)').matches
}

function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

export function detectPerformanceTier(): PerformanceTier {
  if (typeof window === 'undefined') return 'medium'

  if (prefersReducedMotion()) return 'low'

  let score = 0

  const cores = navigator.hardwareConcurrency ?? 4
  if (cores >= 8) score += 2
  else if (cores >= 6) score += 1
  else if (cores <= 4) score -= 1

  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  if (memory !== undefined) {
    if (memory >= 8) score += 2
    else if (memory >= 4) score += 1
    else score -= 2
  }

  if (isMobileViewport()) score -= 2
  if (isCoarsePointer()) score -= 1

  if (score >= 3) return 'high'
  if (score <= -1) return 'low'
  return 'medium'
}

export function getPerformanceConfig(tier: PerformanceTier = detectPerformanceTier()): PerformanceConfig {
  const reducedMotion = prefersReducedMotion()
  const mobile = isMobileViewport()
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1

  const configs: Record<PerformanceTier, Omit<PerformanceConfig, 'tier' | 'enableLenis' | 'lenisDuration'>> = {
    high: {
      particleCount: 25_000,
      enableBloom: true,
      enablePostShader: true,
      pixelRatio: Math.min(dpr, 2),
    },
    medium: {
      particleCount: 12_000,
      enableBloom: false,
      enablePostShader: true,
      pixelRatio: Math.min(dpr, 1.5),
    },
    low: {
      particleCount: 6_000,
      enableBloom: false,
      enablePostShader: false,
      pixelRatio: 1,
    },
  }

  const base = configs[tier]

  return {
    tier,
    ...base,
    enableLenis: !reducedMotion && tier !== 'low',
    lenisDuration: tier === 'high' ? 1.2 : mobile ? 0.9 : 1,
  }
}

export function applyPerformanceBodyClass(tier: PerformanceTier): () => void {
  if (typeof document === 'undefined') return () => undefined

  const body = document.body
  body.classList.remove('perf-low', 'perf-medium', 'perf-high')
  body.classList.add(`perf-${tier}`)

  return () => {
    body.classList.remove('perf-low', 'perf-medium', 'perf-high')
  }
}
