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
  /**
   * Elemento cuja visibilidade mantém o render rodando. Quando ele sai da tela
   * o RAF para de desenhar, economizando GPU no resto da página.
   */
  viewportAnchor?: string
}

export function WebGLBackground({
  lenis,
  perfConfig,
  onReady,
  viewportAnchor = '#hero',
}: WebGLBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const coreRef = useRef<WebGLCore | null>(null)
  const inViewRef = useRef(true)
  const visibleRef = useRef(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const core = new WebGLCore(canvas, {
      enableBloom: perfConfig.enableBloom,
      enablePostShader: perfConfig.enablePostShader,
      pixelRatio: perfConfig.pixelRatio,
    })
    coreRef.current = core
    const particles = new ParticleSystem(core, perfConfig.particleCount)

    const api: WebGLApi = {
      setMorphTarget: (index: number) => particles.setMorphTarget(index),
    }
    onReady?.(api)

    let raf = 0
    let running = true
    visibleRef.current = !document.hidden

    const loop = () => {
      if (running && visibleRef.current && inViewRef.current) {
        const t = core.clock.getElapsedTime()
        particles.update(t, core.mouse)
        core.render()
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onVisibility = () => {
      visibleRef.current = !document.hidden
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVisibility)
      particles.dispose()
      core.dispose()
      coreRef.current = null
    }
  }, [onReady, perfConfig])

  useEffect(() => {
    const anchor = document.querySelector(viewportAnchor)
    if (!anchor) {
      inViewRef.current = true
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting
      },
      { root: null, rootMargin: '0px', threshold: 0 },
    )
    observer.observe(anchor)

    return () => {
      observer.disconnect()
      inViewRef.current = true
    }
  }, [viewportAnchor])

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
