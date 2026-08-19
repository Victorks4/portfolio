import type Lenis from 'lenis'

const NAV_OFFSET_FALLBACK = 72
const SCROLL_EXTRA_OFFSET = 16

export type ScrollAlign = 'start' | 'center'

/** Âncoras internas — o hash da URL continua #projects, #contact, etc. */
export const SCROLL_TARGET_MAP: Record<string, string> = {
  '#hero': '#hero-content',
  '#about': '#about-anchor',
  '#skills': '#skills-anchor',
  '#projects': '#projects-carousel',
  '#timeline': '#timeline-anchor',
  '#contact': '#contact-channels-anchor',
  '#contact-intro': '#contact-intro-inner',
  '#contact-channels': '#contact-channels-anchor',
}

const SCROLL_ALIGN: Record<string, ScrollAlign> = {
  '#contact-intro-inner': 'center',
  '#contact-channels-anchor': 'center',
}

export function resolveScrollTarget(hash: string): string {
  const normalized = hash.startsWith('#') ? hash : `#${hash}`
  return SCROLL_TARGET_MAP[normalized] ?? normalized
}

export function getScrollAlign(selector: string): ScrollAlign {
  return SCROLL_ALIGN[selector] ?? 'start'
}

export function getNavOffset(): number {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue('--nav-height')
    .trim()
  const parsed = parseFloat(value)
  return Number.isFinite(parsed) ? parsed : NAV_OFFSET_FALLBACK
}

export function getScrollOffset(): number {
  return -(getNavOffset() + SCROLL_EXTRA_OFFSET)
}

export function computeScrollTop(
  el: HTMLElement,
  align: ScrollAlign = 'start',
  scrollY?: number,
): number {
  const nav = getNavOffset()
  const extra = SCROLL_EXTRA_OFFSET
  const currentScroll = scrollY ?? window.scrollY
  const rect = el.getBoundingClientRect()
  const absoluteTop = rect.top + currentScroll

  if (align === 'center') {
    const visibleHeight = window.innerHeight - nav - extra
    const elementHeight = el.offsetHeight
    return (
      absoluteTop -
      nav -
      extra -
      Math.max(0, (visibleHeight - elementHeight) / 2)
    )
  }

  return absoluteTop - nav - extra
}

export function scrollToElement(
  lenis: Lenis | null,
  el: HTMLElement,
  options?: {
    immediate?: boolean
    duration?: number
    align?: ScrollAlign
  },
): void {
  const immediate = options?.immediate ?? true
  const align = options?.align ?? 'start'
  const offset = getScrollOffset()

  if (lenis) {
    if (align === 'center') {
      const top = computeScrollTop(el, 'center', lenis.scroll)
      lenis.scrollTo(top, {
        immediate,
        duration: options?.duration,
      })
    } else {
      lenis.scrollTo(el, {
        immediate,
        offset,
        duration: options?.duration,
      })
    }
    window.scrollTo({
      top: lenis.scroll,
      left: 0,
      behavior: 'auto',
    })
    return
  }

  const top = computeScrollTop(el, align)
  window.scrollTo({
    top,
    left: 0,
    behavior: immediate ? 'auto' : 'smooth',
  })
}

export function scrollToSelector(
  lenis: Lenis | null,
  selector: string,
  options?: {
    immediate?: boolean
    duration?: number
  },
): boolean {
  const el = document.querySelector(selector)
  if (!el) return false
  scrollToElement(lenis, el as HTMLElement, {
    ...options,
    align: getScrollAlign(selector),
  })
  return true
}

export function scrollToAnchor(
  hash: string,
  lenis: Lenis | null,
  options?: { immediate?: boolean; duration?: number },
): boolean {
  const selector = resolveScrollTarget(hash)
  return scrollToSelector(lenis, selector, options)
}

export function scrollWhenSelectorReady(
  selector: string,
  lenis: Lenis | null,
  options?: {
    immediate?: boolean
    maxWaitMs?: number
    onSuccess?: () => void
  },
): () => void {
  const immediate = options?.immediate ?? true
  const maxWaitMs = options?.maxWaitMs ?? 2000
  const align = getScrollAlign(selector)
  const started = performance.now()
  let frame = 0
  let cancelled = false

  const performScroll = (el: HTMLElement) => {
    scrollToElement(lenis, el, { immediate, align })
    window.requestAnimationFrame(() => {
      if (cancelled) return
      scrollToElement(lenis, el, { immediate: true, align })
      window.requestAnimationFrame(() => {
        if (!cancelled) {
          scrollToElement(lenis, el, { immediate: true, align })
          options?.onSuccess?.()
        }
      })
    })
  }

  const attempt = () => {
    if (cancelled) return

    const el = document.querySelector(selector)
    if (el) {
      performScroll(el as HTMLElement)
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

export function scrollWhenAnchorReady(
  hash: string,
  lenis: Lenis | null,
  options?: {
    immediate?: boolean
    maxWaitMs?: number
    onSuccess?: () => void
  },
): () => void {
  return scrollWhenSelectorReady(resolveScrollTarget(hash), lenis, options)
}
