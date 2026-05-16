import type { CSSProperties } from 'react'
import type { Project } from '../../types/portfolio'

type ProjectCardProps = {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const num = String(index + 1).padStart(2, '0')

  return (
    <article
      className="project-card"
      style={
          {
            '--project-color': project.color,
          } as CSSProperties
        }
      aria-label={`Projeto ${project.title}`}
    >
      <div className="project-visual hover-target">
        <div className="project-visual-inner" aria-hidden />
        <div
          className={`project-shape ${project.shapeClass}`}
          aria-hidden
        />
        <div className="project-number-huge" aria-hidden>
          {num}
        </div>
      </div>
      <div className="project-info">
        <span className="project-role">{project.role}</span>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.description}</p>
        <div className="project-tech-list">
          {project.tech.map((t) => (
            <span key={t} className="project-tech-item">
              {t}
            </span>
          ))}
        </div>
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="project-link magnetic-btn hover-target"
          data-strength="20"
        >
          Ver Repositório
          <svg viewBox="0 0 24 24" aria-hidden>
            <path
              d="M5 12h14M12 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </article>
  )
}
