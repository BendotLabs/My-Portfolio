import { useEffect, useRef } from 'react'

/* ============================================================
   PONG SCAN LOGO — React port of logoShader.js
   Canvas shader-style masked title renderer.
   ============================================================ */

const GREEN = '#00ff88'
const RED = '#ff2a14'

function hexToRgb(hex) {
  const n = Number.parseInt(hex.slice(1), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

class TextMask {
  constructor() {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true })
  }
  resize(width, height, dpr, fontSize) {
    this.width = Math.max(1, Math.floor(width * dpr))
    this.height = Math.max(1, Math.floor(height * dpr))
    this.canvas.width = this.width
    this.canvas.height = this.height
    const ctx = this.ctx
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, this.width, this.height)
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${fontSize * dpr}px Orbitron, "Arial Black", Arial, sans-serif`
    if ('letterSpacing' in ctx) ctx.letterSpacing = `${16 * dpr}px`
    ctx.fillText('PONG', this.width / 2, this.height * 0.53, this.width * 0.94)
  }
}

class GridField {
  constructor() {
    this.lines = []
    this.spacing = 18
  }
  resize(width, height, dpr) {
    this.width = width * dpr
    this.height = height * dpr
    this.spacing = Math.max(12, Math.floor(width / 23)) * dpr
    this.lines = []
    for (let x = 0; x <= this.width + this.spacing; x += this.spacing) {
      this.lines.push({ axis: 'x', value: x, seed: Math.sin(x * 0.037) * 1000 })
    }
    for (let y = 0; y <= this.height + this.spacing; y += this.spacing) {
      this.lines.push({ axis: 'y', value: y, seed: Math.cos(y * 0.041) * 1000 })
    }
  }
  draw(ctx, color, scanX, time, intensityAt, useShadow) {
    ctx.save()
    ctx.lineCap = 'butt'
    ctx.lineWidth = Math.max(1, Math.round(this.width / 240))

    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i]
      let alpha
      if (line.axis === 'x') {
        alpha = intensityAt(line.value)
        if (alpha <= 0.01) continue
      } else {
        alpha = 0.75
      }
      const near = Math.min(1, alpha * 1.6)
      const jitter =
        (Math.sin(time * 0.006 + line.seed) + Math.sin(time * 0.011 + line.seed * 0.43)) * near
      const wave = Math.sin(line.value * 0.035 + time * 0.007) * near * 1.2
      const offset = (jitter + wave) * 1.4

      ctx.globalAlpha = Math.min(0.86, alpha)
      ctx.strokeStyle = color
      // shadowBlur is the single most expensive op in this loop (forces a
      // blur pass per stroke). Skip it on small/mobile canvases where the
      // softening is least noticeable and the frame budget is tightest.
      if (useShadow) {
        ctx.shadowColor = color
        ctx.shadowBlur = 7 * near
      } else {
        ctx.shadowBlur = 0
      }
      ctx.beginPath()

      if (line.axis === 'x') {
        const x = line.value + offset
        ctx.moveTo(x, 0)
        ctx.lineTo(x, this.height)
      } else {
        const y = line.value + offset * 0.45
        const segmentWidth = this.spacing * 0.75
        for (let sx = 0; sx < scanX; sx += segmentWidth) {
          const segmentAlpha = intensityAt(sx)
          if (segmentAlpha < 0.02) continue
          ctx.globalAlpha = Math.min(0.86, alpha) * segmentAlpha * 0.8
          ctx.beginPath()
          ctx.moveTo(sx, y)
          ctx.lineTo(Math.min(scanX, sx + segmentWidth), y)
          ctx.stroke()
        }
        continue
      }
      ctx.stroke()
    }
    ctx.restore()
  }
}

class DecayBuffer {
  constructor() {
    this.cells = new Float32Array(0)
    this.cols = 0
    this.rows = 0
  }
  resize(width, height, spacing) {
    this.cols = Math.max(1, Math.ceil(width / spacing) + 1)
    this.rows = Math.max(1, Math.ceil(height / spacing) + 1)
    this.spacing = spacing
    this.cells = new Float32Array(this.cols * this.rows)
  }
  update(scanX, dt, falloffSigma, active) {
    const decay = Math.exp(-dt / 540)
    for (let y = 0; y < this.rows; y++) {
      const row = y * this.cols
      for (let x = 0; x < this.cols; x++) {
        const idx = row + x
        this.cells[idx] = this.cells[idx] * decay
        if (active) {
          const cx = x * this.spacing
          const dist = Math.abs(cx - scanX)
          const activation = Math.exp(-(dist * dist) / (2 * falloffSigma * falloffSigma))
          this.cells[idx] = Math.max(this.cells[idx], activation)
        }
        if (this.cells[idx] < 0.015) this.cells[idx] = 0
      }
    }
  }
  sample(x, y) {
    const gx = Math.max(0, Math.min(this.cols - 1, Math.round(x / this.spacing)))
    const gy = Math.max(0, Math.min(this.rows - 1, Math.round(y / this.spacing)))
    return this.cells[gy * this.cols + gx] || 0
  }
}

class ScanlineController {
  constructor(mode) {
    this.mode = mode
    this.cycle = 0
    this.lastWrap = false
    this.pulse = 0
  }
  resize(width) {
    this.width = width
    this.duration = 6000
  }
  update(time, dt) {
    const cycle = (time % this.duration) / this.duration
    const scanPhase = 0.62
    const wrapped = cycle < 0.025
    if (wrapped && !this.lastWrap) {
      this.cycle += 1
      this.pulse = 1
    }
    this.lastWrap = wrapped
    this.pulse *= Math.exp(-dt / 180)
    if (cycle < scanPhase) {
      this.x = (cycle / scanPhase) * this.width
      this.active = true
    } else {
      // Scan has finished its sweep — park it off-screen so no further
      // activation feeds the decay buffer, giving the rest phase a clean
      // window to fully fade out before the next sweep begins.
      this.x = this.width * 1.5
      this.active = false
    }
    return this.x
  }
  getColor() {
    if (this.mode === 'static') return GREEN
    if (this.mode === 'adaptive') return RED
    return this.cycle % 2 === 0 ? GREEN : RED
  }
}

function PongScanLogo({ mode = 'cycle', className = '' }) {
  const rootRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    const mask = new TextMask()
    const grid = new GridField()
    const decay = new DecayBuffer()
    const scan = new ScanlineController(mode)

    let dpr, cssWidth, cssHeight, width, height
    let rafId
    let resizeRetryId
    let lastTime = performance.now()
    let disposed = false

    function resize() {
      const rect = root.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      cssWidth = Math.max(220, rect.width)
      cssHeight = Math.max(96, canvas.clientHeight || rect.height)

      if (rect.width === 0) {
        resizeRetryId = requestAnimationFrame(resize)
        return
      }

      width = Math.floor(cssWidth * dpr)
      height = Math.floor(cssHeight * dpr)
      canvas.width = width
      canvas.height = height

      const fontSize = Math.min(cssWidth * 0.27, 128)
      mask.resize(cssWidth, cssHeight, dpr, fontSize)
      grid.resize(cssWidth, cssHeight, dpr)
      decay.resize(width, height, grid.spacing)
      scan.resize(width)
    }

    function draw(time, scanX, color, rgb, scanWidth) {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, width, height)

      ctx.save()
      ctx.drawImage(mask.canvas, 0, 0)
      ctx.restore()

      ctx.save()
      ctx.drawImage(mask.canvas, 0, 0)
      ctx.globalCompositeOperation = 'source-atop'

      const intensityAt = (x) => {
        if (x > scanX) return 0
        const directDist = Math.abs(x - scanX)
        const direct = Math.exp(-(directDist * directDist) / (2 * (scanWidth * 0.5) ** 2))
        const memory = decay.sample(x, height * 0.5)
        return Math.max(direct, memory * 0.72)
      }

      grid.draw(ctx, color, scanX, time, intensityAt, cssWidth >= 480)

      const scanTrail = ctx.createLinearGradient(scanX - scanWidth, 0, scanX, 0)
      scanTrail.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`)
      scanTrail.addColorStop(0.75, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.45)`)
      scanTrail.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`)
      ctx.fillStyle = scanTrail
      ctx.fillRect(scanX - scanWidth, 0, scanWidth, height)

      ctx.globalAlpha = 0.24 + scan.pulse * 0.22
      ctx.fillStyle = color
      for (let i = 0; i < 55; i++) {
        const nx = (Math.sin(i * 91.7 + time * 0.003) * 0.5 + 0.5) * width
        const ny = (Math.cos(i * 47.3 + time * 0.002) * 0.5 + 0.5) * height
        const a = intensityAt(nx) * 0.18
        if (a <= 0.01) continue
        ctx.globalAlpha = a
        ctx.fillRect(nx, ny, 1.2 * dpr, 1.2 * dpr)
      }

      ctx.restore()
    }

    function frame(time) {
      if (disposed) return
      const dt = Math.min(50, time - lastTime)
      lastTime = time

      const scanX = scan.update(time, dt)
      const color = scan.getColor()
      const rgb = hexToRgb(color)
      const scanWidth = 60 * dpr
      const falloffSigma = scanWidth * 0.5

      decay.update(scanX, dt, falloffSigma, scan.active)
      draw(time, scanX, color, rgb, scanWidth)
      rafId = requestAnimationFrame(frame)
    }

    function startLoop() {
      if (rafId || disposed) return
      lastTime = performance.now()
      rafId = requestAnimationFrame(frame)
    }

    function stopLoop() {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = null
    }

    resize()
    const fontsReady = document.fonts
      ? document.fonts.load('900 82px Orbitron').then(() => document.fonts.ready)
      : Promise.resolve()
    fontsReady.then(() => { if (!disposed) resize() })

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(root)
    window.addEventListener('resize', resize)

    // Only animate while the logo is actually on screen — scrolled-past
    // canvases were previously still running a shadowBlur-heavy rAF loop
    // at full rate, which is a meaningful, avoidable cost on mobile.
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) startLoop()
        else stopLoop()
      },
      { threshold: 0.01 }
    )
    visibilityObserver.observe(root)

    return () => {
      disposed = true
      stopLoop()
      if (resizeRetryId) cancelAnimationFrame(resizeRetryId)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [mode])

  return (
    <div
      ref={rootRef}
      className={`w-full flex flex-col items-center justify-center ${className}`}
    >
      <canvas ref={canvasRef} className="block w-full" style={{ height: 'clamp(80px, 14vw, 140px)' }} />
      <p
        className="text-slate-600 uppercase mt-1"
        style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: 'clamp(0.55rem, 1.4vw, 0.7rem)',
          letterSpacing: '0.25em',
        }}
      >
        Adversarial Systems Edition
      </p>
    </div>
  )
}

export default PongScanLogo