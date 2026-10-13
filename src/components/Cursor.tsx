import { useEffect, useRef, useState } from 'react'
import { gsap, hasFinePointer, prefersReducedMotion } from '../lib/gsap'

// 8px dot that lerps after the pointer, grows into a ring over links and buttons,
// and shows a label over anything with data-cursor="label".
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  const [text, setText] = useState('')
  const [enabled] = useState(() => hasFinePointer() && !prefersReducedMotion())

  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    if (!el) return
    const root = document.documentElement
    root.classList.add('has-cursor')
    gsap.set(el, { xPercent: -50, yPercent: -50 })
    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' })

    const move = (e: PointerEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
      el.classList.add('is-visible')
      const target = (e.target as Element | null)?.closest<HTMLElement>('[data-cursor], a, button, input, textarea')
      let state = 'idle'
      if (target?.dataset.cursor === 'label') {
        state = 'label'
        setText(target.dataset.cursorText || '')
      } else if (target?.matches('input, textarea')) {
        state = 'hidden'
      } else if (target) {
        state = 'link'
      }
      if (el.dataset.state !== state) el.dataset.state = state
    }
    const hide = () => el.classList.remove('is-visible')

    window.addEventListener('pointermove', move)
    document.addEventListener('pointerleave', hide)
    return () => {
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', hide)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div ref={ref} className="cursor" data-state="idle" aria-hidden="true">
      <span className="cursor-text">{text}</span>
    </div>
  )
}
