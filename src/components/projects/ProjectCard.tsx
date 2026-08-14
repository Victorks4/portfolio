import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { Project } from '../../types/portfolio'

type ProjectCardProps = {
  project: Project
  index: number
  isActive?: boolean
}

export function ProjectCard({
  project,
  index,
  isActive = false,
}: ProjectCardProps) {
  const num = String(index + 1).padStart(2, '0')
  const href = `/projetos/${project.slug}`

  return (
    <article
      className={`project-card${isActive ? ' is-active' : ''}`}
      style={
        {
          '--project-color': project.color,
        } as CSSProperties
      }
    >
      <div className="project-visual hover-target">
        <div className="project-visual-inner" aria-hidden />
        {project.imageSrc ? (
          <img
            src={project.imageSrc}
            alt=""
            className="project-screenshot"
            loading="lazy"
            decoding="async"
            style={
              project.imageOpacity != null
                ? { opacity: project.imageOpacity }
                : undefined
            }
          />
        ) : null}
        <div className={`project-shape ${project.shapeClass}`} aria-hidden />
        <div className="project-number-huge" aria-hidden>
          {num}
        </div>
      </div>
      <div className="project-info">
        <span className="project-role">{project.role}</span>
        {project.highlight ? (
          <span className="project-highlight">{project.highlight}</span>
        ) : null}
        <h3 className="project-title" title={project.title}>
          <Link
            to={href}
            className="project-card-link hover-target"
            tabIndex={isActive ? 0 : -1}
          >
            {project.title}
          </Link>
        </h3>
        <p className="project-desc" title={project.description}>
          {project.description}
        </p>
        <div className="project-tech-list">
          {project.tech.map((t) => (
            <span key={t} className="project-tech-item">
              {t}
            </span>
          ))}
        </div>
        <span className="project-link" aria-hidden>
          Ver Projeto
          <svg viewBox="0 0 24 24" aria-hidden>
            <path
              d="M5 12h14M12 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {/*
        Estende o clique a todo o card. Fica fora da ordem de tabulação e da árvore
        de acessibilidade porque o link do título já expõe o mesmo destino.
      */}
      <Link
        to={href}
        className="project-card-hitbox hover-target"
        tabIndex={-1}
        aria-hidden
      />
    </article>
  )
}
