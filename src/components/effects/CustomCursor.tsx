import { useEffect, useRef } from 'react'
import { particleMath } from '../../effects/webgl/particleMath'

export function CustomCursor({ enabled }: { enabled: boolean }) {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let raf = 0
    let pending = false

    const paintRing = () => {
      pending = false
      ringX = particleMath.lerp(ringX, mouseX, 0.15)
      ringY = particleMath.lerp(ringY, mouseY, 0.15)
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`
    }

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`

      if (!pending) {
        pending = true
        raf = requestAnimationFrame(paintRing)
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })

    const INTERACTIVE = 'a, button, .hover-target'
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.(INTERACTIVE)) {
        document.body.classList.add('cursor-hover')
      }
    }
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.(INTERACTIVE)) {
        document.body.classList.remove('cursor-hover')
      }
    }
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.body.classList.remove('cursor-hover')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="cursor-wrapper" id="cursor-wrapper">
      <div className="cursor-dot" id="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" id="cursor-ring" ref={ringRef} />
    </div>
  )
}
