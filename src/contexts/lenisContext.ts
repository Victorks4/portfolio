import { createContext } from 'react'
import type Lenis from 'lenis'

export type LenisContextValue = {
  lenis: Lenis | null
  scrollToHash: (hash: string) => void
}

export const LenisContext = createContext<LenisContextValue | null>(null)
