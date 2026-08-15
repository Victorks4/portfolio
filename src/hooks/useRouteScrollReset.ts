import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type Lenis from 'lenis'
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useLenisContext } from './useLenisContext'
import { consumeScrollTarget } from '../utils/scrollTarget'

gsap.registerPlugin(ScrollTrigger)

const NAV_OFFSET_FALLBACK = 72
const SCROLL_RETRY_MS = 1000

function getNavOffset(): number {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue('--nav-height')
    .trim()
  const parsed = parseFloat(value)
  return Number.isFinite(parsed) ? parsed : NAV_OFFSET_FALLBACK
}

function scrollToY(
  lenis: Lenis | null,
  y: number,
  immediate = true,
): void {
  if (lenis) {
    lenis.scrollTo(y, { immediate })
  }
  window.scrollTo({ top: y, left: 0, behavior: 'auto' })
}

function scrollToElement(
  lenis: Lenis | null,
  el: HTMLElement,
  immediate = true,
): void {
  const offset = -getNavOffset()
  if (lenis) {
    lenis.scrollTo(el, { immediate, offset })
  } else {
    const top =
      el.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top, left: 0, behavior: 'auto' })
  }
}

type ScrollWhenReadyOptions = {
  immediate?: boolean
  maxWaitMs?: number
}

function scrollWhenReady(
  selector: string,
  lenis: Lenis | null,
  options?: ScrollWhenReadyOptions,
): () => void {
  const immediate = options?.immediate ?? true
  const maxWaitMs = options?.maxWaitMs ?? SCROLL_RETRY_MS
  const started = performance.now()
  let frame = 0
  let cancelled = false

  const attempt = () => {
    if (cancelled) return

    const el = document.querySelector(selector)
    if (el) {
      ScrollTrigger.refresh()
      scrollToElement(lenis, el as HTMLElement, immediate)
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

function resetToTop(lenis: Lenis | null): void {
  scrollToY(lenis, 0, true)
  window.requestAnimationFrame(() => {
    scrollToY(lenis, 0, true)
  })
}

function resetProjectPage(lenis: Lenis | null): () => void {
  resetToTop(lenis)

  const heroCleanup = scrollWhenReady('#project-hero', lenis, {
    immediate: true,
  })

  const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 200)

  return () => {
    heroCleanup()
    window.clearTimeout(refreshId)
  }
}

/**
 * Ao trocar de rota, coordena scroll para o topo, seção alvo ou case study.
 * Evita corrida entre Lenis, hash da URL e restauração nativa do browser.
 */
export function useRouteScrollReset() {
  const { pathname, hash } = useLocation()
  const { lenis } = useLenisContext()
  const navigationId = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    const currentNav = ++navigationId.current
    let cleanup: (() => void) | undefined

    const isProjectRoute = pathname.startsWith('/projetos/')
    const homeScrollTarget =
      pathname === '/' ? consumeScrollTarget() ?? (hash || null) : null

    if (isProjectRoute) {
      cleanup = resetProjectPage(lenis)
    } else if (homeScrollTarget) {
      const cancelScroll = scrollWhenReady(homeScrollTarget, lenis, {
        immediate: true,
      })
      const refreshId = window.setTimeout(() => {
        if (navigationId.current === currentNav) {
          ScrollTrigger.refresh()
        }
      }, 250)

      cleanup = () => {
        cancelScroll()
        window.clearTimeout(refreshId)
      }
    } else {
      resetToTop(lenis)
      const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 160)
      cleanup = () => window.clearTimeout(refreshId)
    }

    return () => {
      cleanup?.()
    }
  }, [pathname, hash, lenis])
}
