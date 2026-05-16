import { useState } from 'react'
import type { Portfolio } from '../../types/portfolio'
import { useLenisContext } from '../../hooks/useLenisContext'

function splitChars(text: string) {
  return text.split('').map((char, i) => (
    <span key={`${text}-${i}`} className="split-char">
      {char === ' ' ? '\u00a0' : char}
    </span>
  ))
}

type HeroProps = {
  data: Portfolio['hero']
}

export function Hero({ data }: HeroProps) {
  const [imgSrc, setImgSrc] = useState(data.portraitSrc)
  const { scrollToHash } = useLenisContext()

  return (
    <section id="hero" className="container">
      <div className="hero-layout">
        <div className="hero-content">
          <span className="hero-greeting">{data.greeting}</span>

          <h1 className="sr-only">
            {data.nameLines[0]} {data.nameLines[1]}
          </h1>

          <div className="hero-title-wrapper" aria-hidden>
            <span className="hero-title split-text font-display">
              {splitChars(data.nameLines[0])}
            </span>
          </div>
          <div className="hero-title-wrapper" aria-hidden>
            <span className="hero-title split-text text-outline font-display">
              {splitChars(data.nameLines[1])}
            </span>
          </div>

          <h2 className="hero-subtitle split-text font-display">{data.subtitle}</h2>
          <p className="hero-desc">{data.description}</p>
          <div className="hero-actions">
            <div className="magnetic-wrap">
              <a
                href={data.primaryCta.href}
                className="btn btn-primary hover-target magnetic-btn"
                data-strength="40"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToHash(data.primaryCta.href)
                }}
              >
                {data.primaryCta.label}
              </a>
            </div>
            <div className="magnetic-wrap">
              <a
                href={data.secondaryCta.href}
                className="btn btn-outline hover-target magnetic-btn"
                data-strength="30"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToHash(data.secondaryCta.href)
                }}
              >
                {data.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>

        <div
          className="hero-visual magnetic-btn hover-target"
          data-strength="20"
        >
          <div className="hero-visual-decor" aria-hidden />
          <div className="hero-visual-decor-inner" aria-hidden />
          <div className="hero-image-container">
            <img
              src={imgSrc}
              alt={data.portraitAlt}
              className="hero-image"
              width={450}
              height={560}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              onError={() => setImgSrc(data.portraitFallbackSrc)}
            />
            <div className="hero-image-glitch" aria-hidden />
          </div>
        </div>
      </div>

      <div className="scroll-indicator" aria-hidden>
        <span className="scroll-text">Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  )
}
