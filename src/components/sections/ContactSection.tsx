import type { Portfolio } from '../../types/portfolio'

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M12.031 0C5.394 0 0 5.394 0 12.031c0 2.128.552 4.195 1.603 6.015L.17 24l6.115-1.603c1.766.953 3.754 1.455 5.746 1.455 6.637 0 12.031-5.394 12.031-12.031C24.062 5.394 18.668 0 12.031 0zm6.27 17.15c-.266.75-1.531 1.438-2.125 1.5-.578.063-1.344.188-3.906-.875-3.094-1.281-5.062-4.438-5.219-4.656-.156-.219-1.25-1.656-1.25-3.156s.781-2.219 1.062-2.531c.281-.312.625-.375.844-.375.219 0 .438 0 .625.031.219.031.5.094.781.781.312.781 1.062 2.594 1.156 2.781.094.188.156.406.031.656-.125.25-.188.406-.375.625-.188.219-.406.469-.562.625-.188.188-.375.406-.156.781.219.375.969 1.594 2.062 2.562 1.406 1.25 2.594 1.625 2.969 1.812.375.188.594.156.812-.094.219-.25.938-1.094 1.188-1.469.25-.375.5-.312.844-.188.344.125 2.188 1.031 2.562 1.219.375.188.625.281.719.438.094.156.094.906-.188 1.656z" />
    </svg>
  )
}

type ContactSectionProps = {
  data: Portfolio['contact']
  watermark: string
}

export function ContactSection({ data, watermark }: ContactSectionProps) {
  return (
    <section id="contact" className="container">
      <div id="contact-intro" className="contact-intro-panel">
        <div id="contact-intro-inner" className="contact-intro-inner">
          <span className="section-number reveal-text">{data.sectionNumber}</span>
          <h2 className="contact-title reveal-text font-display">
            {data.titleLine1} <br />
            <span className="text-outline">{data.titleLine2Outline}</span>
          </h2>
        </div>
      </div>

      <div id="contact-channels" className="contact-channels-panel">
        <div id="contact-channels-anchor" className="contact-container">
          {data.availability || data.responseTime ? (
            <div className="contact-status reveal-text">
              {data.availability ? (
                <span className="contact-status-badge">
                  <span className="contact-status-dot" aria-hidden />
                  {data.availability}
                </span>
              ) : null}
              {data.responseTime ? (
                <span className="contact-status-note">{data.responseTime}</span>
              ) : null}
            </div>
          ) : null}

          <div className="magnetic-wrap reveal-text">
            <a
              href={`mailto:${data.email}`}
              className="contact-email hover-target magnetic-btn"
              data-strength="15"
            >
              {data.email}
            </a>
          </div>

          <div className="contact-channels reveal-text">
            {data.whatsappHref ? (
              <a
                href={data.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary hover-target contact-whatsapp"
              >
                <WhatsAppIcon />
                {data.whatsappLabel ?? 'WhatsApp'}
              </a>
            ) : null}
            {data.cvHref ? (
              <a
                href={data.cvHref}
                download
                className="btn btn-outline hover-target"
              >
                {data.cvLabel ?? 'Baixar CV'}
              </a>
            ) : null}
          </div>

          <div className="social-links reveal-text">
            {data.socials.map((s) => (
              <div key={s.href} className="magnetic-wrap">
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn hover-target magnetic-btn"
                  data-strength="30"
                  aria-label={s.label}
                >
                  {s.network === 'github' ? <GitHubIcon /> : <LinkedInIcon />}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bg-text" aria-hidden>
        {watermark}
      </div>

      <footer className="footer-bottom">
        <span>{data.footerCopyright}</span>
        <span>{data.footerTechNote}</span>
      </footer>
    </section>
  )
}
