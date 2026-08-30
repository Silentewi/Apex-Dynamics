import { useState, useEffect, useRef } from 'react'
import { Menu, X, ChevronRight, Sparkles, ChevronDown } from 'lucide-react'
import { RevealLayer } from './components/RevealLayer'
import { DiagnosticsSection } from './components/DiagnosticsSection'
import { TriptychContactSection } from './components/TriptychContactSection'
import { Footer } from './components/Footer'

const BG_IMAGE_1 = `${import.meta.env.BASE_URL}car-exterior.webp`
const BG_IMAGE_2 = `${import.meta.env.BASE_URL}car-interior.webp`

const SPOTLIGHT_R = 260

export default function App() {
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('Overview')

  const mouse = useRef({ x: -999, y: -999 })
  const smooth = useRef({ x: -999, y: -999 })
  const rafRef = useRef<number | null>(null)
  const hasMoved = useRef(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!hasMoved.current) {
        hasMoved.current = true
        smooth.current = { x: e.clientX, y: e.clientY }
      }
      mouse.current = { x: e.clientX, y: e.clientY }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        if (!hasMoved.current) {
          hasMoved.current = true
          smooth.current = { x: touch.clientX, y: touch.clientY }
        }
        mouse.current = { x: touch.clientX, y: touch.clientY }
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    const updateSmoothPosition = () => {
      if (hasMoved.current) {
        smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1
        smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1
        setCursorPos({ x: smooth.current.x, y: smooth.current.y })
      }
      rafRef.current = requestAnimationFrame(updateSmoothPosition)
    }

    rafRef.current = requestAnimationFrame(updateSmoothPosition)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  const scrollToSection = (id: string, name: string) => {
    setActiveNav(name)
    setMobileMenuOpen(false)
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Clean, focused navigation items matching real sections on site
  const navItems = [
    { name: 'Overview', id: 'hero' },
    { name: 'Diagnostics', id: 'diagnostics' },
    { name: 'Contact & Booking', id: 'contact-section' },
  ]

  return (
    <div
      className="min-h-screen bg-black text-white tracking-[-0.02em] select-none selection:bg-[#e8702a]/30 selection:text-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Navigation (fixed, over hero) */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5 transition-all">
        {/* Left: Logo & Brand Wordmark */}
        <div
          onClick={() => scrollToSection('hero', 'Overview')}
          className="flex items-center gap-3 z-10 cursor-pointer group"
        >
          <img
            src="/logo.png"
            alt="Apex Dynamics Logo"
            className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-md transition-transform group-hover:scale-110 duration-300"
          />
          <span className="text-white text-xl sm:text-2xl font-playfair italic tracking-tight drop-shadow-md">
            Apex Dynamics
          </span>
        </div>

        {/* Center pill: Functional site navigation only */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-2 py-1.5 items-center gap-1 shadow-2xl shadow-black/40">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.id, item.name)}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeNav === item.name
                  ? 'text-white bg-white/25 shadow-inner'
                  : 'text-white/80 hover:bg-white/15 hover:text-white'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Right CTA button */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => scrollToSection('contact-section', 'Contact & Booking')}
            className="bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-all hover:scale-[1.03] active:scale-95 shadow-lg shadow-black/20 cursor-pointer"
          >
            Book Consultation
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 focus:outline-none hover:bg-white/20 transition-all"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-4 right-4 mt-2 bg-neutral-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-2xl flex flex-col gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.id, item.name)}
                  className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeNav === item.name
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <div className="h-px bg-white/15 my-1" />
            <button
              onClick={() => scrollToSection('contact-section', 'Contact & Booking')}
              className="w-full bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium py-3 rounded-xl transition-all shadow-lg shadow-[#e8702a]/30"
            >
              Book Consultation
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative w-full overflow-hidden h-screen bg-black"
        style={{ height: '100dvh' }}
      >
        {/* Layer 1: Base Image (z-10) */}
        <div
          className="absolute inset-0 bg-center bg-no-repeat z-10 hero-zoom"
          style={{
            backgroundImage: `url("${BG_IMAGE_1}")`,
            backgroundSize: 'min(86vw, 1380px) auto',
          }}
        />

        {/* Subtle Dark Vignette Overlay for Depth */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-black/70 via-transparent to-black/40" />

        {/* Layer 2: Reveal Layer (z-30) */}
        <RevealLayer
          image={BG_IMAGE_2}
          cursorX={cursorPos.x}
          cursorY={cursorPos.y}
          spotlightRadius={SPOTLIGHT_R}
        />

        {/* Layer 3: Heading (z-50) */}
        <div className="absolute top-[14%] left-0 right-0 flex flex-col items-center text-center px-5 pointer-events-none z-50">
          <h1 className="text-white leading-[0.95] drop-shadow-2xl">
            <span
              className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal"
              style={{
                letterSpacing: '-0.05em',
                animationDelay: '0.25s',
              }}
            >
              Layers hold
            </span>
            <span
              className="block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim hero-reveal"
              style={{
                letterSpacing: '-0.08em',
                animationDelay: '0.42s',
              }}
            >
              tales of time
            </span>
          </h1>
        </div>

        {/* Layer 4: Bottom-left paragraph (z-50) */}
        <div
          className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50 hero-anim hero-fade"
          style={{ animationDelay: '0.7s' }}
        >
          <p className="text-sm text-white/80 leading-relaxed drop-shadow-md">
            Every layer of engineering precision records a chapter of perfection,
            from handcrafted powertrains to active suspension dynamics.
          </p>
        </div>

        {/* Layer 5: Bottom-right block (z-50) */}
        <div
          className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] flex flex-col items-start gap-4 sm:gap-5 z-50 hero-anim hero-fade"
          style={{ animationDelay: '0.85s' }}
        >
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed drop-shadow-md">
            Our interactive telemetry lets you peel back the bodywork to trace how
            chassis, drivetrain, and electronics combine to deliver pinnacle performance.
          </p>
          <button
            onClick={() => scrollToSection('diagnostics', 'Diagnostics')}
            className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30 inline-flex items-center gap-2 cursor-pointer group"
          >
            <span>Explore Diagnostics</span>
            <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Subtle scroll down indicator */}
        <div
          onClick={() => scrollToSection('diagnostics', 'Diagnostics')}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 text-white/50 hover:text-white text-xs flex flex-col items-center gap-1.5 cursor-pointer transition-colors"
        >
          {!hasMoved.current && (
            <div className="flex items-center gap-2 text-white/40 mb-1 animate-pulse">
              <Sparkles size={13} className="text-[#e8702a]" />
              <span>Hover cursor to reveal internal architecture</span>
            </div>
          )}
          <div className="flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
            <span className="text-[11px] uppercase tracking-widest font-mono">Scroll Down</span>
            <ChevronDown size={14} className="animate-bounce" />
          </div>
        </div>
      </section>

      {/* Section 2: Diagnostics Advantages Grid */}
      <DiagnosticsSection />

      {/* Section 3: 3D Flip Contact & Consultation Gate */}
      <TriptychContactSection />

      {/* Section 4: Global Footer */}
      <Footer />
    </div>
  )
}
