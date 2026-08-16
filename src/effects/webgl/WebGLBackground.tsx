import { useEffect, useRef } from 'react'
import type Lenis from 'lenis'
import { ParticleSystem } from './ParticleSystem'
import { WebGLCore } from './WebGLCore'
import type { PerformanceConfig } from '../../utils/performanceTier'

export type WebGLApi = {
  setMorphTarget: (index: number) => void
}

type WebGLBackgroundProps = {
  lenis: Lenis | null
  perfConfig: PerformanceConfig
  onReady?: (api: WebGLApi) => void
  heroAnchor?: string
}

const AMBIENT_FRAME_MS = 66 // ~15fps fora do hero

function deferAfterFirstPaint(callback: () => void): () => void {
  let cancelled = false
  let idleId: number | undefined
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  const run = () => {
    if (cancelled) return
    callback()
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (cancelled) return
      if ('requestIdleCallback' in window) {
        idleId = window.requestIdleCallback(run, { timeout: 500 })
      } else {
        timeoutId = setTimeout(run, 0)
      }
    })
  })

  return () => {
    cancelled = true
    if (idleId !== undefined && 'cancelIdleCallback' in window) {
      window.cancelIdleCallback(idleId)
    }
    if (timeoutId !== undefined) clearTimeout(timeoutId)
  }
}

export function WebGLBackground({
  lenis,
  perfConfig,
  onReady,
  heroAnchor = '#hero',
}: WebGLBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const coreRef = useRef<WebGLCore | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let disposed = false
    let teardown: (() => void) | undefined

    const cancelDefer = deferAfterFirstPaint(() => {
      if (disposed) return

      const core = new WebGLCore(canvas, {
        enableBloom: perfConfig.enableBloom,
        enablePostShader: perfConfig.enablePostShader,
        pixelRatio: perfConfig.pixelRatio,
      })
      coreRef.current = core

      const particles = new ParticleSystem(core, perfConfig.particleCount)
      const perfLow = perfConfig.tier === 'low'

      onReady?.({
        setMorphTarget: (index: number) => particles.setMorphTarget(index),
      })

      let running = true
      let raf = 0
      let heroActive = true
      let tabVisible = !document.hidden
      let lastFrameAt = 0

      const shouldRender = () => running && tabVisible

      const loop = (now: number) => {
        raf = 0
        if (!shouldRender()) return

        const ambient = !heroActive
        if (ambient && now - lastFrameAt < AMBIENT_FRAME_MS) {
          raf = requestAnimationFrame(loop)
          return
        }
        lastFrameAt = now

        const t = core.clock.getElapsedTime()
        particles.update(t, core.mouse, { ambient, perfLow })
        core.render()
        raf = requestAnimationFrame(loop)
      }

      const startLoop = () => {
        if (raf === 0 && shouldRender()) {
          raf = requestAnimationFrame(loop)
        }
      }

      const stopLoop = () => {
        if (raf !== 0) {
          cancelAnimationFrame(raf)
          raf = 0
        }
      }

      const onVisibility = () => {
        tabVisible = !document.hidden
        if (tabVisible) startLoop()
        else stopLoop()
      }

      document.addEventListener('visibilitychange', onVisibility)
      startLoop()

      const hero = document.querySelector(heroAnchor)
      let heroObserver: IntersectionObserver | null = null

      if (hero) {
        heroObserver = new IntersectionObserver(
          ([entry]) => {
            heroActive = entry.isIntersecting
            startLoop()
          },
          { root: null, rootMargin: '0px', threshold: 0 },
        )
        heroObserver.observe(hero)
      }

      teardown = () => {
        running = false
        stopLoop()
        document.removeEventListener('visibilitychange', onVisibility)
        heroObserver?.disconnect()
        particles.dispose()
        core.dispose()
        coreRef.current = null
      }
    })

    return () => {
      disposed = true
      cancelDefer()
      teardown?.()
    }
  }, [heroAnchor, onReady, perfConfig])

  useEffect(() => {
    const core = coreRef.current
    if (!lenis || !core) return

    const off = lenis.on('scroll', () => {
      core.targetScrollVelocity = lenis.velocity
    })

    return () => {
      off()
    }
  }, [lenis])

  return (
    <div id="webgl-container">
      <canvas id="webgl-canvas" ref={canvasRef} />
    </div>
  )
}
