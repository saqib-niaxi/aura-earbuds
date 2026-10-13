import { useEffect, useRef, useState } from 'react'
import { CityNoise } from '../lib/cityNoise'
import { Pause, Play } from './Icons'

const BARS = 40

// Live spectrum of the city mix, coloured with the page's current finish.
function drawBars(canvas: HTMLCanvasElement, analyser: AnalyserNode | null, data: Uint8Array<ArrayBuffer>, t: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const dpr = window.devicePixelRatio || 1
  const w = canvas.clientWidth
  const h = canvas.clientHeight
  if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
    canvas.width = w * dpr
    canvas.height = h * dpr
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, w, h)

  const styles = getComputedStyle(canvas)
  const grad = ctx.createLinearGradient(0, 0, w, 0)
  grad.addColorStop(0, styles.getPropertyValue('--a').trim() || '#7C5CFF')
  grad.addColorStop(1, styles.getPropertyValue('--b').trim() || '#00E0FF')
  ctx.fillStyle = grad

  if (analyser) analyser.getByteFrequencyData(data)
  const nyquist = (analyser?.context.sampleRate ?? 48000) / 2
  const gap = 4
  const barW = (w - gap * (BARS - 1)) / BARS
  for (let i = 0; i < BARS; i++) {
    // Bars are spaced logarithmically from 40 Hz to 10 kHz, like a real spectrum analyser.
    const freq = 40 * 250 ** (i / (BARS - 1))
    const bin = Math.min(data.length - 1, Math.round((freq / nyquist) * data.length))
    // Idle: a slow, low ripple. Playing: the live level at that frequency.
    const level = analyser ? data[bin] / 255 : 0.06 + 0.04 * Math.sin(t / 600 + i / 3)
    const bh = Math.max(3, level * h)
    ctx.beginPath()
    ctx.roundRect(i * (barW + gap), (h - bh) / 2, barW, bh, barW / 2)
    ctx.fill()
  }
}

export default function NoiseDemo() {
  const root = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const noise = useRef<CityNoise | null>(null)
  const [playing, setPlaying] = useState(false)
  const [anc, setAnc] = useState(false)

  // Draw loop runs only while the panel is on screen.
  useEffect(() => {
    let raf = 0
    let onScreen = false
    const data = new Uint8Array(1024) // analyser.frequencyBinCount for fftSize 2048
    const loop = (t: number) => {
      if (canvas.current) drawBars(canvas.current, noise.current && playing ? noise.current.analyser : null, data, t)
      raf = requestAnimationFrame(loop)
    }
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      cancelAnimationFrame(raf)
      if (onScreen) raf = requestAnimationFrame(loop)
      else if (noise.current && playing) {
        // Scrolling away pauses the sound too.
        void noise.current.pause()
        setPlaying(false)
      }
    })
    if (root.current) io.observe(root.current)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [playing])

  useEffect(() => () => noise.current?.destroy(), [])

  const togglePlay = async () => {
    if (!noise.current) {
      noise.current = new CityNoise()
      noise.current.setAnc(anc)
    }
    if (playing) {
      await noise.current.pause()
      setPlaying(false)
    } else {
      await noise.current.play()
      setPlaying(true)
    }
  }

  const toggleAnc = () => {
    const next = !anc
    setAnc(next)
    noise.current?.setAnc(next)
  }

  return (
    <div id="anc-demo" ref={root} className={`glass anc-demo${anc ? ' is-anc' : ''}`} data-reveal>
      <div className="anc-copy">
        <div className="eyebrow">TRY IT · BEST WITH HEADPHONES</div>
        <h3 className="disp">Hear the difference.</h3>
        <p>Play a busy street, then switch on noise cancelling.</p>
        <div className="anc-controls">
          <button type="button" className="btn btn-ghost" onClick={togglePlay} aria-pressed={playing}>
            {playing ? <Pause /> : <Play />}
            {playing ? 'Pause street' : 'Play city street'}
          </button>
          <button type="button" role="switch" aria-checked={anc} className="anc-switch" onClick={toggleAnc}>
            <span className="anc-track"><span className="anc-thumb" /></span>
            Noise cancelling {anc ? 'on' : 'off'}
          </button>
        </div>
      </div>
      <div className="anc-visual">
        <canvas ref={canvas} className="anc-canvas" aria-hidden="true" />
        <div className="anc-readout mono" aria-live="polite">
          {anc ? 'ANC ON · −42 dB' : playing ? 'STREET · 72 dB' : 'TAP PLAY'}
        </div>
      </div>
    </div>
  )
}
