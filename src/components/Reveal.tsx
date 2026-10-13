import { useRef } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'
import Case from './Case'

const STEPS = [
  ['Closed', 'Pocket-size. Smaller than a matchbox.'],
  ['Half-open', 'Lift the lid and they pair instantly.'],
  ['Open', 'They rise to meet you. Silence, on.'],
]

const LID_HALF = { y: -16, rotation: -18 }
const LID_OPEN = { x: -20, y: -40, rotation: -48 }

export default function Reveal() {
  const root = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (prefersReducedMotion()) {
      gsap.set('.lid', LID_OPEN)
      gsap.set('.rail-fill', { scaleX: 1 })
      return
    }

    gsap.set('.rise', { y: 170, opacity: 0 })
    gsap.set('.step:not(:first-child)', { opacity: 0.3 })

    // Pinned for two screens of scroll; each third of the progress is one step.
    gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: { trigger: '.reveal-pin', start: 'top top', end: '+=200%', scrub: 1, pin: true },
    })
      .to('.rail-fill', { scaleX: 1, duration: 3, ease: 'none' }, 0)
      .to('.lid', { ...LID_HALF, duration: 0.8 }, 0.6)
      .to('.step-0', { opacity: 0.3, duration: 0.4 }, 0.8)
      .to('.step-1', { opacity: 1, duration: 0.4 }, 0.8)
      .to('.lid', { ...LID_OPEN, duration: 0.8 }, 1.7)
      .to('.step-1', { opacity: 0.3, duration: 0.4 }, 1.8)
      .to('.step-2', { opacity: 1, duration: 0.4 }, 1.8)
      .to('.rise', { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out' }, 1.9)
      .to('.reveal-glow', { opacity: 1, scale: 1.15, duration: 1 }, 1.9)
  }, { scope: root })

  return (
    <section id="product" ref={root}>
      <div className="reveal-pin">
        <div className="wrap reveal-grid">
          <div>
            <div className="eyebrow">02 — THE REVEAL</div>
            <h2 className="h2">Opens like<br />a secret.</h2>
            <p className="lead">A magnetic lid with a soft-close hinge. Keep scrolling to open it.</p>
            <ol className="steps">
              {STEPS.map(([title, text], i) => (
                <li key={title} className={`step step-${i}`}>
                  <span className="step-num">0{i + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="rail" aria-hidden="true"><div className="rail-fill" /></div>
          </div>

          <div className="glass reveal-stage">
            <div className="reveal-glow" aria-hidden="true" />
            <div className="case-scale"><Case /></div>
          </div>
        </div>
      </div>
    </section>
  )
}
