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

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`
    }

    window.addEventListener('mousemove', onMove)

    let raf = 0
    const loop = () => {
      ringX = particleMath.lerp(ringX, mouseX, 0.15)
      ringY = particleMath.lerp(ringY, mouseY, 0.15)
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const els = document.querySelectorAll('a, button, .hover-target')
    const enter = () => document.body.classList.add('cursor-hover')
    const leave = () => document.body.classList.remove('cursor-hover')
    els.forEach((el) => {
      el.addEventListener('mouseenter', enter)
      el.addEventListener('mouseleave', leave)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      els.forEach((el) => {
        el.removeEventListener('mouseenter', enter)
        el.removeEventListener('mouseleave', leave)
      })
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
