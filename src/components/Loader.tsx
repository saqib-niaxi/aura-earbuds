import { useRef, useState } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { finishIntro } from '../lib/intro'

// Intro screen: logo letters rise, a counter runs to 100, then the panel lifts away.
// Waits for web fonts so the hero never flashes in a fallback font.
export default function Loader() {
  const root = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLSpanElement>(null)
  const [done, setDone] = useState(() => prefersReducedMotion())

  useGSAP((_, contextSafe) => {
    if (done) {
      finishIntro()
      return
    }
    const fontsReady = document.fonts?.ready ?? Promise.resolve()
    const counter = { v: 0 }

    const exit = contextSafe!(() => {
      gsap.timeline()
        .to('.loader-letter', { yPercent: -110, duration: 0.6, stagger: 0.05, ease: 'power3.in' })
        .to('.loader-meta', { opacity: 0, duration: 0.3 }, '<')
        .to(root.current, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '-=0.15')
        .add(finishIntro, '-=0.55')
        .add(() => setDone(true))
    })

    gsap.timeline({ onComplete: () => { void fontsReady.then(exit) } })
      .from('.loader-letter', { yPercent: 110, duration: 0.9, stagger: 0.07, ease: 'power4.out' })
      .to(counter, {
        v: 100, duration: 1.3, ease: 'power2.inOut',
        onUpdate: () => { if (count.current) count.current.textContent = String(Math.round(counter.v)) },
      }, 0)
      .fromTo('.loader-bar i', { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: 'power2.inOut' }, 0)
  }, { scope: root })

  if (done) return null
  return (
    <div className="loader" ref={root} aria-hidden="true">
      <div className="loader-logo">
        {[...'AURA'].map((c, i) => (
          <span className="loader-mask" key={i}><span className="loader-letter">{c}</span></span>
        ))}
      </div>
      <div className="loader-meta mono">
        <span>HEAR WHAT SILENCE SOUNDS LIKE</span>
        <span><span ref={count}>0</span>%</span>
      </div>
      <div className="loader-bar loader-meta"><i /></div>
    </div>
  )
}
