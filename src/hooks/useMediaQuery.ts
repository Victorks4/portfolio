import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const getMatch = () =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(query).matches
      : false

  const [matches, setMatches] = useState(getMatch)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia(query)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    setMatches(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export type Breakpoint = 'mobile' | 'tablet' | 'desktop'

/**
 * Retorna o breakpoint atual baseado em largura de viewport.
 * - mobile:  < 768px
 * - tablet:  768-1024px
 * - desktop: > 1024px
 */
export function useBreakpoint(): Breakpoint {
  const isMobile = useMediaQuery('(max-width: 767.98px)')
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1024px)')
  if (isMobile) return 'mobile'
  if (isTablet) return 'tablet'
  return 'desktop'
}

/** Atalho para detectar dispositivo apontador "touch" (sem precisão). */
export function useIsTouch(): boolean {
  return useMediaQuery('(hover: none) and (pointer: coarse)')
}
