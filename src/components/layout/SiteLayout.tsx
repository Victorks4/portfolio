import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { portfolio } from '../../data/portfolio'
import { useLenisContext } from '../../hooks/useLenisContext'
import { useLenisGsapBridge } from '../../hooks/useLenisGsapBridge'
import { useRouteScrollReset } from '../../hooks/useRouteScrollReset'
import { useAdaptivePerformance } from '../../hooks/useAdaptivePerformance'
import { useFpsMeter } from '../../hooks/useFpsMeter'
import { useBreakpoint, useIsTouch } from '../../hooks/useMediaQuery'
import type { ShellContext } from '../../hooks/useShellContext'
import type { WebGLApi } from '../../effects/webgl/WebGLBackground'
import {
  applyBootRevealedBodyClass,
  startBootPreload,
} from '../../utils/bootPreload'
import { Navbar } from './Navbar'
import { Preloader } from '../effects/Preloader'
import { CustomCursor } from '../effects/CustomCursor'

const WebGLBackground = lazy(() =>
  import('../../effects/webgl/WebGLBackground').then((m) => ({
    default: m.WebGLBackground,
  })),
)

const PRELOADER_SESSION_KEY = 'devsantos:preloader-done'

function shouldRunPreloader(pathname: string): boolean {
  if (typeof window === 'undefined') return false
  if (pathname !== '/') return false
  try {
    return window.sessionStorage.getItem(PRELOADER_SESSION_KEY) !== '1'
  } catch {
    return true
  }
}

export function SiteLayout() {
  const { pathname } = useLocation()
  const { lenis, perfConfig, applyTier } = useLenisContext()

  const [runsPreloader] = useState(() => shouldRunPreloader(pathname))
  const [showPreloader, setShowPreloader] = useState(runsPreloader)
  const [introReady, setIntroReady] = useState(!runsPreloader)

  const morphApiRef = useRef<WebGLApi | null>(null)

  const onWebglReady = useCallback((api: WebGLApi) => {
    morphApiRef.current = api
  }, [])

  const onRevealStart = useCallback(() => {
    setIntroReady(true)
  }, [])

  const onPreloaderDone = useCallback(() => {
    try {
      window.sessionStorage.setItem(PRELOADER_SESSION_KEY, '1')
    } catch {
      // sessionStorage indisponível (modo privado); seguimos sem persistir.
    }
    setShowPreloader(false)
  }, [])

  useEffect(() => {
    if (runsPreloader) startBootPreload()
  }, [runsPreloader])

  useEffect(() => {
    if (!introReady) return
    return applyBootRevealedBodyClass(true)
  }, [introReady])

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
    return (
      finePointer &&
      !reduceMotion &&
      !isTouch &&
      !isMobile &&
      perfConfig.tier !== 'low'
    )
  }, [isMobile, isTouch, perfConfig.tier])

  useFpsMeter()
  useAdaptivePerformance({
    tier: perfConfig.tier,
    onTierDowngrade: applyTier,
  })

  useLenisGsapBridge(lenis)
  useRouteScrollReset()

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

  const isHome = pathname === '/'
  const showWebGL = perfConfig.enableWebGL
  const showCrt = perfConfig.enableCrt

  const outletContext: ShellContext = useMemo(
    () => ({ introReady, morphApiRef }),
    [introReady],
  )

  return (
    <>
      {showPreloader && (
        <Preloader
          brand={portfolio.brand.loaderBrand}
          logs={portfolio.preloaderLogs}
          onRevealStart={onRevealStart}
          onDone={onPreloaderDone}
        />
      )}

      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>

      <CustomCursor enabled={customCursor} />

      {!showWebGL ? <div className="webgl-fallback" aria-hidden /> : null}

      {showWebGL ? (
        <Suspense fallback={<div className="webgl-fallback" aria-hidden />}>
          <WebGLBackground
            lenis={lenis}
            perfConfig={perfConfig}
            onReady={onWebglReady}
            heroAnchor={isHome ? '#hero' : '#project-hero'}
          />
        </Suspense>
      ) : null}

      {showCrt ? (
        <>
          <div className="crt-overlay" aria-hidden />
          <div className="vignette-overlay" aria-hidden />
        </>
      ) : null}

      <Navbar
        logoLabel={portfolio.brand.navLogo}
        items={portfolio.navigation}
        contactCta={portfolio.brand.navCta}
      />

      <main id="conteudo" tabIndex={-1}>
        <Outlet context={outletContext} />
      </main>
    </>
  )
}
