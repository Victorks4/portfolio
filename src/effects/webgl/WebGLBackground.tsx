import { useEffect, useRef } from 'react'
import type Lenis from 'lenis'
import { ParticleSystem } from './ParticleSystem'
import { WebGLCore } from './WebGLCore'

export type WebGLApi = {
  setMorphTarget: (index: number) => void
}

type WebGLBackgroundProps = {
  lenis: Lenis | null
  onReady?: (api: WebGLApi) => void
}

export function WebGLBackground({ lenis, onReady }: WebGLBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const coreRef = useRef<WebGLCore | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const core = new WebGLCore(canvas)
    coreRef.current = core
    const particles = new ParticleSystem(core)

    const api: WebGLApi = {
      setMorphTarget: (index: number) => particles.setMorphTarget(index),
    }
    onReady?.(api)

    let raf = 0
    const loop = () => {
      const t = core.clock.getElapsedTime()
      particles.update(t, core.mouse)
      core.render()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      particles.dispose()
      core.dispose()
      coreRef.current = null
    }
  }, [onReady])

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
