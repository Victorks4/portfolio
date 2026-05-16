import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useMemo, useEffect, useRef, useState, lazy, Suspense, useCallback } from 'react'
import { LenisProvider } from './contexts/LenisProvider'
import { useLenisContext } from './hooks/useLenisContext'
import { useBreakpoint, useIsTouch } from './hooks/useMediaQuery'
import { portfolio } from './data/portfolio'
import { Navbar } from './components/layout/Navbar'
import { Hero } from './components/sections/Hero'
import { About } from './components/sections/About'
import { Skills } from './components/sections/Skills'
import { ProjectGallery } from './components/projects/ProjectGallery'
import { Timeline } from './components/sections/Timeline'
import { ContactSection } from './components/sections/ContactSection'
import { Preloader } from './components/effects/Preloader'
import { CustomCursor } from './components/effects/CustomCursor'
import { usePortfolioAnimations } from './hooks/usePortfolioAnimations'
import type { WebGLApi } from './effects/webgl/WebGLBackground'

const WebGLBackground = lazy(() =>
  import('./effects/webgl/WebGLBackground').then((m) => ({
    default: m.WebGLBackground,
  })),
)

function Shell() {
  const { lenis } = useLenisContext()
  const [showPreloader, setShowPreloader] = useState(true)
  const [introReady, setIntroReady] = useState(false)
  const [webglOn, setWebglOn] = useState(false)
  const morphApiRef = useRef<WebGLApi | null>(null)

  const onWebglReady = useCallback((api: WebGLApi) => {
    morphApiRef.current = api
  }, [])

  const breakpoint = useBreakpoint()
  const isTouch = useIsTouch()
  const isMobile = breakpoint === 'mobile'
  const isTablet = breakpoint === 'tablet'

  const customCursor = useMemo(() => {
    if (typeof window === 'undefined') return false
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const finePointer = window.matchMedia('(pointer: fine)').matches
    return finePointer && !reduceMotion && !isTouch && !isMobile
  }, [isMobile, isTouch])

  useEffect(() => {
    if (customCursor) {
      document.body.classList.add('custom-cursor-active')
    }
    return () => document.body.classList.remove('custom-cursor-active')
  }, [customCursor])

  useEffect(() => {
    const body = document.body
    body.classList.toggle('is-mobile', isMobile)
    body.classList.toggle('is-tablet', isTablet)
    body.classList.toggle('is-desktop', !isMobile && !isTablet)
    body.classList.toggle('is-touch', isTouch)
    return () => {
      body.classList.remove('is-mobile', 'is-tablet', 'is-desktop', 'is-touch')
    }
  }, [isMobile, isTablet, isTouch])

  usePortfolioAnimations({
    lenis,
    introReady,
    morphApiRef,
  })

  return (
    <>
      <Helmet>
        <title>{portfolio.meta.title}</title>
        <meta name="description" content={portfolio.meta.description} />
        <meta name="author" content={portfolio.meta.author} />
        <meta name="theme-color" content={portfolio.meta.themeColor} />
        <meta name="robots" content={portfolio.meta.robots} />
        <meta property="og:type" content={portfolio.meta.ogType} />
        <meta property="og:title" content={portfolio.meta.ogTitle} />
        <meta
          property="og:description"
          content={portfolio.meta.ogDescription}
        />
      </Helmet>

      {showPreloader && (
        <Preloader
          brand={portfolio.brand.loaderBrand}
          logs={portfolio.preloaderLogs}
          onDone={() => {
            setShowPreloader(false)
            setIntroReady(true)
            setWebglOn(true)
          }}
        />
      )}

      <CustomCursor enabled={customCursor} />

      {webglOn && (
        <Suspense fallback={null}>
          <WebGLBackground
            lenis={lenis}
            onReady={onWebglReady}
          />
        </Suspense>
      )}

      <div className="crt-overlay" aria-hidden />
      <div className="vignette-overlay" aria-hidden />

      <Navbar logoLabel={portfolio.brand.navLogo} items={portfolio.navigation} />

      <main id="smooth-wrapper">
        <div id="smooth-content">
          <Hero data={portfolio.hero} />
          <About data={portfolio.about} />
          <Skills data={portfolio.skills} />
          <ProjectGallery data={portfolio.projects} />
          <Timeline data={portfolio.timeline} />
          <ContactSection
            data={portfolio.contact}
            watermark={portfolio.brand.footerWatermark}
          />
        </div>
      </main>
    </>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <LenisProvider>
        <Shell />
      </LenisProvider>
    </HelmetProvider>
  )
}
