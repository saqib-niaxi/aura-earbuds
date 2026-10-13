import { Fragment, Suspense, lazy, useRef } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { introDone } from '../lib/intro'
import { supportsWebGL } from '../lib/supports'
import { PRICE, SHIP_DATE, type VariantId } from '../data'
import Bud from './Bud'
import { Play } from './Icons'

// three.js is ~150 kB gzipped, so it loads in its own chunk after first paint.
const Earbuds3D = lazy(() => import('./three/Earbuds3D'))

const LINE_1 = 'Hear what silence'

// The CSS-drawn pair: shown while the 3D chunk loads, and kept on devices without WebGL.
function CssPair() {
  return (
    <>
      <div className="hero-bud l"><div className="float"><Bud /></div></div>
      <div className="hero-bud r"><div className="float"><Bud /></div></div>
    </>
  )
}

export default function Hero({ variant }: { variant: VariantId }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return

    // Intro: chars rise out of their word masks, then the gradient line follows.
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } })
      .from('.hero-eyebrow', { opacity: 0, y: 12, duration: 0.8 })
      .from('.hero-title .char', { yPercent: 110, duration: 1.1, stagger: 0.04 }, '<0.1')
      .from('.hero-title .line-2 > .grad-text', { yPercent: 110, duration: 1.1 }, '-=0.75')
      .from('.halo', { scale: 0.9, opacity: 0, duration: 1.4, ease: 'power3.out' }, 0.3)
      .from('.hero-product', { opacity: 0, y: 80, duration: 1.4, ease: 'power3.out' }, 0.4)
      .from('.hero-sub, .hero-actions, .scroll-cue', { opacity: 0, y: 20, duration: 0.9, stagger: 0.1 }, '-=0.9')

    let alive = true
    introDone.then(() => { if (alive) tl.play() })

    // Idle float for the CSS fallback pair (the 3D pair floats itself).
    gsap.utils.toArray<HTMLElement>('.float', root.current).forEach((el, i) => {
      gsap.fromTo(el, { y: 12, rotation: -2 }, { y: -12, rotation: 2, duration: 2 + i * 0.3, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: i * 0.4 })
    })

    // Halo glow breathes every 3s.
    gsap.to('.halo', { opacity: 0.55, duration: 1.5, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 2.6 })

    return () => { alive = false }
  }, { scope: root })

  return (
    <section id="top" className="hero" ref={root}>
      <div className="hero-glow-a" aria-hidden="true" />
      <div className="hero-glow-b" aria-hidden="true" />

      <div className="hero-eyebrow">
        <span className="pulse-dot" />
        AURA ONE — SHIPPING {SHIP_DATE.toUpperCase()}
      </div>

      <h1 className="hero-title disp" aria-label="Hear what silence sounds like.">
        <span aria-hidden="true">
          {LINE_1.split(' ').map((word, i) => (
            <Fragment key={i}>
              <span className="word">
                {[...word].map((c, j) => <span className="char" key={j}>{c}</span>)}
              </span>{' '}
            </Fragment>
          ))}
          <br />
          <span className="word line-2"><span className="grad-text">sounds like.</span></span>
        </span>
      </h1>

      <div className="hero-stage" aria-hidden="true">
        <div className="halo" />
        <div className="halo-inner" />
        <div className="hero-shadow" />
        <div className="hero-product">
          {supportsWebGL() ? (
            <Suspense fallback={<CssPair />}>
              <Earbuds3D variant={variant} mode="hero" />
            </Suspense>
          ) : <CssPair />}
        </div>
      </div>

      <p className="hero-sub">
        Adaptive noise cancelling that listens 48,000 times a second, so all you hear is what you chose to.
      </p>
      <div className="hero-actions">
        <a href="#buy" className="btn btn-primary" data-magnetic>
          <span className="btn-label">Pre-order — {PRICE}</span>
        </a>
        <a href="#anc-demo" className="btn btn-ghost" data-magnetic>
          <span className="btn-label"><Play />Hear the difference</span>
        </a>
      </div>

      <div className="scroll-cue" aria-hidden="true">
        <div className="scroll-mouse"><i /></div>
        SCROLL
      </div>
    </section>
  )
}
