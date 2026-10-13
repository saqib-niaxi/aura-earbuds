import { Suspense, lazy } from 'react'
import { PRICE, VARIANTS, VARIANT_IDS, type Variant, type VariantId } from '../data'
import { supportsWebGL } from '../lib/supports'
import Bud from './Bud'

const Earbuds3D = lazy(() => import('./three/Earbuds3D'))

const swatchFill = (v: Variant) => `radial-gradient(circle at 35% 30%, ${v.hi}, ${v.body} 55%, ${v.shade})`

function CssPair() {
  return (
    <div className="finish-scale">
      <div className="finish-buds">
        <div className="b1"><Bud /></div>
        <div className="b2"><Bud /></div>
      </div>
    </div>
  )
}

type Props = { variant: VariantId; onChange: (id: VariantId) => void }

export default function Finish({ variant, onChange }: Props) {
  const v = VARIANTS[variant]
  const webgl = supportsWebGL()

  return (
    <section id="colors" className="section">
      <div className="wrap finish">
        <div
          className="glass finish-stage"
          aria-hidden="true"
          data-cursor={webgl ? 'label' : undefined}
          data-cursor-text="DRAG"
        >
          <div className="finish-glow" />
          <div className="finish-ring" />
          {webgl ? (
            <Suspense fallback={<CssPair />}>
              <Earbuds3D variant={variant} mode="showcase" />
            </Suspense>
          ) : <CssPair />}
          {webgl && <span className="finish-hint mono">DRAG TO ROTATE</span>}
        </div>

        <div className="finish-copy">
          <div className="eyebrow" data-reveal>05 — FINISH</div>
          <h2 className="h2" data-reveal>Three moods.<br />One silence.</h2>

          <div className="vname-mask" aria-live="polite">
            <span key={variant} className="vname">{v.name}</span>
          </div>
          <p key={`${variant}-desc`} className="vdesc">{v.desc}</p>

          <div className="swatches" role="group" aria-label="Choose a finish">
            {VARIANT_IDS.map((id) => {
              const s = VARIANTS[id]
              const on = id === variant
              return (
                <div className="swatch-item mono" key={id}>
                  <button
                    type="button"
                    className="swatch"
                    aria-label={s.name}
                    aria-pressed={on}
                    onClick={() => onChange(id)}
                    style={{
                      background: swatchFill(s),
                      boxShadow: `0 0 0 4px #0A0A0F inset${on ? `, 0 0 24px ${s.a}99` : ''}`,
                    }}
                  />
                  {s.short}
                </div>
              )
            })}
          </div>

          <div className="finish-buy">
            <a href="#buy" className="btn btn-primary" data-magnetic>
              <span className="btn-label">Pre-order — {PRICE}</span>
            </a>
            Free engraving
          </div>
        </div>
      </div>
    </section>
  )
}
