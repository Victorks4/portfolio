import type { Portfolio } from '../../types/portfolio'

type SkillsProps = {
  data: Portfolio['skills']
}

export function Skills({ data }: SkillsProps) {
  return (
    <section id="skills" className="container">
      <div className="section-header reveal-wrap" id="skills-anchor">
        <span className="section-number">{data.sectionNumber}</span>
        <h2 className="section-title reveal-text font-display">
          Tech <span className="text-gradient-purple">Stack</span>
        </h2>
      </div>
      <div className="skills-container" id="skills-container">
        {data.categories.map((category) => (
          <div key={category.category} className="skill-category">
            <div className="skill-category-header reveal-wrap">
              <h3 className="skill-category-title reveal-text">{category.category}</h3>
            </div>
            <div className="skills-grid">
              {category.items.map((skill) => (
                <div
                  key={skill.name}
                  className="skill-card hover-target"
                  tabIndex={0}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top
                    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
                    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
                  }}
                >
                  <div className="skill-icon-slot" aria-hidden>
                    <svg
                      className="skill-icon"
                      viewBox={skill.iconViewBox ?? '0 0 24 24'}
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <path d={skill.iconD} fill="currentColor" />
                    </svg>
                  </div>
                  <span className="skill-name">{skill.name}</span>
                  <span
                    className={`skill-used-in${skill.usedIn?.length ? '' : ' skill-used-in--empty'}`}
                    aria-hidden={!skill.usedIn?.length}
                  >
                    {skill.usedIn?.join(' · ') ?? ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
