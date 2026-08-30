import { useState, useRef, useEffect, type FC } from 'react'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  RotateCw,
  MessageSquare,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  MousePointerClick,
} from 'lucide-react'

export const TriptychContactSection: FC = () => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', model: '', contact: '' })
  const sectionRef = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.15 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.contact) return
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', model: '', contact: '' })
    }, 4000)
  }

  return (
    <section
      ref={sectionRef}
      id="contact-section"
      className="relative w-full bg-black py-24 sm:py-32 px-4 sm:px-8 md:px-12 overflow-hidden select-none"
    >
      {/* Soft atmospheric background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] sm:w-[1200px] h-[500px] bg-gradient-to-r from-purple-950/25 via-[#e8702a]/20 to-amber-900/18 blur-[160px] rounded-full pointer-events-none" />

      {/* Section Header */}
      <div
        className={`max-w-4xl mx-auto text-center mb-10 sm:mb-14 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/10 border border-white/15 text-white/90 mb-4 shadow-sm">
          <Sparkles size={13} className="text-[#e8702a]" />
          <span>Interactive 3D Gate</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight leading-[1.1]">
          Direct Access to{' '}
          <span className="font-playfair italic bg-gradient-to-r from-white via-orange-200 to-[#e8702a] bg-clip-text text-transparent">
            Apex Engineering.
          </span>
        </h2>
      </div>

      {/* Unified 3D Flip Card Container */}
      <div className="max-w-6xl mx-auto">
        <div
          className="relative w-full min-h-[460px] sm:min-h-[500px] md:min-h-[520px] cursor-pointer group select-none"
          style={{
            perspective: '1600px',
          }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Card Inner with 3D Flip */}
          <div
            className="relative w-full h-full min-h-[460px] sm:min-h-[500px] md:min-h-[520px] transition-transform duration-700 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* FRONT FACE: One completely unified, grand, continuous text composition */}
            <div
              className="absolute inset-0 w-full h-full bg-[#101016]/90 backdrop-blur-2xl rounded-3xl border border-white/15 group-hover:border-[#e8702a]/60 group-hover:shadow-2xl group-hover:shadow-[#e8702a]/20 transition-all duration-500 p-8 sm:p-12 md:p-16 flex flex-col justify-between items-center text-center overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              {/* Top ambient glow aura */}
              <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[80%] h-72 bg-gradient-to-b from-[#e8702a]/25 via-purple-600/15 to-transparent rounded-full blur-3xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Top Tag */}
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest bg-white/5 border border-white/10 text-white/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e8702a] shadow-[0_0_8px_#e8702a] animate-pulse" />
                  <span>Apex Partnership</span>
                </div>
              </div>

              {/* Central Unified Grand Typography */}
              <div className="relative z-10 my-auto py-6 max-w-4xl">
                <h3 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-normal leading-[1.06] tracking-tight transition-transform duration-500 group-hover:scale-[1.015]">
                  <span className="font-playfair italic text-white drop-shadow-md">
                    Are you ready
                  </span>{' '}
                  <span className="block sm:inline font-sans font-bold bg-gradient-to-r from-white via-orange-100 to-[#e8702a] bg-clip-text text-transparent drop-shadow-lg">
                    for our cooperation?
                  </span>
                </h3>
              </div>

              {/* Bottom Click Prompt Just Below the Text */}
              <div className="relative z-10 pt-5 border-t border-white/10 w-full max-w-lg group-hover:border-[#e8702a]/30 transition-colors">
                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-[#e8702a] group-hover:text-white transition-colors">
                  <MousePointerClick size={16} className="text-[#e8702a] animate-bounce shrink-0" />
                  <span className="tracking-wide">Нажмите на блок, чтобы открыть контакты</span>
                </div>
                <p className="text-[11px] text-white/40 mt-1 font-light">
                  Direct hotline, instant diagnostic scheduling, and engineering hubs
                </p>
              </div>

              {/* Bottom glowing accent line */}
              <div className="absolute bottom-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-[#e8702a]/0 group-hover:via-[#e8702a]/60 to-transparent transition-all duration-500" />
            </div>

            {/* BACK FACE: 3 Contact Modules in one unified flipped panel */}
            <div
              onClick={(e) => {
                if (
                  (e.target as HTMLElement).tagName === 'INPUT' ||
                  (e.target as HTMLElement).tagName === 'BUTTON'
                ) {
                  e.stopPropagation()
                }
              }}
              className="absolute inset-0 w-full h-full bg-[#0d0d14]/98 backdrop-blur-2xl rounded-3xl border border-white/15 p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-y-auto cursor-default shadow-2xl shadow-black/90"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              {/* Back Face 3-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch h-full">
                {/* Module 1: Direct Hotline */}
                <div className="flex flex-col justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                      <span className="text-xs uppercase tracking-widest font-mono text-emerald-400">
                        Concierge Active
                      </span>
                    </div>
                    <h4 className="text-lg font-medium text-white mb-1.5">Direct Hotline</h4>
                    <p className="text-xs text-white/60 mb-4 leading-relaxed">
                      Instant access to certified master engineers.
                    </p>

                    <div className="space-y-3 text-xs">
                      <a
                        href="tel:+18008942739"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 hover:text-white transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#e8702a]/20 border border-[#e8702a]/40 flex items-center justify-center shrink-0">
                          <Phone size={13} className="text-[#e8702a]" />
                        </div>
                        <div>
                          <div className="text-[10px] text-white/40">Direct Phone</div>
                          <div className="font-mono text-xs">+1 (800) 894-APEX</div>
                        </div>
                      </a>

                      <a
                        href="mailto:diagnostics@apexdynamics.com"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 hover:text-white transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
                          <Mail size={13} className="text-purple-400" />
                        </div>
                        <div>
                          <div className="text-[10px] text-white/40">Engineering Desk</div>
                          <div className="font-mono text-[11px]">diagnostics@apexdynamics.com</div>
                        </div>
                      </a>

                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70">
                        <Clock size={14} className="text-amber-400 shrink-0" />
                        <div>
                          <div className="text-[10px] text-white/40">Operating Hours</div>
                          <div className="text-[11px]">08:00 – 20:00 EST | 24/7 Trackside</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 text-[10px] text-white/40 flex items-center gap-1.5 mt-3">
                    <ShieldAlert size={12} className="text-[#e8702a]" />
                    <span>Priority 1-hour diagnostic triage</span>
                  </div>
                </div>

                {/* Module 2: Booking Form */}
                <div className="flex flex-col justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs uppercase tracking-widest font-mono text-[#e8702a]">
                        Fast Slot
                      </span>
                      <span className="text-[10px] text-white/40">Guaranteed Response</span>
                    </div>
                    <h4 className="text-lg font-medium text-white mb-1">Book Diagnosis</h4>
                    <p className="text-xs text-white/60 mb-3 leading-relaxed">
                      Enter vehicle details for rapid slot allocation.
                    </p>

                    {submitted ? (
                      <div className="p-4 rounded-xl bg-[#e8702a]/15 border border-[#e8702a]/40 text-center flex flex-col items-center gap-2 my-auto">
                        <CheckCircle2 size={22} className="text-[#e8702a]" />
                        <div className="text-xs font-medium text-white">Diagnostic Request Received</div>
                        <div className="text-[11px] text-white/70">Our lead engineer will contact you shortly.</div>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-2">
                        <div>
                          <input
                            type="text"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#e8702a] transition-colors"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Vehicle Model (e.g. 911 GT3 / S-Class)"
                            value={formData.model}
                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                            required
                            className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#e8702a] transition-colors"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Phone or Email"
                            value={formData.contact}
                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                            required
                            className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#e8702a] transition-colors"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-[#e8702a] hover:bg-[#d2611f] text-white text-xs font-medium py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#e8702a]/20 cursor-pointer"
                        >
                          <Send size={11} />
                          <span>Submit Diagnostic Request</span>
                        </button>
                      </form>
                    )}
                  </div>

                  <div className="pt-2 text-[10px] text-white/40 text-center mt-2">
                    Encrypted telemetry transmission
                  </div>
                </div>

                {/* Module 3: Global Hubs & Messaging */}
                <div className="flex flex-col justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
                      <span className="text-xs uppercase tracking-widest font-mono text-blue-400">
                        Facilities
                      </span>
                    </div>
                    <h4 className="text-lg font-medium text-white mb-1">Global Hubs</h4>
                    <p className="text-xs text-white/60 mb-3.5 leading-relaxed">
                      Cleanroom dynamometer labs & precision bays.
                    </p>

                    <div className="space-y-2 text-xs mb-3.5">
                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80">
                        <MapPin size={14} className="text-[#e8702a] shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-white text-xs">Apex Tech Hub</div>
                          <div className="text-[10px] text-white/50">742 Apex Raceway Blvd, Suite 100</div>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs font-medium text-white/80 mb-2">Instant Channels:</div>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href="https://t.me"
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs transition-colors"
                      >
                        <MessageSquare size={12} />
                        <span>Telegram</span>
                      </a>
                      <a
                        href="https://whatsapp.com"
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs transition-colors"
                      >
                        <Phone size={12} />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsFlipped(false)
                    }}
                    className="pt-3 border-t border-white/10 text-[11px] text-white/50 hover:text-white flex items-center justify-between cursor-pointer transition-colors mt-2"
                  >
                    <span>Flip back to message</span>
                    <RotateCw size={12} className="text-[#e8702a]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
