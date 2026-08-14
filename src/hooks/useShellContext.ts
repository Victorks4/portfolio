import { useOutletContext } from 'react-router-dom'
import type { MutableRefObject } from 'react'
import type { WebGLApi } from '../effects/webgl/WebGLBackground'

export type ShellContext = {
  /** True quando o preloader terminou (ou nunca precisou rodar). */
  introReady: boolean
  /** API do fundo WebGL para trocar a forma das partículas por seção. */
  morphApiRef: MutableRefObject<WebGLApi | null>
}

export function useShellContext() {
  return useOutletContext<ShellContext>()
}
