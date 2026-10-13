// A synthetic city street, generated live with the Web Audio API (no audio files).
// rumble (brown noise) + passing traffic (swept band-passed pink noise) + the odd car horn,
// all routed through an "ANC" low-pass + gain stage that noise cancelling sweeps down.

const ANC_OFF = { cutoff: 18000, gain: 1 }
const ANC_ON = { cutoff: 220, gain: 0.14 }
const VOLUME = 0.22

function noiseBuffer(ctx: AudioContext, seconds: number, kind: 'brown' | 'pink') {
  const length = Math.floor(ctx.sampleRate * seconds)
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch)
    if (kind === 'brown') {
      let last = 0
      for (let i = 0; i < length; i++) {
        last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02
        data[i] = last * 3.5
      }
    } else {
      // Paul Kellet's pink-noise filter.
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
      for (let i = 0; i < length; i++) {
        const w = Math.random() * 2 - 1
        b0 = 0.99886 * b0 + w * 0.0555179
        b1 = 0.99332 * b1 + w * 0.0750759
        b2 = 0.969 * b2 + w * 0.153852
        b3 = 0.8665 * b3 + w * 0.3104856
        b4 = 0.55 * b4 + w * 0.5329522
        b5 = -0.7616 * b5 - w * 0.016898
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11
        b6 = w * 0.115926
      }
    }
  }
  return buffer
}

export class CityNoise {
  readonly analyser: AnalyserNode
  private ctx: AudioContext
  private ancFilter: BiquadFilterNode
  private ancGain: GainNode
  private input: GainNode
  private hornTimer = 0

  constructor() {
    const ctx = new AudioContext()
    this.ctx = ctx

    this.input = ctx.createGain()
    this.ancFilter = ctx.createBiquadFilter()
    this.ancFilter.type = 'lowpass'
    this.ancFilter.frequency.value = ANC_OFF.cutoff
    this.ancGain = ctx.createGain()
    this.analyser = ctx.createAnalyser()
    this.analyser.fftSize = 2048
    this.analyser.minDecibels = -100
    this.analyser.maxDecibels = -22
    this.analyser.smoothingTimeConstant = 0.8
    const master = ctx.createGain()
    master.gain.value = VOLUME
    this.input.connect(this.ancFilter).connect(this.ancGain).connect(this.analyser).connect(master).connect(ctx.destination)

    const rumble = ctx.createBufferSource()
    rumble.buffer = noiseBuffer(ctx, 4, 'brown')
    rumble.loop = true
    const rumbleGain = ctx.createGain()
    rumbleGain.gain.value = 0.9
    rumble.connect(rumbleGain).connect(this.input)

    // Traffic: band-passed pink noise whose level and pitch drift like cars going by.
    const traffic = ctx.createBufferSource()
    traffic.buffer = noiseBuffer(ctx, 5, 'pink')
    traffic.loop = true
    const band = ctx.createBiquadFilter()
    band.type = 'bandpass'
    band.frequency.value = 900
    band.Q.value = 0.6
    const trafficGain = ctx.createGain()
    trafficGain.gain.value = 0.55
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.09
    const lfoDepth = ctx.createGain()
    lfoDepth.gain.value = 0.4
    lfo.connect(lfoDepth).connect(trafficGain.gain)
    const sweep = ctx.createGain()
    sweep.gain.value = 500
    lfo.connect(sweep).connect(band.frequency)
    traffic.connect(band).connect(trafficGain).connect(this.input)

    rumble.start()
    traffic.start()
    lfo.start()
    this.scheduleHorn()
  }

  private scheduleHorn() {
    this.hornTimer = window.setTimeout(() => {
      if (this.ctx.state === 'running') this.horn()
      this.scheduleHorn()
    }, 3500 + Math.random() * 5000)
  }

  private horn() {
    const { ctx } = this
    const t = ctx.currentTime
    const env = ctx.createGain()
    env.gain.setValueAtTime(0, t)
    env.gain.linearRampToValueAtTime(0.12, t + 0.03)
    env.gain.setValueAtTime(0.12, t + 0.35)
    env.gain.linearRampToValueAtTime(0, t + 0.45)
    env.connect(this.input)
    for (const f of [392, 494]) {
      const osc = ctx.createOscillator()
      osc.type = 'square'
      osc.frequency.value = f
      osc.connect(env)
      osc.start(t)
      osc.stop(t + 0.5)
    }
  }

  setAnc(on: boolean) {
    const t = this.ctx.currentTime
    const target = on ? ANC_ON : ANC_OFF
    this.ancFilter.frequency.setTargetAtTime(target.cutoff, t, 0.25)
    this.ancGain.gain.setTargetAtTime(target.gain, t, 0.25)
  }

  play() {
    return this.ctx.resume()
  }

  pause() {
    return this.ctx.suspend()
  }

  destroy() {
    window.clearTimeout(this.hornTimer)
    void this.ctx.close()
  }
}
