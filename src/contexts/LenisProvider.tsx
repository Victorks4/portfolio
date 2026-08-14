import { useCallback, useEffect, useMemo, useState } from 'react'
import Lenis from 'lenis'
import { LenisContext } from './lenisContext'
import {
  applyPerformanceBodyClass,
  detectPerformanceTier,
  getPerformanceConfig,
  type PerformanceConfig,
} from '../utils/performanceTier'

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const [perfConfig] = useState<PerformanceConfig>(() =>
    getPerformanceConfig(detectPerformanceTier()),
  )

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
      if (!lenis) {
        const el = document.querySelector(hash)
        el?.scrollIntoView({ behavior: 'smooth' })
        return
      }
      lenis.scrollTo(hash, {
        duration: perfConfig.lenisDuration + 0.3,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      })
    },
    [lenis, perfConfig.lenisDuration],
  )

  const value = useMemo(
    () => ({ lenis, scrollToHash, perfConfig }),
    [lenis, scrollToHash, perfConfig],
  )

  return (
    <LenisContext.Provider value={value}>{children}</LenisContext.Provider>
  )
}
