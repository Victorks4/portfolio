import { useCallback, useEffect, useMemo, useState } from 'react'
import Lenis from 'lenis'
import { LenisContext } from './lenisContext'

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    })
    queueMicrotask(() => setLenis(instance))
    return () => {
      instance.destroy()
      queueMicrotask(() => setLenis(null))
    }
  }, [])

  const scrollToHash = useCallback(
    (hash: string) => {
      if (!lenis) {
        const el = document.querySelector(hash)
        el?.scrollIntoView({ behavior: 'smooth' })
        return
      }
      lenis.scrollTo(hash, {
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      })
    },
    [lenis],
  )

  const value = useMemo(
    () => ({ lenis, scrollToHash }),
    [lenis, scrollToHash],
  )

  return (
    <LenisContext.Provider value={value}>{children}</LenisContext.Provider>
  )
}
