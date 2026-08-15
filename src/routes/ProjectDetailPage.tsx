import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, Navigate, useParams } from 'react-router-dom'
import { portfolio } from '../data/portfolio'
import { ProjectDetailHero } from '../components/projects/ProjectDetailHero'
import { ProjectGalleryGrid } from '../components/projects/ProjectGalleryGrid'
import { useProjectDetailAnimations } from '../hooks/useProjectDetailAnimations'
import { absoluteUrl } from '../utils/siteUrl'
import { hexToRgbTriplet } from '../utils/color'
import { markScrollTarget } from '../utils/scrollTarget'

const items = portfolio.projects.items

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  const currentIndex = items.findIndex((p) => p.slug === slug)
  const project = currentIndex >= 0 ? items[currentIndex] : undefined
  const nextProject = items[(currentIndex + 1) % items.length]

  useProjectDetailAnimations(slug)

  const structuredData = useMemo(() => {
    if (!project) return null
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      headline: project.detail.tagline,
      description: project.description,
      url: absoluteUrl(`/projetos/${project.slug}`),
      dateCreated: project.detail.year,
      keywords: project.tech.join(', '),
      author: {
        '@type': 'Person',
        name: portfolio.meta.author,
        url: portfolio.meta.siteUrl,
      },
    })
  }, [project])

  if (!project) {
    return <Navigate to="/#projects" replace />
  }

  const { detail } = project
  const pageTitle = `${project.title} | ${detail.tagline} | ${portfolio.meta.author}`
  const canonical = absoluteUrl(`/projetos/${project.slug}`)
  const shareImage = project.imageSrc
    ? absoluteUrl(project.imageSrc)
    : portfolio.meta.ogImage
      ? absoluteUrl(portfolio.meta.ogImage)
      : undefined

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={detail.tagline} />
        <meta name="robots" content={portfolio.meta.robots} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={detail.tagline} />
        <meta property="og:url" content={canonical} />
        {shareImage ? <meta property="og:image" content={shareImage} /> : null}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={detail.tagline} />
        {shareImage ? <meta name="twitter:image" content={shareImage} /> : null}
        {structuredData ? (
          <script type="application/ld+json">{structuredData}</script>
        ) : null}
      </Helmet>

      <article
        className="project-detail"
        style={
          {
            '--project-color': project.color,
            '--project-color-rgb': hexToRgbTriplet(project.color),
          } as CSSProperties
        }
      >
        <ProjectDetailHero project={project} />

        <section className="container project-detail-section">
          <div className="project-detail-split">
            <div className="reveal-text">
              <h2 className="project-detail-heading">Contexto</h2>
              <p className="project-detail-body">{detail.context}</p>
            </div>
            <div className="reveal-text">
              <h2 className="project-detail-heading">O problema</h2>
              <p className="project-detail-body">{detail.problem}</p>
            </div>
          </div>
        </section>

        <section className="container project-detail-section">
          <h2 className="project-detail-heading reveal-text">A solução</h2>
          <p className="project-detail-lead reveal-text">{detail.solution}</p>
        </section>

        {detail.results && detail.results.length > 0 ? (
          <section className="container project-detail-section">
            <h2 className="project-detail-heading reveal-text">Impacto</h2>
            <div className="project-result-grid">
              {detail.results.map((result) => (
                <div key={result.label} className="project-result reveal-text">
                  <span className="project-result-value">{result.value}</span>
                  <span className="project-result-label">{result.label}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="container project-detail-section">
          <h2 className="project-detail-heading reveal-text">Interface</h2>
          <ProjectGalleryGrid project={project} />
        </section>

        <section className="container project-detail-section">
          <h2 className="project-detail-heading reveal-text">
            Funcionalidades
          </h2>
          <div className="project-feature-grid">
            {detail.features.map((feature) => (
              <div key={feature.title} className="project-feature reveal-text">
                <h3 className="project-feature-title">{feature.title}</h3>
                <p className="project-feature-desc">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container project-detail-section">
          <h2 className="project-detail-heading reveal-text">
            Arquitetura e decisões
          </h2>
          <ul className="project-architecture reveal-text">
            {detail.architecture.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          <div className="project-stack-grid">
            {detail.stack.map((group) => (
              <div key={group.category} className="project-stack-group reveal-text">
                <span className="project-stack-category">{group.category}</span>
                <div className="project-stack-items">
                  {group.items.map((item) => (
                    <span key={item} className="project-tech-item">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="container project-detail-section">
          <h2 className="project-detail-heading reveal-text">Desafios</h2>
          <div className="project-challenge-list">
            {detail.challenges.map((challenge, i) => (
              <div
                key={challenge.title}
                className="project-challenge reveal-text"
              >
                <span className="project-challenge-index" aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="project-challenge-title">{challenge.title}</h3>
                  <p className="project-challenge-desc">
                    {challenge.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <nav className="container project-detail-footer" aria-label="Outros projetos">
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
            Todos os projetos
          </Link>

          {nextProject.slug !== project.slug ? (
            <Link
              to={`/projetos/${nextProject.slug}`}
              className="project-next hover-target"
              style={
                { '--project-color': nextProject.color } as CSSProperties
              }
            >
              <span className="project-next-label">Próximo projeto</span>
              <span className="project-next-title font-display">
                {nextProject.title}
              </span>
            </Link>
          ) : null}
        </nav>
      </article>
    </>
  )
}
