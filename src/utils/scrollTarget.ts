export const SCROLL_TARGET_KEY = 'devsantos:scroll-target'

export function markScrollTarget(hash: string): void {
  try {
    window.sessionStorage.setItem(SCROLL_TARGET_KEY, hash)
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
