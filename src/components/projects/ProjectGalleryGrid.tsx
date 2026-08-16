import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Project } from '../../types/portfolio'

gsap.registerPlugin(ScrollTrigger)

type ProjectGalleryGridProps = {
  project: Project
}

function wrapIndex(index: number, length: number): number {
  if (length === 0) return 0
  return ((index % length) + length) % length
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function ensureImageLoaded(src: string, cache: Set<string>): Promise<void> {
  if (cache.has(src)) return Promise.resolve()

  return new Promise((resolve) => {
    const img = new Image()
    const done = () => {
      cache.add(src)
      resolve()
    }
    img.onload = done
    img.onerror = done
    img.src = src
  })
}

export function ProjectGalleryGrid({ project }: ProjectGalleryGridProps) {
  const { gallery } = project.detail
  const [index, setIndex] = useState(0)

  const rootRef = useRef<HTMLDivElement>(null)
  const slideRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const captionRef = useRef<HTMLElement>(null)
  const counterRef = useRef<HTMLParagraphElement>(null)
  const isAnimating = useRef(false)
  const imageCacheRef = useRef(new Set<string>())

  const navigate = useCallback(
    (next: number, direction: number) => {
      const wrapped = wrapIndex(next, gallery.length)
      if (wrapped === index) return
      if (isAnimating.current) return

      const slide = slideRef.current
      const media = mediaRef.current
      const caption = captionRef.current
      const counter = counterRef.current
      if (!slide || !media) {
        setIndex(wrapped)
        return
      }

      if (prefersReducedMotion()) {
        setIndex(wrapped)
        return
      }

      isAnimating.current = true
      const targets = caption ? [media, caption] : [media]
      const nextSrc = gallery[wrapped].src
      gsap.killTweensOf(targets)
      if (counter) gsap.killTweensOf(counter)

      const fadeOut = new Promise<void>((resolve) => {
        gsap.to(targets, {
          opacity: 0,
          x: direction * -28,
          scale: 0.98,
          duration: 0.16,
          ease: 'power2.in',
          onComplete: () => resolve(),
        })
      })

      Promise.all([
        fadeOut,
        ensureImageLoaded(nextSrc, imageCacheRef.current),
      ]).then(() => {
        setIndex(wrapped)

        requestAnimationFrame(() => {
          gsap.set(targets, { x: direction * 28, scale: 0.98, opacity: 0 })

          const tl = gsap.timeline({
            onComplete: () => {
              isAnimating.current = false
            },
          })

          tl.to(targets, {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.24,
            ease: 'power2.out',
          })

          if (counter) {
            tl.fromTo(
              counter,
              { opacity: 0.5, y: 4 },
              { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' },
              '-=0.16',
            )
          }
        })
      })
    },
    [gallery, index],
  )

  const goTo = useCallback(
    (next: number, direction?: number) => {
      const wrapped = wrapIndex(next, gallery.length)
      if (wrapped === index) return

      let dir = direction
      if (dir === undefined) {
        const diff = wrapped - index
        const absDiff = Math.abs(diff)
        dir =
          absDiff <= gallery.length / 2
            ? diff > 0
              ? 1
              : -1
            : diff > 0
              ? -1
              : 1
      }

      navigate(wrapped, dir)
    },
    [gallery.length, index, navigate],
  )

  const goPrev = useCallback(() => goTo(index - 1, -1), [goTo, index])
  const goNext = useCallback(() => goTo(index + 1, 1), [goTo, index])

  useEffect(() => {
    gallery.forEach((item) => {
      void ensureImageLoaded(item.src, imageCacheRef.current)
    })
  }, [gallery])

  useEffect(() => {
    if (gallery.length <= 1) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [gallery.length, goNext, goPrev])

  useEffect(() => {
    const root = rootRef.current
    if (!root || gallery.length === 0) return

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return

      ScrollTrigger.create({
        trigger: root,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            '.project-gallery-nav',
            { scale: 0.6, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.55,
              stagger: 0.1,
              ease: 'back.out(1.6)',
            },
          )

          gsap.fromTo(
            slideRef.current,
            { y: 48, opacity: 0, scale: 0.96 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.95,
              ease: 'power3.out',
            },
          )

          gsap.fromTo(
            '.project-gallery-carousel-footer',
            { y: 16, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              delay: 0.2,
              ease: 'power3.out',
            },
          )
        },
      })
    }, root)

    return () => ctx.revert()
  }, [gallery.length, project.slug])

  const pulseNav = useCallback((el: HTMLButtonElement | null) => {
    if (!el || prefersReducedMotion()) return
    gsap.fromTo(
      el,
      { scale: 0.88 },
      { scale: 1, duration: 0.45, ease: 'back.out(2.5)' },
    )
  }, [])

  if (gallery.length === 0) {
    return (
      <div className="project-gallery-placeholder reveal-text">
        <div className={`project-shape ${project.shapeClass}`} aria-hidden />
        <p className="project-gallery-placeholder-text">
          Capturas de tela do {project.title} em breve.
        </p>
      </div>
    )
  }

  const current = gallery[index]
  const hasMultiple = gallery.length > 1

  return (
    <div
      ref={rootRef}
      className="project-gallery-carousel reveal-text"
      role="region"
      aria-label={`Galeria de interface do ${project.title}`}
    >
      <div className="project-gallery-carousel-stage">
        {hasMultiple ? (
          <button
            type="button"
            className="project-gallery-nav project-gallery-nav--prev hover-target"
            onClick={(e) => {
              pulseNav(e.currentTarget)
              goPrev()
            }}
            aria-label="Imagem anterior"
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </button>
        ) : null}

        <figure className="project-gallery-slide" ref={slideRef}>
          <div className="project-gallery-slide-media" ref={mediaRef}>
            <img
              src={current.src}
              alt={current.alt}
              decoding="sync"
              loading="eager"
              fetchPriority={index === 0 ? 'high' : 'auto'}
            />
          </div>
          {current.caption ? (
            <figcaption ref={captionRef}>{current.caption}</figcaption>
          ) : null}
        </figure>

        {hasMultiple ? (
          <button
            type="button"
            className="project-gallery-nav project-gallery-nav--next hover-target"
            onClick={(e) => {
              pulseNav(e.currentTarget)
              goNext()
            }}
            aria-label="Próxima imagem"
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path
                d="M9 18l6-6-6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </button>
        ) : null}
      </div>

      {hasMultiple ? (
        <div className="project-gallery-carousel-footer">
          <p
            ref={counterRef}
            className="project-gallery-counter"
            aria-live="polite"
          >
            <span className="sr-only">Imagem </span>
            {index + 1}
            <span aria-hidden> / </span>
            <span className="sr-only"> de </span>
            {gallery.length}
          </p>

          <div
            className="project-gallery-dots"
            role="tablist"
            aria-label="Selecionar imagem"
          >
            {gallery.map((image, i) => (
              <button
                key={image.src}
                type="button"
                role="tab"
                className={`project-gallery-dot${i === index ? ' is-active' : ''}`}
                aria-selected={i === index}
                aria-label={`Imagem ${i + 1}: ${image.alt}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
