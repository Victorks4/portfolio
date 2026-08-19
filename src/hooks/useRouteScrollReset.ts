import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useLenisContext } from './useLenisContext'
import { forceReturnToProjectsCarousel } from '../utils/projectsScrollRestore'
import {
  clearPendingReturnToProjects,
  commitPathnameNavigation,
  markWasOnProjectPage,
  shouldIgnoreHashNavigation,
  shouldReturnToProjects,
} from '../utils/routeNavigation'
import {
  clearProjectsScrollY,
  clearScrollTarget,
  peekScrollTarget,
} from '../utils/scrollTarget'
import {
  resolveScrollTarget,
  scrollToElement,
  scrollWhenSelectorReady,
} from '../utils/scrollAnchor'
import { scheduleScrollTriggerRefresh } from '../utils/scrollTriggerRefresh'

gsap.registerPlugin(ScrollTrigger)

const PROJECTS_SELECTOR = resolveScrollTarget('#projects')

function scrollToY(
  lenis: ReturnType<typeof useLenisContext>['lenis'],
  y: number,
  immediate = true,
): void {
  if (lenis) {
    lenis.scrollTo(y, { immediate })
  }
  window.scrollTo({ top: y, left: 0, behavior: 'auto' })
}

type ScrollWhenReadyOptions = {
  immediate?: boolean
  maxWaitMs?: number
}

function scrollWhenReady(
  selector: string,
  lenis: ReturnType<typeof useLenisContext>['lenis'],
  options?: ScrollWhenReadyOptions,
): () => void {
  const immediate = options?.immediate ?? true
  const maxWaitMs = options?.maxWaitMs ?? 1000
  const started = performance.now()
  let frame = 0
  let cancelled = false

  const attempt = () => {
    if (cancelled) return

    const el = document.querySelector(selector)
    if (el) {
      ScrollTrigger.refresh()
      scrollToElement(lenis, el as HTMLElement, { immediate })
      return
    }

    if (performance.now() - started < maxWaitMs) {
      frame = window.requestAnimationFrame(attempt)
    }
  }

  frame = window.requestAnimationFrame(attempt)

  return () => {
    cancelled = true
    window.cancelAnimationFrame(frame)
  }
}

function resetToTop(
  lenis: ReturnType<typeof useLenisContext>['lenis'],
): void {
  scrollToY(lenis, 0, true)
  window.requestAnimationFrame(() => {
    scrollToY(lenis, 0, true)
  })
}

function resetProjectPage(
  lenis: ReturnType<typeof useLenisContext>['lenis'],
): () => void {
  resetToTop(lenis)

  const heroCleanup = scrollWhenReady('#project-hero', lenis, {
    immediate: true,
  })

  scheduleScrollTriggerRefresh(200)

  return () => {
    heroCleanup()
  }
}

function resolveHomeScrollTarget(hash: string): string | null {
  if (shouldReturnToProjects()) {
    return PROJECTS_SELECTOR
  }

  const storedTarget = peekScrollTarget()
  if (storedTarget) {
    return storedTarget
  }

  if (hash) {
    return resolveScrollTarget(hash)
  }

  return null
}

function scheduleReturnToProjectsClear(): void {
  window.setTimeout(() => {
    clearPendingReturnToProjects()
    clearProjectsScrollY()
  }, 1500)
}

function restoreProjectsIfNeeded(
  lenis: ReturnType<typeof useLenisContext>['lenis'],
  onDone?: () => void,
): (() => void) | undefined {
  if (!shouldReturnToProjects()) return undefined

  return forceReturnToProjectsCarousel(lenis, () => {
    scheduleReturnToProjectsClear()
    scheduleScrollTriggerRefresh(120)
    onDone?.()
  })
}

/**
 * Ao trocar de rota, coordena scroll para o topo, seção alvo ou case study.
 * Evita corrida entre Lenis, hash da URL e restauração nativa do browser.
 */
export function useRouteScrollReset() {
  const { pathname, hash } = useLocation()
  const { lenis } = useLenisContext()
  const handledHashRef = useRef('')
  const pathnameRef = useRef(pathname)
  const returnCleanupRef = useRef<(() => void) | null | undefined>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    const onPopState = () => {
      if (window.location.pathname !== '/') return

      returnCleanupRef.current?.()
      returnCleanupRef.current = restoreProjectsIfNeeded(lenis)
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [lenis])

  useEffect(() => {
    const pathnameChanged = pathnameRef.current !== pathname
    pathnameRef.current = pathname

    commitPathnameNavigation(pathname)

    let cleanup: (() => void) | undefined
    const isProjectRoute = pathname.startsWith('/projetos/')

    if (isProjectRoute) {
      markWasOnProjectPage()
      cleanup = resetProjectPage(lenis)
      returnCleanupRef.current?.()
      returnCleanupRef.current = null
    } else if (pathname === '/') {
      if (shouldReturnToProjects()) {
        returnCleanupRef.current?.()
        returnCleanupRef.current = restoreProjectsIfNeeded(lenis, () => {
          const hadStoredTarget = Boolean(peekScrollTarget())
          if (hadStoredTarget) {
            clearScrollTarget()
          }
        })
        handledHashRef.current = hash
      } else if (pathnameChanged) {
        const homeScrollTarget = resolveHomeScrollTarget(hash)
        handledHashRef.current = hash

        if (homeScrollTarget) {
          const hadStoredTarget = Boolean(peekScrollTarget())

          const cancelScroll = scrollWhenSelectorReady(homeScrollTarget, lenis, {
            immediate: true,
            onSuccess: () => {
              if (hadStoredTarget) {
                clearScrollTarget()
              }
              scheduleScrollTriggerRefresh(120)
            },
          })
          scheduleScrollTriggerRefresh(250)
          cleanup = () => cancelScroll()
        } else {
          resetToTop(lenis)
          scheduleScrollTriggerRefresh(160)
        }
      }
    } else {
      resetToTop(lenis)
      scheduleScrollTriggerRefresh(160)
      returnCleanupRef.current?.()
      returnCleanupRef.current = null
    }

    return () => {
      cleanup?.()
    }
    // hash é tratado no efeito separado; incluir aqui re-dispara scroll ao mudar #skills
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pathname only
  }, [pathname, lenis])

  useEffect(() => {
    if (pathname !== '/') return
    if (!hash) return
    if (hash === handledHashRef.current) return
    if (shouldIgnoreHashNavigation()) return

    handledHashRef.current = hash
    const target = peekScrollTarget() ?? resolveScrollTarget(hash)
    const hadStoredTarget = Boolean(peekScrollTarget())

    const cancelScroll = scrollWhenSelectorReady(target, lenis, {
      immediate: true,
      onSuccess: () => {
        if (hadStoredTarget) {
          clearScrollTarget()
        }
        scheduleScrollTriggerRefresh(120)
      },
    })

    return () => {
      cancelScroll()
    }
  }, [pathname, hash, lenis])
}
