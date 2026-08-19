let recordedPathname =
  typeof window !== 'undefined' ? window.location.pathname : '/'

let pendingReturnToProjects = false

const WAS_ON_PROJECT_KEY = 'devsantos:was-on-project'
const RETURN_LOCK_UNTIL_KEY = 'devsantos:return-lock-until'

const RETURN_LOCK_MS = 2500

/** Só reage quando o pathname muda — hash/lenis não resetam o retorno ao carrossel. */
export function commitPathnameNavigation(pathname: string): void {
  if (pathname === recordedPathname) return

  if (recordedPathname.startsWith('/projetos/') && pathname === '/') {
    pendingReturnToProjects = true
    armReturnToProjectsLock()
  }

  recordedPathname = pathname
}

export function markWasOnProjectPage(): void {
  try {
    window.sessionStorage.setItem(WAS_ON_PROJECT_KEY, '1')
  } catch {
    // sessionStorage indisponível
  }
}

export function peekWasOnProjectPage(): boolean {
  try {
    return window.sessionStorage.getItem(WAS_ON_PROJECT_KEY) === '1'
  } catch {
    return false
  }
}

export function clearWasOnProjectPage(): void {
  try {
    window.sessionStorage.removeItem(WAS_ON_PROJECT_KEY)
  } catch {
    // sessionStorage indisponível
  }
}

function armReturnToProjectsLock(): void {
  try {
    window.sessionStorage.setItem(
      RETURN_LOCK_UNTIL_KEY,
      String(Date.now() + RETURN_LOCK_MS),
    )
  } catch {
    // sessionStorage indisponível
  }
}

export function isReturnToProjectsLocked(): boolean {
  try {
    const until = window.sessionStorage.getItem(RETURN_LOCK_UNTIL_KEY)
    if (!until) return false
    if (Date.now() > Number(until)) {
      window.sessionStorage.removeItem(RETURN_LOCK_UNTIL_KEY)
      return false
    }
    return true
  } catch {
    return false
  }
}

export function clearReturnToProjectsLock(): void {
  try {
    window.sessionStorage.removeItem(RETURN_LOCK_UNTIL_KEY)
  } catch {
    // sessionStorage indisponível
  }
}

export function shouldReturnToProjects(): boolean {
  return (
    pendingReturnToProjects ||
    peekWasOnProjectPage() ||
    isReturnToProjectsLocked()
  )
}

export function clearPendingReturnToProjects(): void {
  pendingReturnToProjects = false
  clearWasOnProjectPage()
  clearReturnToProjectsLock()
}

export function shouldIgnoreHashNavigation(): boolean {
  return shouldReturnToProjects()
}
