import type { Portfolio } from '../../types/portfolio'

type TimelineProps = {
  data: Portfolio['timeline']
}

export function Timeline({ data }: TimelineProps) {
  return (
    <section id="timeline" className="container">
      <div className="section-header reveal-wrap items-center text-center self-center w-full">
        <span className="section-number">{data.sectionNumber}</span>
        <h2 className="section-title reveal-text font-display">
          Minha <span className="text-gradient-cyan">Jornada</span>
        </h2>
      </div>

      <div className="timeline-container">
        <div className="timeline-line-wrap" aria-hidden>
          <div className="timeline-line-progress" id="timeline-progress" />
        </div>
        <div id="timeline-items-container">
          {data.entries.map((item) => (
            <div key={item.year + item.title} className="timeline-item">
              <div className="timeline-node" aria-hidden />
              <article className="timeline-content hover-target">
                <div className="timeline-year">{item.year}</div>
                <h3 className="timeline-title">{item.title}</h3>
                <p className="timeline-desc">{item.description}</p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
