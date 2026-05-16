import { useContext } from 'react'
import { LenisContext } from '../contexts/lenisContext'

export function useLenisContext() {
  const ctx = useContext(LenisContext)
  if (!ctx) {
    throw new Error('useLenisContext must be used within LenisProvider')
  }
  return ctx
}
