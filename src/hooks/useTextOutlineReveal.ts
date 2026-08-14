import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const DEFAULT_ACCENT_RGB = '0, 255, 204'

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function prefersTouchReveal(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: none), (pointer: coarse)').matches
}

/** Permite que a página de projeto acenda o título na cor do próprio projeto. */
function accentOf(el: HTMLElement): string {
  const value = getComputedStyle(el)
    .getPropertyValue('--outline-accent-rgb')
    .trim()
  return value || DEFAULT_ACCENT_RGB
}

function applyOutlineProgress(el: HTMLElement, progress: number, rgb: string) {
  const strokeAlpha = 0.08 + progress * 0.92
  const fillAlpha = progress * 0.08
  const glowAlpha = progress * 0.4

  el.style.color = `rgba(${rgb}, ${fillAlpha})`
  el.style.webkitTextStroke = `1px rgba(${rgb}, ${strokeAlpha})`
  el.style.textShadow = `0 0 ${30 * progress}px rgba(${rgb}, ${glowAlpha})`

  if (progress >= 0.98) {
    el.classList.add('is-lit')
  } else if (progress <= 0.02) {
    el.classList.remove('is-lit')
  }
}

function revealOutlineOnEnter(el: HTMLElement, rgb: string) {
  const proxy = { value: 0 }
  let lit = false

  const lightUp = () => {
    if (lit) return
    lit = true
    gsap.to(proxy, {
      value: 1,
      duration: 0.85,
      ease: 'power2.out',
      onUpdate: () => applyOutlineProgress(el, proxy.value, rgb),
      onComplete: () => applyOutlineProgress(el, 1, rgb),
    })
  }

  const trigger = ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    once: true,
    onEnter: lightUp,
  })

  requestAnimationFrame(() => {
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      lightUp()
    }
  })

  return trigger
}

export function registerTextOutlineReveals(
  scope: Element | Document = document,
) {
  const elements = scope.querySelectorAll<HTMLElement>('.text-outline')
  const triggers: ScrollTrigger[] = []
  const touchReveal = prefersTouchReveal()

  elements.forEach((el) => {
    const rgb = accentOf(el)
    applyOutlineProgress(el, 0, rgb)

    if (prefersReducedMotion()) {
      applyOutlineProgress(el, 1, rgb)
      el.classList.add('is-lit')
      return
    }

    if (touchReveal) {
      triggers.push(revealOutlineOnEnter(el, rgb))
      return
    }

    const proxy = { value: 0 }
    const tween = gsap.to(proxy, {
      value: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'top 55%',
        scrub: 0.5,
        onUpdate: (self) => applyOutlineProgress(el, self.progress, rgb),
        onRefresh: (self) => applyOutlineProgress(el, self.progress, rgb),
        onLeaveBack: () => applyOutlineProgress(el, 0, rgb),
      },
    })

    if (tween.scrollTrigger) {
      triggers.push(tween.scrollTrigger)
    }
  })

  requestAnimationFrame(() => ScrollTrigger.refresh())

  return () => {
    triggers.forEach((trigger) => trigger.kill())
  }
}
