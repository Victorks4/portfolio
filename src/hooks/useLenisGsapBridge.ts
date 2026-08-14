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
    if (!lenis) {
      const onScroll = () => ScrollTrigger.update()
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll, { passive: true })
      return () => {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)
      }
    }

    const root = document.documentElement

    ScrollTrigger.scrollerProxy(root, {
      scrollTop(value) {
        if (arguments.length && value != null) {
          lenis.scrollTo(value, { immediate: true })
        }
        return lenis.scroll
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }
      },
      pinType: root.style.transform ? 'transform' : 'fixed',
    })

    const tickerFn = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0)

    const offScroll = lenis.on('scroll', ScrollTrigger.update)

    const onRefresh = () => {
      lenis.resize()
    }
    ScrollTrigger.addEventListener('refresh', onRefresh)
    ScrollTrigger.refresh()

    return () => {
      ScrollTrigger.removeEventListener('refresh', onRefresh)
      ScrollTrigger.scrollerProxy(root, {})
      gsap.ticker.remove(tickerFn)
      offScroll()
    }
  }, [lenis])
}
