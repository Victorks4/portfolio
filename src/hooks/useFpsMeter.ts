import { useEffect } from 'react'
import { isFpsDebugEnabled } from '../utils/performanceTier'

/**
 * Overlay de FPS ativado por `?debug=fps` ou `localStorage` (`devsantos:fps-debug`).
 */
export function useFpsMeter() {
  useEffect(() => {
    if (!isFpsDebugEnabled()) return

    const el = document.createElement('div')
    el.id = 'fps-meter'
    el.setAttribute('aria-hidden', 'true')
    document.body.appendChild(el)

    let frames = 0
    let last = performance.now()
    let raf = 0

    const loop = (now: number) => {
      frames += 1
      const delta = now - last
      if (delta >= 1000) {
        const fps = Math.round((frames * 1000) / delta)
        el.textContent = `${fps} FPS`
        frames = 0
        last = now
      }
      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      el.remove()
    }
  }, [])
}
