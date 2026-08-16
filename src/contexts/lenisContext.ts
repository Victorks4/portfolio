import { createContext } from 'react'
import type Lenis from 'lenis'
import type { PerformanceConfig, PerformanceTier } from '../utils/performanceTier'

export type LenisContextValue = {
  lenis: Lenis | null
  scrollToHash: (hash: string) => void
  perfConfig: PerformanceConfig
  applyTier: (tier: PerformanceTier) => void
}

export const LenisContext = createContext<LenisContextValue | null>(null)
