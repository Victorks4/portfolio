import { useCallback, useEffect, useState } from 'react'
import type { Portfolio } from '../../types/portfolio'
import { ProjectCard } from './ProjectCard'

const AUTOPLAY_MS = 3000

type ProjectGalleryProps = {
  data: Portfolio['projects']
}

export function ProjectGallery({ data }: ProjectGalleryProps) {
  const items = data.items
  const count = items.length
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const goTo = useCallback(
    (i: number) => {
      if (count === 0) return
      setIndex(((i % count) + count) % count)
    },
    [count],
  )

  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])

  useEffect(() => {
    if (paused || count <= 1) return
    const id = window.setInterval(() => {
      setIndex((curr) => (curr + 1) % count)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [paused, count, index])

  return (
    <section id="projects" className="container">
      <div className="section-header reveal-wrap">
        <span className="section-number">{data.sectionNumber}</span>
        <h2 className="section-title text-outline reveal-text">
          {data.sectionTitle}
        </h2>
      </div>

      <div
        className="projects-carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
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
                key={proj.title}
                className="projects-slide"
                role="group"
                aria-roledescription="slide"
                aria-label={`Projeto ${i + 1} de ${count}: ${proj.title}`}
                aria-hidden={i !== index}
                tabIndex={i === index ? 0 : -1}
              >
                <ProjectCard project={proj} index={i} />
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

      <div className="projects-dots" role="tablist" aria-label="Projetos">
        {items.map((proj, i) => (
          <button
            key={proj.title}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-controls={`project-slide-${i}`}
            aria-label={`Ir para o projeto ${proj.title}`}
            className={`projects-dot hover-target${i === index ? ' is-active' : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  )
}
