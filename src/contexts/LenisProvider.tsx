import { useCallback, useEffect, useMemo, useState } from 'react'
import Lenis from 'lenis'
import { LenisContext } from './lenisContext'
import {
  applyPerformanceBodyClass,
  detectPerformanceTier,
  getPerformanceConfig,
  type PerformanceConfig,
  type PerformanceTier,
} from '../utils/performanceTier'
import { scrollToAnchor, scrollWhenAnchorReady } from '../utils/scrollAnchor'

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTier] = useState<PerformanceTier>(() => detectPerformanceTier())

  const perfConfig = useMemo<PerformanceConfig>(
    () => getPerformanceConfig(tier),
    [tier],
  )

  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    const removePerfClass = applyPerformanceBodyClass(perfConfig.tier)

    if (!perfConfig.enableLenis) {
      queueMicrotask(() => setLenis(null))
      return removePerfClass
    }

    const instance = new Lenis({
      duration: perfConfig.lenisDuration,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    })
    queueMicrotask(() => setLenis(instance))

    return () => {
      instance.destroy()
      queueMicrotask(() => setLenis(null))
      removePerfClass()
    }
  }, [perfConfig])

  const scrollToHash = useCallback(
    (hash: string) => {
      const didScroll = scrollToAnchor(hash, lenis, {
        immediate: false,
        duration: perfConfig.lenisDuration + 0.3,
      })
      if (!didScroll) {
        scrollWhenAnchorReady(hash, lenis, {
          immediate: false,
          maxWaitMs: 2000,
        })
      }
    },
    [lenis, perfConfig.lenisDuration],
  )

  const applyTier = useCallback((next: PerformanceTier) => {
    setTier(next)
  }, [])

  const value = useMemo(
    () => ({
      lenis,
      scrollToHash,
      perfConfig,
      applyTier,
    }),
    [lenis, scrollToHash, perfConfig, applyTier],
  )

  return (
    <LenisContext.Provider value={value}>{children}</LenisContext.Provider>
  )
}
