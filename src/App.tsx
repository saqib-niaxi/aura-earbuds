import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap, hasFinePointer, prefersReducedMotion, ScrollTrigger, useGSAP } from './lib/gsap'
import { introDone } from './lib/intro'
import { VARIANTS, type VariantId } from './data'
import Loader from './components/Loader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Reveal from './components/Reveal'
import Features from './components/Features'
import Exploded from './components/Exploded'
import Finish from './components/Finish'
import Strip from './components/Strip'
import { CTA, Footer, Press, Specs } from './components/Closing'

export default function App() {
  const page = useRef<HTMLDivElement>(null)
  const [variant, setVariant] = useState<VariantId>('midnight')

  // Smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync.
  // Scrolling stays locked until the intro loader has lifted.
  useEffect(() => {
    if (prefersReducedMotion()) return
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    const lenis = new Lenis({ anchors: true })
    lenis.stop()
    let alive = true
    introDone.then(() => alive && lenis.start())
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      alive = false
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  // Web fonts change text heights, so re-measure every trigger once they land.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  // Picking a finish tweens the page's colour variables, so every glow follows.
  useGSAP(() => {
    const v = VARIANTS[variant]
    gsap.to(page.current, {
      '--a': v.a, '--b': v.b, '--body': v.body, '--hi': v.hi, '--shade': v.shade, '--tip': v.tip,
      duration: prefersReducedMotion() ? 0 : 0.8, ease: 'power2.out', overwrite: true,
    })
  }, { dependencies: [variant] })

  // Generic fade-up for anything marked data-reveal. Created last, after all pins exist.
  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.set('[data-reveal]', { y: 40, opacity: 0 })
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 88%',
      once: true,
      onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: 'power3.out' }),
    })
  }, { scope: page })

  // Magnetic buttons: pulled 0.3× toward the cursor, label 0.15×, elastic snap-back.
  useEffect(() => {
    if (prefersReducedMotion() || !hasFinePointer() || !page.current) return
    const cleanups = [...page.current.querySelectorAll<HTMLElement>('[data-magnetic]')].map((el) => {
      const label = el.querySelector<HTMLElement>('.btn-label')
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        const x = e.clientX - (r.left + r.width / 2)
        const y = e.clientY - (r.top + r.height / 2)
        gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power3.out' })
        if (label) gsap.to(label, { x: x * 0.15, y: y * 0.15, duration: 0.4, ease: 'power3.out' })
      }
      const leave = () => gsap.to([el, label].filter(Boolean), { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' })
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      return () => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', leave)
      }
    })
    return () => cleanups.forEach((fn) => fn())
  }, [])

  return (
    <div className="page" ref={page}>
      <Loader />
      <a href="#product" className="skip-link">Skip to content</a>
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <Nav />
      <main>
        <Hero variant={variant} />
        <Reveal />
        <Features />
        <Exploded />
        <Finish variant={variant} onChange={setVariant} />
        <Strip />
        <Specs />
        <Press />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
