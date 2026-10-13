import { useState } from 'react'
import { AUTHOR, PRICE, SHIP_DATE, SOCIALS } from '../data'
import { ArrowRight, GitHub, LinkedIn, Mail } from './Icons'

const SPECS = [
  ['Driver', '11 mm custom dynamic'],
  ['Chip', 'AURA H1'],
  ['Noise cancelling', 'Adaptive, up to −42 dB'],
  ['Battery', '8 h buds · 40 h with case'],
  ['Charging', 'USB-C · Qi wireless'],
  ['Connectivity', 'Bluetooth 5.4 · multipoint'],
  ['Codecs', 'AAC · SBC · LC3'],
  ['Water resistance', 'IPX5'],
  ['Weight', '4.8 g per bud'],
]

const QUOTES = [
  { text: "The quietest room I've been in this year was a rush-hour train.", source: 'Tonal', style: { fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 24 } },
  { text: 'AURA makes noise cancelling feel less like a feature and more like a place.', source: 'WAVEFORM', style: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: '.24em' } },
  { text: 'Forty hours, and I still forgot they were in.', source: 'signal/noise', style: { fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, fontSize: 18 } },
]

export function Specs() {
  return (
    <section id="specs" className="section">
      <div className="wrap specs">
        <div className="specs-head">
          <div className="eyebrow" data-reveal>07 — SPECS</div>
          <h2 className="h2" data-reveal>The fine print.</h2>
        </div>
        <dl className="spec-list">
          {SPECS.map(([k, v]) => (
            <div className="spec-row" key={k} data-reveal>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export function Press() {
  return (
    <section className="section" aria-label="Press">
      <div className="wrap press">
        {QUOTES.map((q) => (
          <figure className="glass card quote" key={q.source} data-reveal>
            <blockquote>“{q.text}”</blockquote>
            <figcaption style={q.style}>{q.source}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export function CTA() {
  return (
    <section id="buy" className="cta">
      <div className="cta-conic" aria-hidden="true" />
      <div className="cta-glow" aria-hidden="true" />
      <div className="wrap">
        <h2 className="cta-title" data-reveal>The future<br />is <span className="grad-text">quiet.</span></h2>
        <p data-reveal>AURA One · {PRICE} · Ships {SHIP_DATE}</p>
        <a href="#buy" className="btn btn-primary btn-lg" data-magnetic>
          <span className="btn-label">Pre-order now <ArrowRight /></span>
        </a>
      </div>
    </section>
  )
}

export function Footer() {
  const [sent, setSent] = useState(false)

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-news">
            <div className="logo">AURA</div>
            <form onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
              <label htmlFor="nl">Launch news, nothing else.</label>
              <div className="row">
                <input id="nl" type="email" required className="field" placeholder="you@email.com" autoComplete="email" disabled={sent} />
                <button type="submit" className="btn btn-ghost" disabled={sent}>Subscribe</button>
              </div>
              {sent && <p className="form-note" role="status">You're on the list. (Concept site — nothing was sent.)</p>}
            </form>
          </div>
          <div className="footer-cols">
            <div className="footer-col"><span className="mono">PRODUCT</span><a href="#product">Overview</a><a href="#features">Features</a><a href="#specs">Specs</a><a href="#buy">Pre-order</a></div>
            <div className="footer-col"><span className="mono">SUPPORT</span><a href="#top">Shipping</a><a href="#top">Warranty</a><a href="#top">Contact</a></div>
            <div className="footer-col"><span className="mono">COMPANY</span><a href="#top">About</a><a href="#top">Press</a></div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © 2026 AURA · A concept project designed and built by{' '}
            {AUTHOR.url ? <a href={AUTHOR.url} target="_blank" rel="noreferrer">{AUTHOR.name}</a> : <strong className="author">{AUTHOR.name}</strong>}
          </span>
          <div className="socials">
            {SOCIALS.github && <a href={SOCIALS.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="btn btn-ghost btn-icon"><GitHub /></a>}
            {SOCIALS.linkedin && <a href={SOCIALS.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="btn btn-ghost btn-icon"><LinkedIn /></a>}
            {SOCIALS.email && <a href={`mailto:${SOCIALS.email}`} aria-label="Email" className="btn btn-ghost btn-icon"><Mail /></a>}
          </div>
        </div>
      </div>
    </footer>
  )
}
