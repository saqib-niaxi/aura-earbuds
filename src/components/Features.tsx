import { useRef, type PointerEvent } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { Battery, Drop, Orbit, Wave } from './Icons'
import NoiseDemo from './NoiseDemo'

const BARS = [48, 30, 52, 22, 12, 6, 4, 4, 4]

// Moves the hover spotlight (see .card::after) to the pointer.
const spotlight = (e: PointerEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
}

export default function Features() {
  const root = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    const once = (trigger: string | Element, start = 'top 80%') => ({ trigger, start, once: true })

    gsap.from('.bento > .card', { y: 40, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', scrollTrigger: once('.bento') })

    gsap.utils.toArray<HTMLElement>('[data-count]', root.current).forEach((el) => {
      const counter = { v: 0 }
      el.textContent = '0'
      gsap.to(counter, {
        v: Number(el.dataset.count), duration: 1.6, ease: 'power2.out', scrollTrigger: once(el),
        onUpdate: () => { el.textContent = String(Math.round(counter.v)) },
      })
    })

    gsap.from('.battery i', { scaleX: 0, transformOrigin: 'left center', duration: 0.35, stagger: 0.08, delay: 1.2, ease: 'power2.out', scrollTrigger: once('.battery') })
  }, { scope: root })

  return (
    <section id="features" className="section" ref={root}>
      <div className="wrap">
        <div className="eyebrow" data-reveal>03 — FEATURES</div>
        <h2 className="h2 features-title" data-reveal>
          Small enough to forget.<br /><span>Good enough to remember.</span>
        </h2>

        <div className="bento">
          <article className="glass card feature feature-battery b-a" onPointerMove={spotlight}>
            <div className="bg-glow" aria-hidden="true" />
            <Battery />
            <div>
              <div className="big-stat" aria-label="40 hours">
                <span data-count="40" aria-hidden="true">40</span>
                <span className="grad-text" aria-hidden="true">h</span>
              </div>
              <div className="battery" aria-hidden="true">
                {Array.from({ length: 8 }, (_, i) => (
                  <i key={i} style={{ background: `color-mix(in srgb, var(--a) ${100 - Math.round((i * 100) / 7)}%, var(--b))` }} />
                ))}
              </div>
              <h3>40-hour battery</h3>
              <p>With the case. Five minutes of charge buys an hour of listening.</p>
            </div>
          </article>

          <article className="glass card feature feature-anc b-b" onPointerMove={spotlight}>
            <div className="anc-top">
              <Wave />
              <div className="anc-bars" aria-hidden="true">
                {BARS.map((h, i) => (
                  <i key={i} style={{ height: h, background: i < 4 ? 'rgba(255,255,255,.18)' : i < 6 ? 'var(--a)' : 'var(--b)' }} />
                ))}
              </div>
            </div>
            <div>
              <div className="stat" aria-label="minus 42 decibels">
                <span aria-hidden="true">−<span data-count="42">42</span><small> dB</small></span>
              </div>
              <h3>Adaptive Noise Cancelling</h3>
              <p>Re-tunes to your ear and the room, every moment.</p>
            </div>
          </article>

          <article className="glass card feature" onPointerMove={spotlight}>
            <Orbit />
            <div>
              <div className="stat" aria-label="360 degrees"><span aria-hidden="true"><span data-count="360">360</span>°</span></div>
              <h3>Spatial Audio</h3>
              <p>Head-tracked sound that stays put.</p>
            </div>
          </article>

          <article className="glass card feature" onPointerMove={spotlight}>
            <Drop />
            <div>
              <div className="stat">IPX5</div>
              <h3>Water resistant</h3>
              <p>Sweat, rain, the last mile home.</p>
            </div>
          </article>
        </div>

        <NoiseDemo />
      </div>
    </section>
  )
}
