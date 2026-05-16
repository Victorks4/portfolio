import type { ReactNode } from 'react'
import type { Portfolio } from '../../types/portfolio'

function Paragraph({
  text,
  highlights,
}: {
  text: string
  highlights?: string[]
}) {
  if (!highlights?.length) {
    return <p className="reveal-text">{text}</p>
  }

  const parts: ReactNode[] = []
  let remaining = text

  highlights.forEach((phrase, idx) => {
    const i = remaining.indexOf(phrase)
    if (i === -1) return
    if (i > 0) {
      parts.push(remaining.slice(0, i))
    }
    parts.push(
      <span key={`${phrase}-${idx}`} className="about-highlight">
        {phrase}
      </span>,
    )
    remaining = remaining.slice(i + phrase.length)
  })
  if (remaining) parts.push(remaining)

  return <p className="reveal-text">{parts}</p>
}

type AboutProps = {
  data: Portfolio['about']
}

export function About({ data }: AboutProps) {
  return (
    <section id="about" className="container">
      <div className="section-header reveal-wrap">
        <span className="section-number">{data.sectionNumber}</span>
        <h2 className="section-title text-outline reveal-text">{data.sectionTitle}</h2>
      </div>

      <div className="about-grid">
        <div className="about-structure hover-target magnetic-btn" data-strength="10">
          <div className="about-structure-inner">
            {data.codeLines.map((line, i) => (
              <span
                key={i}
                className="code-line"
                dangerouslySetInnerHTML={{ __html: line || '\u00a0' }}
              />
            ))}
          </div>
        </div>

        <div className="about-text-content glass-panel">
          {data.paragraphs.map((p, i) => (
            <Paragraph key={i} text={p.text} highlights={p.highlights} />
          ))}

          <div className="about-stats">
            {data.stats.map((s) => (
              <div key={s.label} className="stat-item reveal-text">
                <span
                  className="stat-number counter"
                  data-target={s.value}
                >
                  0
                </span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
