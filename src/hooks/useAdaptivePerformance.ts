import { useEffect } from 'react'
import type { PerformanceTier } from '../utils/performanceTier'
import {
  ADAPTIVE_TIER_KEY,
  downgradePerformanceTier,
  readAdaptiveTierOverride,
} from '../utils/performanceTier'

const SAMPLE_MS = 3000
const MIN_FPS = 40
const MIN_SAMPLES = 45
const WARMUP_MS = 5000

type Params = {
  tier: PerformanceTier
  onTierDowngrade: (next: PerformanceTier) => void
}

/**
 * Mede FPS durante scroll; rebaixa o tier só em máquinas high que não sustentam.
 */
export function useAdaptivePerformance({ tier, onTierDowngrade }: Params) {
  useEffect(() => {
    if (tier !== 'high') return
    if (readAdaptiveTierOverride()) return

    const mountedAt = performance.now()
    let raf = 0
    let frames = 0
    let sampleStart = 0
    let sampling = false
    let scrollTimer: ReturnType<typeof setTimeout> | null = null

    const finishSample = (now: number) => {
      if (!sampling || frames < MIN_SAMPLES) {
        sampling = false
        frames = 0
        return
      }

      const elapsed = now - sampleStart
      const avgFps = (frames * 1000) / elapsed
      sampling = false
      frames = 0

      if (avgFps >= MIN_FPS) return

      const next = downgradePerformanceTier(tier)
      if (next === tier) return

      try {
        sessionStorage.setItem(ADAPTIVE_TIER_KEY, next)
      } catch {
        // sessionStorage indisponível
      }
      onTierDowngrade(next)
      window.location.reload()
    }

    const onScroll = () => {
      if (performance.now() - mountedAt < WARMUP_MS) return

      if (scrollTimer) clearTimeout(scrollTimer)

      if (!sampling) {
        sampling = true
        sampleStart = performance.now()
        frames = 0

        const tick = (now: number) => {
          if (!sampling) return
          frames += 1
          if (now - sampleStart >= SAMPLE_MS) {
            finishSample(now)
            return
          }
          raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      }

      scrollTimer = setTimeout(() => {
        if (sampling) finishSample(performance.now())
      }, SAMPLE_MS + 200)
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      if (scrollTimer) clearTimeout(scrollTimer)
    }
  }, [tier, onTierDowngrade])
}
