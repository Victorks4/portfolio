export type PerformanceTier = 'low' | 'medium' | 'high'

export const ADAPTIVE_TIER_KEY = 'devsantos:adaptive-tier'
export const FPS_DEBUG_KEY = 'devsantos:fps-debug'

export type PerformanceConfig = {
  tier: PerformanceTier
  particleCount: number
  enableBloom: boolean
  enablePostShader: boolean
  pixelRatio: number
  enableLenis: boolean
  lenisDuration: number
  enableWebGL: boolean
  enableCrt: boolean
  /** Scrub contínuo nos títulos outline — só em tier high. */
  enableOutlineScrub: boolean
  /** Morph completo por seção — só em tier high. */
  enableSectionMorph: boolean
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

export function isFpsDebugEnabled(): boolean {
  if (typeof window === 'undefined') return false
  try {
    if (window.localStorage.getItem(FPS_DEBUG_KEY) === '1') return true
    return new URLSearchParams(window.location.search).get('debug') === 'fps'
  } catch {
    return false
  }
}

export function readAdaptiveTierOverride(): PerformanceTier | null {
  if (typeof window === 'undefined') return null
  try {
    const value = sessionStorage.getItem(ADAPTIVE_TIER_KEY)
    if (value === 'low' || value === 'medium' || value === 'high') {
      return value
    }
  } catch {
    // sessionStorage indisponível
  }
  return null
}

export function clearAdaptiveTierOverride(): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(ADAPTIVE_TIER_KEY)
  } catch {
    // sessionStorage indisponível
  }
}

export function downgradePerformanceTier(
  tier: PerformanceTier,
): PerformanceTier {
  if (tier === 'high') return 'medium'
  if (tier === 'medium') return 'low'
  return 'low'
}

const INTEGRATED_GPU_PATTERNS = [
  /intel/i,
  /iris/i,
  /uhd/i,
  /hd graphics/i,
  /radeon vega/i,
  /radeon\(tm\)\s*graphics/i,
  /apple gpu/i,
  /mali/i,
  /adreno/i,
]

export function detectIntegratedGpu(): boolean {
  if (typeof document === 'undefined') return false

  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl')
    if (!gl) return true

    const debugInfo = (gl as WebGLRenderingContext).getExtension(
      'WEBGL_debug_renderer_info',
    )
    if (!debugInfo) return true

    const renderer = (gl as WebGLRenderingContext).getParameter(
      debugInfo.UNMASKED_RENDERER_WEBGL,
    ) as string

    if (/nvidia|geforce|rtx|gtx|quadro/i.test(renderer)) return false
    if (/radeon rx|radeon pro|amd radeon rx/i.test(renderer)) return false

    return INTEGRATED_GPU_PATTERNS.some((pattern) => pattern.test(renderer))
  } catch {
    return true
  }
}

function scoreHardwareTier(): PerformanceTier {
  let score = 0

  const cores = navigator.hardwareConcurrency ?? 4
  if (cores >= 8) score += 2
  else if (cores >= 6) score += 1
  else if (cores <= 4) score -= 1

  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory
  if (memory !== undefined) {
    if (memory >= 8) score += 2
    else if (memory >= 4) score += 1
    else score -= 2
  }

  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection
  if (connection?.saveData) score -= 2

  if (isMobileViewport()) score -= 2
  if (isCoarsePointer()) score -= 1
  if (detectIntegratedGpu()) score -= 2

  if (score >= 4) return 'high'
  if (score <= 0) return 'low'
  return 'medium'
}

export function detectPerformanceTier(): PerformanceTier {
  if (typeof window === 'undefined') return 'medium'

  if (prefersReducedMotion()) return 'low'

  const adaptive = readAdaptiveTierOverride()
  if (adaptive) return adaptive

  if (detectIntegratedGpu()) return 'medium'

  return scoreHardwareTier()
}

export function getPerformanceConfig(
  tier: PerformanceTier = detectPerformanceTier(),
): PerformanceConfig {
  const reducedMotion = prefersReducedMotion()
  const mobile = isMobileViewport()
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1

  if (reducedMotion) {
    return {
      tier: 'low',
      particleCount: 0,
      enableBloom: false,
      enablePostShader: false,
      pixelRatio: 1,
      enableLenis: false,
      lenisDuration: 1,
      enableWebGL: false,
      enableCrt: false,
      enableOutlineScrub: false,
      enableSectionMorph: false,
    }
  }

  const configs: Record<
    PerformanceTier,
    Omit<
      PerformanceConfig,
      | 'tier'
      | 'enableLenis'
      | 'lenisDuration'
      | 'enableWebGL'
      | 'enableCrt'
      | 'enableOutlineScrub'
      | 'enableSectionMorph'
    >
  > = {
    high: {
      particleCount: 18_000,
      enableBloom: true,
      enablePostShader: true,
      pixelRatio: Math.min(dpr, 2),
    },
    medium: {
      particleCount: 6_000,
      enableBloom: false,
      enablePostShader: false,
      pixelRatio: Math.min(dpr, 1.25),
    },
    low: {
      particleCount: 2_500,
      enableBloom: false,
      enablePostShader: false,
      pixelRatio: 1,
    },
  }

  const base = configs[tier]

  return {
    tier,
    ...base,
    enableLenis: tier !== 'low',
    lenisDuration: tier === 'high' ? 1.2 : mobile ? 0.9 : 1,
    enableWebGL: true,
    enableCrt: tier !== 'low',
    enableOutlineScrub: tier !== 'low',
    enableSectionMorph: tier === 'high',
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
