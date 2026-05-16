import type { NavItem } from '../../types/portfolio'
import { useLenisContext } from '../../hooks/useLenisContext'
import { useState } from 'react'

type NavbarProps = {
  logoLabel: string
  items: NavItem[]
}

export function Navbar({ logoLabel, items }: NavbarProps) {
  const { scrollToHash } = useLenisContext()
  const [open, setOpen] = useState(false)

  const navigate = (href: string) => {
    scrollToHash(href)
    setOpen(false)
  }

  return (
    <header id="header">
      <a
        href="#hero"
        className="nav-logo hover-target magnetic-wrap"
        aria-label="Início"
        onClick={(e) => {
          e.preventDefault()
          navigate('#hero')
        }}
      >
        <span className="nav-logo-dot" aria-hidden />
        <span>{logoLabel}</span>
      </a>
      <ul className={`nav-links${open ? ' active' : ''}`} id="nav-links">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="nav-link hover-target"
              onClick={(e) => {
                e.preventDefault()
                navigate(item.href)
              }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="menu-btn hover-target"
        id="menu-btn"
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span
          style={
            open
              ? { transform: 'rotate(45deg) translate(5px, 5px)' }
              : undefined
          }
        />
        <span style={open ? { opacity: 0 } : undefined} />
        <span
          style={
            open
              ? { transform: 'rotate(-45deg) translate(7px, -6px)' }
              : undefined
          }
        />
      </button>
    </header>
  )
}
