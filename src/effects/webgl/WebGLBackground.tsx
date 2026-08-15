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
  /** Hero da rota atual — modo completo enquanto visível. */
  heroAnchor?: string
}

export function WebGLBackground({
  lenis,
  perfConfig,
  onReady,
  heroAnchor = '#hero',
}: WebGLBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const coreRef = useRef<WebGLCore | null>(null)
  const pageActiveRef = useRef(true)
  const heroActiveRef = useRef(true)
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
    const perfLow = perfConfig.tier === 'low'

    const api: WebGLApi = {
      setMorphTarget: (index: number) => particles.setMorphTarget(index),
    }
    onReady?.(api)

    let raf = 0
    let running = true
    visibleRef.current = !document.hidden

    const loop = () => {
      if (running && visibleRef.current && pageActiveRef.current) {
        const t = core.clock.getElapsedTime()
        const ambient = !heroActiveRef.current
        particles.update(t, core.mouse, { ambient, perfLow })
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
    const page = document.querySelector('#conteudo')
    if (!page) {
      pageActiveRef.current = true
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        pageActiveRef.current = entry.isIntersecting
      },
      { root: null, rootMargin: '0px', threshold: 0 },
    )
    observer.observe(page)

    return () => {
      observer.disconnect()
      pageActiveRef.current = true
    }
  }, [])

  useEffect(() => {
    const hero = document.querySelector(heroAnchor)
    if (!hero) {
      heroActiveRef.current = true
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        heroActiveRef.current = entry.isIntersecting
      },
      { root: null, rootMargin: '0px', threshold: 0 },
    )
    observer.observe(hero)

    return () => {
      observer.disconnect()
      heroActiveRef.current = true
    }
  }, [heroAnchor])

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
