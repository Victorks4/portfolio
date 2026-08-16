import { ScrollTrigger } from 'gsap/ScrollTrigger'

let refreshTimer: ReturnType<typeof setTimeout> | null = null

/** Agrupa vários `ScrollTrigger.refresh()` num único flush. */
export function scheduleScrollTriggerRefresh(delayMs = 120): void {
  if (refreshTimer !== null) {
    clearTimeout(refreshTimer)
  }
  refreshTimer = setTimeout(() => {
    refreshTimer = null
    ScrollTrigger.refresh()
  }, delayMs)
}

/** Adia o refresh até após o primeiro paint do hero. */
export function scheduleScrollTriggerRefreshAfterPaint(delayMs = 80): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scheduleScrollTriggerRefresh(delayMs)
    })
  })
}
