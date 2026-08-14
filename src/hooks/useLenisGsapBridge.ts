import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'
import type Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

/**
 * Liga o RAF do Lenis ao ticker do GSAP e mantém o ScrollTrigger sincronizado.
 * Vive no layout (e não numa rota) para o smooth scroll sobreviver à troca de página.
 */
export function useLenisGsapBridge(lenis: Lenis | null) {
  useEffect(() => {
    if (!lenis) return

    const tickerFn = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0)

    const offScroll = lenis.on('scroll', ScrollTrigger.update)

    return () => {
      gsap.ticker.remove(tickerFn)
      offScroll()
    }
  }, [lenis])
}
