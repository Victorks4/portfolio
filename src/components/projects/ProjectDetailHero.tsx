import { Link } from 'react-router-dom'
import type { Project } from '../../types/portfolio'
import { markScrollTarget } from '../../utils/scrollTarget'

type ProjectDetailHeroProps = {
  project: Project
}

export function ProjectDetailHero({ project }: ProjectDetailHeroProps) {
  const { detail } = project

  // Div e não header: a folha de estilo global usa o seletor de elemento
  // `header` para a navbar fixa, e um segundo header herdaria position: fixed.
  return (
    <div id="project-hero" className="project-detail-hero container">
      <Link
        to="/#projects"
        className="project-back hover-target"
        onClick={() => markScrollTarget('#projects')}
      >
        <svg viewBox="0 0 24 24" aria-hidden>
          <path
            d="M19 12H5M12 19l-7-7 7-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        Voltar para projetos
      </Link>

      <span className="project-detail-eyebrow">{project.role}</span>

      <div className="project-detail-badges">
        <span className="project-scope-badge project-scope-badge--hero">
          {project.scope.badge}
        </span>
        {project.highlight ? (
          <span className="project-highlight project-highlight--hero">
            {project.highlight}
          </span>
        ) : null}
      </div>

      <h1 className="project-detail-title font-display text-outline">
        {project.title}
      </h1>

      <p className="project-detail-tagline">{detail.tagline}</p>

      {project.impactMetrics.length > 0 ? (
        <dl className="project-detail-impact" aria-label="Impacto do projeto">
          {project.impactMetrics.map((metric) => (
            <div key={metric.label} className="project-impact-metric">
              <dt className="project-impact-value">{metric.value}</dt>
              <dd className="project-impact-label">{metric.label}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <dl className="project-detail-meta">
        {project.scope.organization ? (
          <div className="project-detail-meta-item">
            <dt>Para quem</dt>
            <dd>{project.scope.organization}</dd>
          </div>
        ) : null}
        <div className="project-detail-meta-item">
          <dt>Ano</dt>
          <dd>{detail.year}</dd>
        </div>
        <div className="project-detail-meta-item">
          <dt>Status</dt>
          <dd>
            <span className="project-status-dot" aria-hidden />
            {detail.status}
          </dd>
        </div>
        <div className="project-detail-meta-item">
          <dt>Stack principal</dt>
          <dd>{project.tech.join(' · ')}</dd>
        </div>
      </dl>

      {detail.repoUrl || detail.liveUrl ? (
        <div className="project-detail-actions">
          {detail.liveUrl ? (
            <a
              href={detail.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary hover-target"
            >
              Ver ao vivo
            </a>
          ) : null}
          {detail.repoUrl ? (
            <a
              href={detail.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline hover-target"
            >
              Ver repositório
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
