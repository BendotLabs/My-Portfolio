import { useEffect, useRef, useState } from 'react'

function VideoThumb({ src, label }) {
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  // Don't mount the <video> (and start its download/decode) until it's
  // actually about to be on screen — previously both project videos
  // started downloading and decoding the instant the page loaded.
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' } // start loading a bit before it enters view
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Once loaded, still pause playback while scrolled out of view to save
  // decode/CPU cost on mobile during long scroll sessions.
  useEffect(() => {
    if (!shouldLoad) return
    const el = containerRef.current
    const video = videoRef.current
    if (!el || !video) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [shouldLoad])

  return (
    <div ref={containerRef} className="w-full">
      {shouldLoad && (
        <video
          ref={videoRef}
          className="w-full h-auto"
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-label={label}
        />
      )}
    </div>
  )
}

export default VideoThumb