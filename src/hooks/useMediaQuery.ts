import { useCallback, useSyncExternalStore } from 'react'

const NOOP = () => () => {}

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (typeof window === 'undefined' || !window.matchMedia) return NOOP()
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onStoreChange)
      return () => mql.removeEventListener('change', onStoreChange)
    },
    [query],
  )

  const getSnapshot = useCallback(
    () =>
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia(query).matches
        : false,
    [query],
  )

  return useSyncExternalStore(subscribe, getSnapshot, () => false)
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
