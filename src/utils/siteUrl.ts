import { portfolio } from '../data/portfolio'

/**
 * Monta URL absoluta a partir de um caminho do site.
 * Previews sociais (WhatsApp, LinkedIn) ignoram caminhos relativos em `og:image`.
 */
export function absoluteUrl(path: string): string {
  const base = (portfolio.meta.siteUrl ?? '').replace(/\/$/, '')
  if (!base) return path
  if (/^https?:\/\//i.test(path)) return path
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}
