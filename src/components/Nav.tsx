import { useEffect, useState } from 'react'
import { ScrollTrigger, useGSAP } from '../lib/gsap'
import { PRICE } from '../data'
import { Close, Menu } from './Icons'

const LINKS = [
  ['product', 'Product'],
  ['features', 'Features'],
  ['specs', 'Specs'],
  ['buy', 'Buy'],
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Highlight the link for whichever section is in the middle of the screen.
  useGSAP(() => {
    LINKS.forEach(([id]) => {
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top 50%',
        end: 'bottom 50%',
        refreshPriority: -1, // measure after the pinned sections above have added their spacing
        onToggle: (self) => setActive((cur) => (self.isActive ? id : cur === id ? null : cur)),
      })
    })
  })

  const close = () => setOpen(false)

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#top" className="logo" onClick={close}>AURA</a>
        <nav className="navlinks" aria-label="Main">
          {LINKS.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={active === id ? 'is-active' : undefined} aria-current={active === id ? 'true' : undefined}>
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <a href="#buy" className="btn btn-primary btn-sm nav-cta" data-magnetic>
            <span className="btn-label">Pre-order</span>
          </a>
          <button
            type="button"
            className="menu-btn"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile">
          {LINKS.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={close}>{label}</a>
          ))}
          <a href="#buy" className="btn btn-primary" onClick={close}>Pre-order — {PRICE}</a>
        </nav>
      )}
    </header>
  )
}
