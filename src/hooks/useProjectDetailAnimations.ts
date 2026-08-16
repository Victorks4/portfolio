import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'
import { useLenisContext } from './useLenisContext'
import { scheduleScrollTriggerRefresh } from '../utils/scrollTriggerRefresh'
import { registerTextOutlineReveals } from './useTextOutlineReveal'

gsap.registerPlugin(ScrollTrigger)

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function revealGroup(
  trigger: Element | string,
  targets: string,
  options?: { stagger?: number; y?: number; x?: number; duration?: number },
) {
  const els = gsap.utils.toArray<HTMLElement>(targets)
  if (!els.length) return

  ScrollTrigger.create({
    trigger,
    start: 'top 88%',
    once: true,
    onEnter: () => {
      gsap.fromTo(
        els,
        {
          y: options?.y ?? 36,
          x: options?.x ?? 0,
          opacity: 0,
        },
        {
          y: 0,
          x: 0,
          opacity: 1,
          duration: options?.duration ?? 0.85,
          stagger: options?.stagger ?? 0.1,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
        },
      )
    },
  })
}

/**
 * Reveals no scroll da página de case study. Recebe o slug para refazer os
 * gatilhos quando a pessoa navega direto de um projeto para o próximo.
 */
export function useProjectDetailAnimations(slug: string | undefined) {
  const { perfConfig } = useLenisContext()
  useEffect(() => {
    if (!slug) return

    let cleanupOutline: (() => void) | undefined
    const reduceMotion = prefersReducedMotion()

    const ctx = gsap.context(() => {
      if (!reduceMotion) {
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        heroTl
          .from('.project-back', { x: -24, opacity: 0, duration: 0.65 })
          .from(
            '.project-detail-eyebrow',
            { y: 20, opacity: 0, duration: 0.7 },
            '-=0.35',
          )
          .from(
            '.project-detail-title',
            {
              y: 72,
              opacity: 0,
              scale: 0.94,
              duration: 1.05,
              ease: 'power4.out',
            },
            '-=0.45',
          )
          .from(
            '.project-detail-tagline',
            { y: 28, opacity: 0, duration: 0.75 },
            '-=0.65',
          )
          .from(
            '.project-detail-meta-item',
            { y: 22, opacity: 0, duration: 0.65, stagger: 0.09 },
            '-=0.55',
          )
          .from(
            '.project-detail-actions > *',
            { y: 18, opacity: 0, duration: 0.6, stagger: 0.08 },
            '-=0.45',
          )
      } else {
        gsap.set('.project-detail-hero > *', { opacity: 1, clearProps: 'transform' })
      }

      cleanupOutline = registerTextOutlineReveals(document, perfConfig)

      gsap.utils.toArray<HTMLElement>('.project-detail-split').forEach((split) => {
        revealGroup(split, ':scope > .reveal-text', { stagger: 0.14, y: 40 })
      })

      const singles = gsap.utils.toArray<HTMLElement>(
        [
          '.project-detail-section .reveal-text:not(.project-feature):not(.project-challenge):not(.project-architecture):not(.project-stack-group):not(.project-result)',
          '.project-detail-footer .reveal-text',
        ].join(', '),
      )

      singles.forEach((el) => {
        const isOutline = el.classList.contains('text-outline')
        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            if (reduceMotion) {
              gsap.set(el, { opacity: 1, clearProps: 'transform' })
              return
            }
            gsap.fromTo(
              el,
              { y: 32, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',
                clearProps: isOutline ? 'transform' : 'opacity,transform',
              },
            )
          },
        })
      })

      gsap.utils.toArray<HTMLElement>('.project-feature-grid').forEach((grid) => {
        revealGroup(grid, '.project-feature', { stagger: 0.1, y: 44 })
      })

      gsap.utils.toArray<HTMLElement>('.project-challenge-list').forEach((list) => {
        revealGroup(list, '.project-challenge', {
          stagger: 0.12,
          x: -28,
          y: 0,
          duration: 0.9,
        })
      })

      gsap.utils.toArray<HTMLElement>('.project-architecture').forEach((list) => {
        revealGroup(list, 'li', { stagger: 0.07, y: 20, duration: 0.7 })
      })

      gsap.utils.toArray<HTMLElement>('.project-stack-grid').forEach((grid) => {
        revealGroup(grid, '.project-stack-group', { stagger: 0.1, y: 32 })
      })

      gsap.utils.toArray<HTMLElement>('.project-result-grid').forEach((grid) => {
        revealGroup(grid, '.project-result', { stagger: 0.12, y: 36 })
      })

      const footer = document.querySelector('.project-detail-footer')
      if (footer) {
        ScrollTrigger.create({
          trigger: footer,
          start: 'top 92%',
          once: true,
          onEnter: () => {
            if (reduceMotion) return
            gsap.from('.project-next', {
              x: 40,
              opacity: 0,
              duration: 0.85,
              ease: 'power3.out',
              clearProps: 'opacity,transform',
            })
          },
        })
      }

      ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: { className: 'scrolled', targets: 'header' },
      })
    })

    scheduleScrollTriggerRefresh(350)

    return () => {
      cleanupOutline?.()
      ctx.revert()
    }
  }, [slug, perfConfig])
}
