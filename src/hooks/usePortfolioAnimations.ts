import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { MutableRefObject } from 'react'
import { useEffect, useRef } from 'react'
import type Lenis from 'lenis'
import type { WebGLApi } from '../effects/webgl/WebGLBackground'

gsap.registerPlugin(ScrollTrigger)

type Params = {
  lenis: Lenis | null
  introReady: boolean
  morphApiRef: MutableRefObject<WebGLApi | null>
}

export function usePortfolioAnimations({
  lenis,
  introReady,
  morphApiRef,
}: Params) {
  const magneticCleanups = useRef<(() => void)[]>([])

  useEffect(() => {
    if (!lenis) return

    const tickerFn = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0)

    const offScroll = lenis.on('scroll', ScrollTrigger.update)

    return () => {
      gsap.ticker.remove(tickerFn)
      offScroll()
    }
  }, [lenis])

  useEffect(() => {
    if (!introReady) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.from('header', { yPercent: -100, duration: 1, ease: 'power3.out' })
        .to(
          '.hero-greeting',
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.5',
        )
        .fromTo(
          '.hero-title .split-char',
          { y: 100, opacity: 0, rotationX: -90 },
          {
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration: 1.2,
            stagger: 0.02,
            ease: 'back.out(1.7)',
          },
          '-=0.5',
        )
        .to(
          '.hero-subtitle',
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.8',
        )
        .to(
          '.hero-desc',
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.6',
        )
        .to(
          '.hero-actions',
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.6',
        )
        .to(
          '.hero-image-container',
          {
            opacity: 1,
            scale: 1,
            rotateY: 0,
            duration: 1.5,
            ease: 'power3.out',
          },
          '-=1.2',
        )
        .to('.scroll-indicator', { opacity: 1, duration: 1 }, '-=0.2')

      const sections: { id: string; morph: number }[] = [
        { id: '#hero', morph: 0 },
        { id: '#about', morph: 1 },
        { id: '#skills', morph: 2 },
        { id: '#projects', morph: 3 },
        { id: '#timeline', morph: 4 },
        { id: '#contact', morph: 0 },
      ]

      sections.forEach((sec) => {
        ScrollTrigger.create({
          trigger: sec.id,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => morphApiRef.current?.setMorphTarget(sec.morph),
          onEnterBack: () => morphApiRef.current?.setMorphTarget(sec.morph),
        })
      })

      ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: { className: 'scrolled', targets: 'header' },
      })

      gsap.utils.toArray<HTMLElement>('.reveal-text').forEach((text) => {
        ScrollTrigger.create({
          trigger: text,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            gsap.fromTo(
              text,
              { y: 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: 'power3.out',
                clearProps: 'opacity,transform',
              },
            )
          },
        })
      })

      gsap.utils.toArray<HTMLElement>('.counter').forEach((counter) => {
        const target = parseInt(counter.dataset.target ?? '0', 10)
        ScrollTrigger.create({
          trigger: counter,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(counter, {
              innerHTML: target,
              duration: 2.5,
              snap: { innerHTML: 1 },
              ease: 'power2.out',
            })
          },
        })
      })

      gsap.utils.toArray<HTMLElement>('.skill-category').forEach((cat) => {
        const cards = cat.querySelectorAll<HTMLElement>('.skill-card')
        if (!cards.length) return
        ScrollTrigger.create({
          trigger: cat,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            gsap.fromTo(
              cards,
              { y: 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                stagger: 0.08,
                duration: 0.7,
                ease: 'power3.out',
                clearProps: 'opacity,transform',
              },
            )
          },
        })
      })

      ScrollTrigger.create({
        trigger: '#projects',
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            '.projects-carousel',
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: 'power3.out',
              clearProps: 'opacity,transform',
            },
          )
        },
      })

      gsap.to('#timeline-progress', {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.timeline-container',
          start: 'top center',
          end: 'bottom center',
          scrub: true,
        },
      })

      gsap.utils.toArray<HTMLElement>('.timeline-item').forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: 'top 60%',
          onEnter: () => item.classList.add('active'),
          onLeaveBack: () => item.classList.remove('active'),
        })
        const content = item.querySelector('.timeline-content')
        if (content) {
          ScrollTrigger.create({
            trigger: item,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap.fromTo(
                content,
                { y: 30, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.8,
                  ease: 'power3.out',
                  clearProps: 'opacity,transform',
                },
              )
            },
          })
        }
      })

      gsap.to('.footer-bg-text', {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: '#contact',
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true,
        },
      })

      magneticCleanups.current.forEach((fn) => fn())
      magneticCleanups.current = []

      if (window.innerWidth > 768) {
        document
          .querySelectorAll<HTMLElement>('.magnetic-btn')
          .forEach((btn) => {
            const onMove = (e: MouseEvent) => {
              const rect = btn.getBoundingClientRect()
              const strength = Number(btn.dataset.strength ?? 20)
              const x = (e.clientX - rect.left) / rect.width - 0.5
              const y = (e.clientY - rect.top) / rect.height - 0.5
              gsap.to(btn, {
                x: x * strength,
                y: y * strength,
                duration: 0.5,
                ease: 'power2.out',
              })
              document.body.classList.add('cursor-magnetic')
            }
            const onLeave = () => {
              gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: 'elastic.out(1, 0.3)',
              })
              document.body.classList.remove('cursor-magnetic')
            }
            btn.addEventListener('mousemove', onMove)
            btn.addEventListener('mouseleave', onLeave)
            magneticCleanups.current.push(() => {
              btn.removeEventListener('mousemove', onMove)
              btn.removeEventListener('mouseleave', onLeave)
            })
          })
      }
    })

    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 400)

    return () => {
      window.clearTimeout(refreshId)
      ctx.revert()
      magneticCleanups.current.forEach((fn) => fn())
      magneticCleanups.current = []
    }
  }, [introReady, morphApiRef])
}
