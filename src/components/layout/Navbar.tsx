import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { NavItem } from '../../types/portfolio'
import { useLenisContext } from '../../hooks/useLenisContext'
import { markScrollTarget } from '../../utils/scrollTarget'

type NavbarProps = {
  logoLabel: string
  items: NavItem[]
  contactCta: NavItem
}

export function Navbar({ logoLabel, items, contactCta }: NavbarProps) {
  const { scrollToHash } = useLenisContext()
  const { pathname } = useLocation()
  const routerNavigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [activeHash, setActiveHash] = useState('')

  const isHome = pathname === '/'
  const activeSection = isHome ? activeHash : ''

  useEffect(() => {
    if (!isHome) return

    const triggers = items
      .filter((item) => document.querySelector(item.href))
      .map((item) =>
        ScrollTrigger.create({
          trigger: item.href,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => {
            if (self.isActive) setActiveHash(item.href)
          },
        }),
      )

    return () => triggers.forEach((trigger) => trigger.kill())
  }, [isHome, items])

  const navigate = (href: string) => {
    setOpen(false)
    if (isHome) {
      scrollToHash(href)
    } else {
      markScrollTarget(href)
      routerNavigate(`/${href}`)
    }
  }

  return (
    <header id="header">
      <a
        href={isHome ? '#hero' : '/'}
        className="nav-logo hover-target magnetic-wrap"
        aria-label="Início"
        onClick={(e) => {
          e.preventDefault()
          if (isHome) {
            scrollToHash('#hero')
            setOpen(false)
          } else {
            setOpen(false)
            routerNavigate('/')
          }
        }}
      >
        <span className="nav-logo-dot" aria-hidden />
        <span>{logoLabel}</span>
      </a>
      <ul className={`nav-links${open ? ' active' : ''}`} id="nav-links">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={isHome ? item.href : `/${item.href}`}
              className={`nav-link hover-target${
                activeSection === item.href ? ' is-active' : ''
              }`}
              aria-current={activeSection === item.href ? 'true' : undefined}
              onClick={(e) => {
                e.preventDefault()
                navigate(item.href)
              }}
            >
              {item.label}
            </a>
          </li>
        ))}
        <li>
          <a
            href={isHome ? contactCta.href : `/${contactCta.href}`}
            className="nav-cta hover-target"
            onClick={(e) => {
              e.preventDefault()
              navigate(contactCta.href)
            }}
          >
            {contactCta.label}
          </a>
        </li>
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
