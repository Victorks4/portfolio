const FALLBACK_RGB = '0, 255, 204'

/** Converte `#rrggbb` (ou `#rgb`) no formato `r, g, b` aceito dentro de `rgba()`. */
export function hexToRgbTriplet(hex: string): string {
  const clean = hex.replace('#', '')
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean

  if (!/^[0-9a-f]{6}$/i.test(full)) return FALLBACK_RGB

  const int = Number.parseInt(full, 16)
  return `${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}`
}
