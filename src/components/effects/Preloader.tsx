import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'

type PreloaderProps = {
  brand: string
  logs: string[]
  onDone: () => void
}

export function Preloader({ brand, logs, onDone }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('Iniciando Kernel...')
  const finishedRef = useRef(false)

  useEffect(() => {
    const terminal = terminalRef.current
    let logIndex = 0
    const logInterval = window.setInterval(() => {
      if (logIndex >= logs.length || !terminal) return
      const p = document.createElement('p')
      p.className = 'loader-log'
      p.textContent = logs[logIndex]
      terminal.appendChild(p)
      gsap.to(p, { opacity: 1, y: 0, duration: 0.3 })
      logIndex++
    }, 400)

    let prog = 0
    const progInterval = window.setInterval(() => {
      if (finishedRef.current) return
      prog += Math.floor(Math.random() * 8) + 1
      if (prog > 30) setStatus('Gerando Geometria Procedural...')
      if (prog > 70) setStatus('Sincronizando GSAP Timelines...')
      if (prog >= 100) {
        prog = 100
        setProgress(100)
        setStatus('Acesso Concedido.')
        window.clearInterval(progInterval)
        window.clearInterval(logInterval)
        finishedRef.current = true
        window.setTimeout(() => {
          const el = rootRef.current
          if (el) {
            gsap.to(el, {
              yPercent: -100,
              duration: 1.2,
              ease: 'expo.inOut',
              onComplete: () => onDone(),
            })
          } else {
            onDone()
          }
        }, 800)
        return
      }
      setProgress(prog)
    }, 120)

    return () => {
      window.clearInterval(logInterval)
      window.clearInterval(progInterval)
    }
  }, [logs, onDone])

  return (
    <div id="preloader" ref={rootRef}>
      <div className="loader-terminal" ref={terminalRef} />
      <div className="loader-center">
        <h1 className="loader-title">{brand}</h1>
        <div className="loader-progress-wrapper">
          <div
            className="loader-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="loader-percentage">
          {progress.toString().padStart(3, '0')}%
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            marginTop: '10px',
            color: 'var(--color-text-muted)',
            fontSize: '12px',
          }}
        >
          {status}
        </div>
      </div>
    </div>
  )
}
