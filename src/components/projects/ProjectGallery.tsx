import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { Portfolio } from '../../types/portfolio'
import { ProjectCard } from './ProjectCard'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIsTouch } from '../../hooks/useMediaQuery'

const AUTOPLAY_MS = 5000

type ProjectGalleryProps = {
  data: Portfolio['projects']
}

export function ProjectGallery({ data }: ProjectGalleryProps) {
  const items = data.items
  const count = items.length
  const isTouch = useIsTouch()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  // Depois que a pessoa escolhe um projeto, deslizar sozinho vira atrapalho.
  const [tookControl, setTookControl] = useState(false)
  const tabsRef = useRef<HTMLDivElement>(null)

  const goTo = useCallback(
    (i: number) => {
      if (count === 0) return
      setIndex(((i % count) + count) % count)
    },
    [count],
  )

  const select = useCallback(
    (i: number) => {
      setTookControl(true)
      goTo(i)
    },
    [goTo],
  )

  const next = useCallback(() => select(index + 1), [select, index])
  const prev = useCallback(() => select(index - 1), [select, index])

  useEffect(() => {
    if (paused || tookControl || count <= 1) return
    const id = window.setInterval(() => {
      setIndex((curr) => (curr + 1) % count)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [paused, tookControl, count])

  useEffect(() => {
    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 100)
    return () => window.clearTimeout(refreshId)
  }, [])

  // No mobile a faixa de nomes rola só na horizontal. scrollIntoView puxava
  // a página inteira até #projects no mount e a cada troca do autoplay.
  useEffect(() => {
    const container = tabsRef.current
    const tab = container?.querySelector<HTMLElement>(
      `[data-tab-index="${index}"]`,
    )
    if (!container || !tab) return
    if (container.scrollWidth <= container.clientWidth) return

    const target =
      tab.offsetLeft - (container.clientWidth - tab.offsetWidth) / 2
    container.scrollTo({ left: Math.max(0, target), behavior: 'smooth' })
  }, [index])

  return (
    <section id="projects" className="container">
      <div className="section-header reveal-wrap">
        <span className="section-number">{data.sectionNumber}</span>
        <h2 className="section-title text-outline reveal-text">
          {data.sectionTitle}
        </h2>
        <div className="projects-section-intro reveal-text">
          <span className="projects-section-kicker">{data.sectionKicker}</span>
          <p className="projects-section-lead">{data.sectionIntro}</p>
        </div>
      </div>

      <div
        className="projects-carousel"
        onMouseEnter={() => {
          if (!isTouch) setPaused(true)
        }}
        onMouseLeave={() => {
          if (!isTouch) setPaused(false)
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault()
            next()
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault()
            prev()
          }
        }}
        aria-roledescription="carousel"
        aria-label="Projetos em destaque"
      >
        <button
          type="button"
          className="projects-nav projects-nav-prev hover-target"
          onClick={prev}
          aria-label="Projeto anterior"
          disabled={count <= 1}
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

        <div className="projects-viewport">
          <div
            className="projects-track"
            style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
          >
            {items.map((proj, i) => (
              <div
                key={proj.slug}
                id={`project-slide-${i}`}
                className="projects-slide"
                role="tabpanel"
                aria-roledescription="slide"
                aria-labelledby={`project-tab-${i}`}
                aria-hidden={i !== index}
                tabIndex={i === index ? 0 : -1}
              >
                <ProjectCard project={proj} index={i} isActive={i === index} />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="projects-nav projects-nav-next hover-target"
          onClick={next}
          aria-label="Próximo projeto"
          disabled={count <= 1}
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
      </div>

      <div
        className="projects-tabs"
        role="tablist"
        aria-label="Projetos"
        ref={tabsRef}
        onMouseEnter={() => {
          if (!isTouch) setPaused(true)
        }}
        onMouseLeave={() => {
          if (!isTouch) setPaused(false)
        }}
      >
        {items.map((proj, i) => (
          <button
            key={proj.slug}
            type="button"
            role="tab"
            id={`project-tab-${i}`}
            data-tab-index={i}
            aria-selected={i === index}
            aria-controls={`project-slide-${i}`}
            tabIndex={i === index ? 0 : -1}
            className={`projects-tab hover-target${i === index ? ' is-active' : ''}`}
            style={{ '--project-color': proj.color } as CSSProperties}
            onClick={() => select(i)}
          >
            {proj.title}
          </button>
        ))}
      </div>
    </section>
  )
}
