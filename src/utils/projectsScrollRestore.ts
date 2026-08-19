import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type Lenis from 'lenis'
import {
  getScrollAlign,
  resolveScrollTarget,
  scrollToElement,
} from './scrollAnchor'
import { peekProjectsScrollY } from './scrollTarget'

gsap.registerPlugin(ScrollTrigger)

const PROJECTS_SELECTOR = resolveScrollTarget('#projects')
const RESTORE_DELAYS_MS = [0, 16, 50, 100, 200, 350, 600, 1000, 1500, 2200]

function scrollToY(lenis: Lenis | null, y: number): void {
  if (lenis) {
    lenis.scrollTo(y, { immediate: true })
  }
  window.scrollTo({ top: y, left: 0, behavior: 'auto' })
}

function restoreProjectsScroll(lenis: Lenis | null): boolean {
  ScrollTrigger.refresh()

  const savedY = peekProjectsScrollY()
  if (savedY != null) {
    scrollToY(lenis, savedY)
  }

  const el = document.querySelector(PROJECTS_SELECTOR)
  if (!el) return savedY != null

  scrollToElement(lenis, el as HTMLElement, {
    immediate: true,
    align: getScrollAlign(PROJECTS_SELECTOR),
  })
  return true
}

/**
 * Restaura o carrossel após voltar da rota de projeto.
 * Repete em vários frames porque o HomePage monta depois do efeito de rota.
 */
export function forceReturnToProjectsCarousel(
  lenis: Lenis | null,
  onSuccess?: () => void,
): () => void {
  let cancelled = false
  let succeeded = false
  const timeouts: ReturnType<typeof setTimeout>[] = []

  const attempt = () => {
    if (cancelled) return
    const didScroll = restoreProjectsScroll(lenis)
    if (didScroll && !succeeded) {
      succeeded = true
      onSuccess?.()
    }
  }

  attempt()

  for (const delay of RESTORE_DELAYS_MS) {
    timeouts.push(window.setTimeout(attempt, delay))
  }

  return () => {
    cancelled = true
    for (const id of timeouts) {
      window.clearTimeout(id)
    }
  }
}
