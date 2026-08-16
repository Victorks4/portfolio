import { portfolio } from '../data/portfolio'

let started = false

/** Aquece chunk WebGL, fontes e retrato do hero durante o preloader. */
export function startBootPreload(): void {
  if (started || typeof window === 'undefined') return
  started = true

  void import('../effects/webgl/WebGLBackground')
  void document.fonts?.ready

  const portrait =
    portfolio.hero.portraitWebpSrc ?? portfolio.hero.portraitSrc
  const img = new Image()
  img.decoding = 'async'
  img.fetchPriority = 'high'
  img.src = portrait
}

export function applyBootRevealedBodyClass(enabled: boolean): () => void {
  if (typeof document === 'undefined') return () => undefined

  document.body.classList.toggle('boot-revealed', enabled)
  return () => document.body.classList.remove('boot-revealed')
}
