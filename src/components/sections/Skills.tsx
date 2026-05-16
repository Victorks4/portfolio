import type { Portfolio } from '../../types/portfolio'

type SkillsProps = {
  data: Portfolio['skills']
}

export function Skills({ data }: SkillsProps) {
  return (
    <section id="skills" className="container">
      <div className="section-header reveal-wrap">
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
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top
                    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
                    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
                  }}
                >
                  <svg className="skill-icon" viewBox="0 0 24 24" aria-hidden>
                    <path d={skill.iconD} />
                  </svg>
                  <span className="skill-name">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
