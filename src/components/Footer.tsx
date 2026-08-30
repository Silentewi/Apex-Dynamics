import { type FC } from 'react'
import {
  ArrowUp,
  Shield,
  Activity,
  Send,
  Globe,
  Radio,
} from 'lucide-react'

export const Footer: FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="relative w-full bg-[#08080c] border-t border-white/10 text-white overflow-hidden select-none">
      {/* Subtle atmospheric ambient glow in footer */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-gradient-to-t from-[#e8702a]/10 via-purple-950/10 to-transparent blur-[160px] pointer-events-none" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 pt-20 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Column (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div>
              <div
                onClick={scrollToTop}
                className="flex items-center gap-3 cursor-pointer group w-fit mb-4"
              >
                <img
                  src="/logo.png"
                  alt="Apex Dynamics Logo"
                  className="w-9 h-9 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                />
                <span className="text-white text-2xl font-playfair italic tracking-tight drop-shadow-md">
                  Apex Dynamics
                </span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed max-w-sm font-light">
                Pioneering automotive diagnostics, sub-millimeter ECU calibration, and
                precision powertrain engineering for high-performance supercars and luxury platforms.
              </p>
            </div>

            {/* Live Telemetry Status Pill */}
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white/[0.04] border border-white/10 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-mono text-white/70 tracking-wider uppercase">
                Global Telemetry Desk // 24/7 Active
              </span>
            </div>
          </div>

          {/* Navigation Links Column 1: Engineering (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-mono text-[#e8702a]">
              Engineering Systems
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <button
                  onClick={() => scrollToSection('diagnostics')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Deep ECU & CAN Scans
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('diagnostics')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Powertrain Dynamometer Tuning
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('diagnostics')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Chassis & Damper Geometry
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('diagnostics')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Predictive Assembly Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('diagnostics')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Dual-Clutch Calibration
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Links Column 2: Supported Platforms (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-mono text-[#e8702a]">
              Platforms
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <button
                  onClick={() => scrollToSection('contact-section')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Porsche 911 / GT Series
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact-section')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Mercedes-AMG / S-Class
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact-section')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  BMW M Dynamics
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact-section')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Trackside Prototypes
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact-section')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Cleanroom Diagnostics
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Column (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-mono text-[#e8702a]">
              Technical Bulletins
            </h4>
            <p className="text-xs text-white/60 leading-relaxed font-light">
              Receive firmware advisories, telemetry protocols, and trackside engineering reports.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                alert('Thank you for subscribing to Apex Technical Bulletins.')
              }}
              className="space-y-2"
            >
              <div className="relative">
                <input
                  type="email"
                  placeholder="engineer@domain.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#e8702a] transition-colors pr-10"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-[#e8702a] hover:bg-[#d2611f] text-white flex items-center justify-center transition-all cursor-pointer shadow-md shadow-[#e8702a]/20"
                >
                  <Send size={12} />
                </button>
              </div>
              <span className="text-[10px] text-white/40 block">
                Zero spam. Encrypted communication only.
              </span>
            </form>
          </div>
        </div>

        {/* Feature Badges Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-8 my-8 border-y border-white/10 text-xs text-white/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#e8702a]/20 border border-[#e8702a]/40 flex items-center justify-center shrink-0">
              <Shield size={14} className="text-[#e8702a]" />
            </div>
            <div>
              <div className="text-white font-medium">OEM-Grade Certification</div>
              <div className="text-[11px] text-white/40">Factory-calibrated hardware standards</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
              <Activity size={14} className="text-purple-400" />
            </div>
            <div>
              <div className="text-white font-medium">Sub-Millimeter Precision</div>
              <div className="text-[11px] text-white/40">Optical & laser geometry mapping</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <Radio size={14} className="text-emerald-400" />
            </div>
            <div>
              <div className="text-white font-medium">Instant Telemetry Response</div>
              <div className="text-[11px] text-white/40">1-hour rapid triage guarantee</div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-4">
          <div className="flex items-center gap-2">
            <Globe size={13} className="text-white/40" />
            <span>© 2026 Apex Dynamics Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <span className="hover:text-white/80 transition-colors cursor-pointer">
              Privacy Protocol
            </span>
            <span className="hover:text-white/80 transition-colors cursor-pointer">
              Terms of Engineering
            </span>
            <span className="hover:text-white/80 transition-colors cursor-pointer">
              Security Standards
            </span>
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 text-white/70 hover:text-white transition-all cursor-pointer"
          >
            <span className="text-[11px]">Back to Top</span>
            <ArrowUp size={12} className="text-[#e8702a]" />
          </button>
        </div>
      </div>
    </footer>
  )
}
