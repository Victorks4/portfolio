import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLenisContext } from './useLenisContext'

/**
 * Ao trocar de rota, leva o scroll para o topo (ou para o hash alvo) e recalcula
 * os ScrollTriggers, já que a altura do documento muda por completo.
 */
export function useRouteScrollReset() {
  const { pathname, hash } = useLocation()
  const { lenis, scrollToHash } = useLenisContext()

  useEffect(() => {
    // Hash presente significa "voltar para a home numa seção específica".
    if (hash) {
      const id = window.setTimeout(() => scrollToHash(hash), 160)
      return () => window.clearTimeout(id)
    }

    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }

    const id = window.setTimeout(() => ScrollTrigger.refresh(), 160)
    return () => window.clearTimeout(id)
  }, [pathname, hash, lenis, scrollToHash])
}
