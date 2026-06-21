import { useState, useEffect, useRef } from 'react'

const sections = ['hello', 'about', 'projects', 'contact']
const sectionLabels = ['Hello', 'About', 'Projects', 'Contact']

function Navbar() {
  const [activeSection, setActiveSection] = useState('hello')
  const [indicatorStyle, setIndicatorStyle] = useState({})
  const [menuOpen, setMenuOpen] = useState(false)
  const buttonRefs = useRef([])
  const isScrolling = useRef(false)

  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  const smoothScroll = (targetId) => {
    const targetElement = document.getElementById(targetId)
    if (!targetElement) return

    isScrolling.current = true

    const startPosition = window.pageYOffset
    const targetPosition = Math.max(0, targetElement.offsetTop - 100)
    const distance = targetPosition - startPosition
    const duration = 1000
    let start = null

    const animation = (currentTime) => {
      if (start === null) start = currentTime
      const timeElapsed = currentTime - start
      const progress = Math.min(timeElapsed / duration, 1)
      const easedProgress = easeInOutCubic(progress)

      window.scrollTo(0, startPosition + distance * easedProgress)

      if (timeElapsed < duration) {
        requestAnimationFrame(animation)
      } else {
        isScrolling.current = false
      }
    }

    requestAnimationFrame(animation)
  }

  const handleClick = (section) => {
    setActiveSection(section)
    setMenuOpen(false)
    smoothScroll(section)
  }

  useEffect(() => {
    const activeIndex = sections.indexOf(activeSection)
    const activeButton = buttonRefs.current[activeIndex]
    if (activeButton) {
      const { offsetLeft, offsetWidth } = activeButton
      setIndicatorStyle({
        left: offsetLeft,
        width: offsetWidth,
      })
    }
  }, [activeSection])

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    }

    const observer = new IntersectionObserver((entries) => {
      if (isScrolling.current) return
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }, observerOptions)

    sections.forEach((section) => {
      const element = document.getElementById(section)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const firstButton = buttonRefs.current[0]
    if (firstButton) {
      setIndicatorStyle({
        left: firstButton.offsetLeft,
        width: firstButton.offsetWidth,
      })
    }
  }, [])

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e) => {
      if (!e.target.closest('#mobile-nav')) setMenuOpen(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [menuOpen])

  return (
    <>
      {/* ── Desktop nav (lg+) — unchanged pill design ── */}
      <nav className="hidden lg:block fixed top-6 left-1/2 -translate-x-1/2 px-8 py-3 z-50">
        <div className="relative flex items-center gap-8">
          {sections.map((section, index) => (
            <button
              key={section}
              ref={(el) => (buttonRefs.current[index] = el)}
              onClick={() => handleClick(section)}
              className={`relative z-10 px-5 py-2 text-lg font-medium transition-colors ${
                activeSection === section
                  ? 'text-orange-200'
                  : 'text-slate-600 hover:text-slate-500'
              }`}
            >
              {sectionLabels[index]}
            </button>
          ))}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-9 bg-slate-700 rounded-full transition-all duration-500 ease-in-out z-0"
            style={{
              left: indicatorStyle.left || 0,
              width: indicatorStyle.width || 0,
            }}
          />
        </div>
      </nav>

      {/* ── Mobile nav (below lg) — hamburger ── */}
      <div id="mobile-nav" className="lg:hidden fixed top-0 left-0 z-50">
        {/* Hamburger button */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="m-4 w-10 h-10 flex flex-col justify-center items-center gap-[6px] rounded-md bg-slate-700 shadow-md"
        >
          <span
            className={`block h-[2px] w-5 bg-orange-200 rounded transition-all duration-300 origin-center ${
              menuOpen ? 'rotate-45 translate-y-[8px]' : ''
            }`}
          />
          <span
            className={`block h-[2px] w-5 bg-orange-200 rounded transition-all duration-300 ${
              menuOpen ? 'opacity-0 scale-x-0' : ''
            }`}
          />
          <span
            className={`block h-[2px] w-5 bg-orange-200 rounded transition-all duration-300 origin-center ${
              menuOpen ? '-rotate-45 -translate-y-[8px]' : ''
            }`}
          />
        </button>

        {/* Dropdown menu */}
        <div
          className={`absolute top-16 left-3 bg-slate-700 rounded-xl shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col py-2 min-w-[140px]">
            {sections.map((section, index) => (
              <button
                key={section}
                onClick={() => handleClick(section)}
                className={`px-6 py-3 text-left text-base font-medium transition-colors ${
                  activeSection === section
                    ? 'text-orange-200'
                    : 'text-slate-300 hover:text-orange-200'
                }`}
              >
                {activeSection === section && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-200 mr-2 mb-[2px]" />
                )}
                {sectionLabels[index]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar