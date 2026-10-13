import { useRef } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'

const LAYERS = [
  { tag: '01 · DRIVER', title: '11 mm custom dynamic driver', text: 'Low distortion down to 20 Hz.', visual: <div className="lv-driver" /> },
  { tag: '02 · CHIP', title: 'AURA H1 audio chip', text: 'Runs noise cancelling on-device.', visual: <div className="lv-chip"><span>H1</span></div> },
  { tag: '03 · BATTERY', title: 'High-density cell', text: '8 hours per charge, buds alone.', visual: <div className="lv-battery" /> },
  { tag: '04 · SHELL', title: 'Soft-touch polymer shell', text: '4.8 g. Sealed to IPX5.', visual: <div className="lv-shell" /> },
]

export default function Exploded() {
  const root = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    const mm = gsap.matchMedia()

    // Desktop: pinned. Layers start stacked in the middle and separate as you scroll.
    mm.add('(min-width: 901px)', () => {
      const list = root.current!.querySelector<HTMLElement>('.layers')!
      const rows = gsap.utils.toArray<HTMLElement>('.layer', root.current)
      const toCenter = (i: number) => list.offsetHeight / 2 - (rows[i].offsetTop + rows[i].offsetHeight / 2)

      gsap.timeline({
        scrollTrigger: { trigger: '.exploded-pin', start: 'top top', end: '+=150%', scrub: 1, pin: true, invalidateOnRefresh: true },
      })
        .from('.layer-visual', { y: toCenter, scale: 0.92, duration: 1, ease: 'power2.inOut' })
        .from('.layer-line', { scaleX: 0, transformOrigin: 'left center', duration: 0.4, stagger: 0.1 }, 0.7)
        .from('.layer-label', { opacity: 0, x: 20, duration: 0.4, stagger: 0.1 }, 0.8)
    })

    // Mobile: no pin, layers just fade up.
    mm.add('(max-width: 900px)', () => {
      gsap.from('.layer', { opacity: 0, y: 30, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.layers', start: 'top 80%', once: true } })
    })
  }, { scope: root })

  return (
    <section ref={root} aria-labelledby="inside-title">
      <div className="exploded-pin">
        <div className="wrap">
          <div className="exploded-head">
            <div className="eyebrow">04 — INSIDE</div>
            <h2 id="inside-title" className="h2">Four layers. Zero noise.</h2>
          </div>
          <div className="layers">
            {LAYERS.map((l) => (
              <div className="layer" key={l.tag}>
                <div className="layer-visual" aria-hidden="true">{l.visual}</div>
                <div className="layer-line" aria-hidden="true" />
                <div className="layer-label">
                  <div className="mono">{l.tag}</div>
                  <h3>{l.title}</h3>
                  <p>{l.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
