import { useRef, useState } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { ArrowRight } from './Icons'

// Photos live in public/images/ (WebP, made from photos/ by `npm run images`).
// If one is missing, the card falls back to its colour-graded gradient.
const MOMENTS = [
  { id: 'gym', title: 'Gym', line: 'Stays put through every rep.', alt: 'Athlete mid-set under hard rim light',
    bg: 'radial-gradient(ellipse at 70% 20%, rgba(255,120,80,.22), transparent 55%), linear-gradient(160deg, #1A1418, #0D0D12)' },
  { id: 'commute', title: 'Commute', line: "The train goes quiet. You don't.", alt: 'Metro carriage in motion blur',
    bg: 'radial-gradient(ellipse at 30% 30%, rgba(0,224,255,.18), transparent 55%), linear-gradient(160deg, #0F1820, #0B0B10)' },
  { id: 'studio', title: 'Studio', line: 'Hear the mix the way you made it.', alt: 'Producer at a desk lit by monitor glow',
    bg: 'radial-gradient(ellipse at 60% 40%, rgba(124,92,255,.28), transparent 55%), linear-gradient(160deg, #15121F, #0B0B10)' },
  { id: 'travel', title: 'Travel', line: 'Ten hours. Not one engine.', alt: 'Window seat looking out at a wing at dusk',
    bg: 'radial-gradient(ellipse at 50% 15%, rgba(255,200,120,.16), transparent 55%), linear-gradient(160deg, #18161A, #0B0B10)' },
]

function Photo({ src, alt }: { src: string; alt: string }) {
  const [ok, setOk] = useState(true)
  if (!ok) return null
  return <img src={src} alt={alt} loading="lazy" onError={() => setOk(false)} />
}

export default function Strip() {
  const root = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    const mm = gsap.matchMedia()

    // Desktop: vertical scroll drives the track sideways; each photo parallaxes inside its card.
    mm.add('(min-width: 901px)', () => {
      const track = root.current!.querySelector<HTMLElement>('.strip-track')!
      const distance = () => track.scrollWidth - window.innerWidth

      const slide = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: { trigger: '.strip-pin', start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 1, invalidateOnRefresh: true },
      })

      gsap.utils.toArray<HTMLElement>('.moment-media', root.current).forEach((media) => {
        gsap.fromTo(media, { xPercent: -6 }, {
          xPercent: 6, ease: 'none',
          scrollTrigger: { trigger: media.parentElement, containerAnimation: slide, start: 'left right', end: 'right left', scrub: true },
        })
      })
    })
  }, { scope: root })

  return (
    <section ref={root} aria-labelledby="everywhere-title">
      <div className="strip-pin">
        <div className="wrap strip-head">
          <div>
            <div className="eyebrow">06 — EVERYWHERE</div>
            <h2 id="everywhere-title" className="h2">Built for the in-between.</h2>
          </div>
          <div className="strip-hint" aria-hidden="true">
            <span className="fine">SCROLL</span><span className="touch">SWIPE</span> <ArrowRight />
          </div>
        </div>

        <div className="strip">
          <div className="strip-track">
            {MOMENTS.map((m) => (
              <article key={m.id} className="moment" data-cursor="label" data-cursor-text="SCROLL">
                <div className="moment-media" style={{ background: m.bg }}>
                  <Photo src={`/images/${m.id}.webp`} alt={m.alt} />
                </div>
                <div className="moment-caption">
                  <h3>{m.title}</h3>
                  <p>{m.line}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
