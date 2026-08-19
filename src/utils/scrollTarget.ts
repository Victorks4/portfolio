import { computeScrollTop, resolveScrollTarget } from './scrollAnchor'

export const SCROLL_TARGET_KEY = 'devsantos:scroll-target'
export const PROJECTS_SCROLL_Y_KEY = 'devsantos:projects-scroll-y'

export function saveProjectsScrollPosition(scrollY?: number): void {
  try {
    const carousel = document.querySelector('#projects-carousel')
    if (!carousel) return

    const y =
      scrollY ?? computeScrollTop(carousel as HTMLElement, 'start')

    window.sessionStorage.setItem(PROJECTS_SCROLL_Y_KEY, String(Math.round(y)))
  } catch {
    // sessionStorage indisponível
  }
}

export function peekProjectsScrollY(): number | null {
  try {
    const value = window.sessionStorage.getItem(PROJECTS_SCROLL_Y_KEY)
    if (!value) return null
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function clearProjectsScrollY(): void {
  try {
    window.sessionStorage.removeItem(PROJECTS_SCROLL_Y_KEY)
  } catch {
    // sessionStorage indisponível
  }
}

export function markScrollTarget(hash: string): void {
  try {
    const resolved = resolveScrollTarget(hash)
    window.sessionStorage.setItem(SCROLL_TARGET_KEY, resolved)
    if (resolved === resolveScrollTarget('#projects')) {
      saveProjectsScrollPosition()
    }
  } catch {
    // sessionStorage indisponível
  }
}

export function consumeScrollTarget(): string | null {
  try {
    const value = window.sessionStorage.getItem(SCROLL_TARGET_KEY)
    if (value) {
      window.sessionStorage.removeItem(SCROLL_TARGET_KEY)
    }
    return value
  } catch {
    return null
  }
}

export function peekScrollTarget(): string | null {
  try {
    return window.sessionStorage.getItem(SCROLL_TARGET_KEY)
  } catch {
    return null
  }
}

export function clearScrollTarget(): void {
  try {
    window.sessionStorage.removeItem(SCROLL_TARGET_KEY)
  } catch {
    // sessionStorage indisponível
  }
}
