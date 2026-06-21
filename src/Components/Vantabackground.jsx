import { useEffect, useRef, useState } from 'react'

// Vite's interop for this UMD build can land the real function at
// module, module.default, or module.default.default depending on
// bundler version — unwrap until we hit a function.
function resolveBirds(mod) {
  let candidate = mod
  for (let i = 0; i < 3; i++) {
    if (typeof candidate === 'function') return candidate
    if (candidate && typeof candidate.default !== 'undefined') {
      candidate = candidate.default
    } else {
      break
    }
  }
  return candidate
}

// Below this width, skip Vanta entirely — no WebGL context, no
// animation loop, no battery drain, and (now) no bundle weight either.
// Matches Tailwind's `lg` breakpoint so it lines up with the
// desktop/mobile nav split.
const DESKTOP_BREAKPOINT = 1024

function VantaBackground() {
  const vantaRef = useRef(null)
  const [vantaEffect, setVantaEffect] = useState(null)
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= DESKTOP_BREAKPOINT
  )

  // Track breakpoint changes (rotation, resizing a browser window, etc.)
  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`)
    const handler = (e) => setIsDesktop(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (!isDesktop) {
      // If we cross down to mobile after the effect was running, tear it down.
      if (vantaEffect) {
        vantaEffect.destroy()
        setVantaEffect(null)
      }
      return
    }

    let cancelled = false

    // Dynamic import: three + vanta.birds are only fetched, parsed, and
    // compiled when we're actually on a desktop-width viewport. Mobile
    // visitors never pay this download/parse cost at all.
    if (!vantaEffect) {
      Promise.all([
        import('three'),
        import('vanta/dist/vanta.birds.min'),
      ]).then(([THREE, vantaModule]) => {
        if (cancelled) return
        const BIRDS = resolveBirds(vantaModule)
        setVantaEffect(
          BIRDS({
            el: vantaRef.current,
            THREE,
            backgroundColor: 0xfed7aa,   // orange-200, matches site bg
            color1: 0x7a7ae1,            // blue
            color2: 0xe661c0,            // pink
            colorMode: 'varianceGradient',
            birdSize: 0.8,
            wingSpan: 22,
            quantity: 3,
            speedLimit: 6,
            separation: 80,
            alignment: 60,
            cohesion: 25,
          })
        )
      })
    }

    return () => {
      cancelled = true
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect, isDesktop])

  if (!isDesktop) {
    // Flat fallback — same color the canvas would have shown, just static.
    return (
      <div
        className="fixed inset-0 -z-10 bg-orange-200"
        aria-hidden="true"
      />
    )
  }

  return (
    <div
      ref={vantaRef}
      className="fixed inset-0 -z-10"
      aria-hidden="true"
    />
  )
}

export default VantaBackground