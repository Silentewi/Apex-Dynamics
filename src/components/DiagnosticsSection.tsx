import { useEffect, useRef, useState, type FC } from 'react'
import { Activity, Zap, ShieldCheck, Gauge, Check } from 'lucide-react'

interface FeatureCard {
  tag: string
  icon: typeof Activity
  tagColor: string
  glowColor: string
  title: string
  bullets: string[]
}

const CARDS: FeatureCard[] = [
  {
    tag: 'Deep Diagnostics',
    icon: Activity,
    tagColor: 'text-amber-400',
    glowColor: 'from-[#e8702a]/30 via-orange-500/15',
    title: 'Turn complex fault codes into crystal-clear telemetry.',
    bullets: [
      'OEM-level ECU deep scans & live sensor data',
      'Micro-fault detection before component failure',
      'Direct protocol diagnostics across CAN & FlexRay',
    ],
  },
  {
    tag: 'Powertrain Overhaul',
    icon: Zap,
    tagColor: 'text-[#e8702a]',
    glowColor: 'from-[#e8702a]/40 via-purple-600/20',
    title: 'Restore factory horsepower with calibrated precision.',
    bullets: [
      'Dynamic dynamometer load & ignition tuning',
      'Transmission & dual-clutch valve calibration',
      'Injector spray & airflow optimization',
    ],
  },
  {
    tag: 'Chassis & Dynamics',
    icon: ShieldCheck,
    tagColor: 'text-orange-400',
    glowColor: 'from-orange-500/30 via-pink-600/15',
    title: 'Laser-guided alignment for unmatched stability.',
    bullets: [
      'Sub-millimeter 3D geometrical chassis mapping',
      'Adaptive air & active damper recalibration',
      'Stress-tested structural integrity certification',
    ],
  },
  {
    tag: 'Predictive Intelligence',
    icon: Gauge,
    tagColor: 'text-amber-300',
    glowColor: 'from-[#e8702a]/35 via-indigo-600/20',
    title: 'Continuous health analytics without the guesswork.',
    bullets: [
      'Wear-rate forecasting across all assemblies',
      'Zero-downtime scheduled maintenance',
      'Comprehensive certified repair warranty',
    ],
  },
]

export const DiagnosticsSection: FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="diagnostics"
      className="relative w-full bg-black py-28 sm:py-36 px-5 sm:px-8 md:px-12 lg:px-16 overflow-hidden select-none"
    >
      {/* Ambient background atmosphere glow (as in reference image) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[350px] bg-gradient-to-r from-purple-900/20 via-[#e8702a]/25 to-orange-600/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[250px] bg-[#e8702a]/15 blur-[100px] rounded-full pointer-events-none" />

      {/* Section Header */}
      <div
        className={`max-w-4xl mx-auto text-center mb-16 sm:mb-24 transition-all duration-1000 ease-out ${
          isVisible
            ? 'opacity-100 translate-y-0 filter-none'
            : 'opacity-0 translate-y-10 blur-sm'
        }`}
      >
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-normal text-white tracking-tight leading-[1.08] mb-5">
          Relied on by motorsport & luxury teams{' '}
          <span className="block font-playfair italic bg-gradient-to-r from-white via-orange-200 to-[#e8702a] bg-clip-text text-transparent">
            from diagnosis to the open road.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto leading-relaxed font-light">
          Engineered for operational clarity and zero compromises. Every system
          scanned, calibrated, and restored to pinnacle factory tolerances.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 items-stretch">
        {CARDS.map((card, index) => {
          const Icon = card.icon
          return (
            <div
              key={card.tag}
              style={{
                transitionDelay: `${index * 120}ms`,
              }}
              className={`group relative flex flex-col justify-between p-7 sm:p-8 rounded-[28px] bg-[#101015]/85 backdrop-blur-2xl border border-white/10 transition-all duration-500 ease-out cursor-pointer overflow-hidden ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-16'
              } hover:scale-[1.045] hover:-translate-y-4 hover:border-[#e8702a]/60 hover:shadow-2xl hover:shadow-[#e8702a]/20 hover:z-20`}
            >
              {/* Card top radial ambient glow on hover */}
              <div
                className={`absolute -top-28 left-1/2 -translate-x-1/2 w-56 h-56 bg-gradient-to-b ${card.glowColor} to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
              />

              {/* Top Pill Badge */}
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/10 border border-white/15 text-white/90 group-hover:bg-[#e8702a]/20 group-hover:border-[#e8702a]/40 group-hover:text-white transition-all duration-300 w-fit mb-7 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e8702a] shadow-[0_0_8px_#e8702a] animate-pulse" />
                  <Icon size={13} className={card.tagColor} />
                  <span>{card.tag}</span>
                </div>

                {/* Card Title */}
                <h3 className="text-xl sm:text-[22px] font-medium text-white group-hover:text-white leading-snug tracking-tight mb-8 transition-colors">
                  {card.title}
                </h3>
              </div>

              {/* Bullet Points */}
              <div className="relative z-10 flex flex-col gap-3.5 pt-4 border-t border-white/10 group-hover:border-white/20 transition-colors">
                {card.bullets.map((bullet) => (
                  <div
                    key={bullet}
                    className="flex items-start gap-2.5 text-xs sm:text-[13px] text-white/70 group-hover:text-white/95 leading-relaxed transition-colors"
                  >
                    <div className="shrink-0 w-4 h-4 rounded-full bg-white/10 group-hover:bg-[#e8702a]/30 border border-white/20 group-hover:border-[#e8702a]/60 flex items-center justify-center mt-0.5 transition-colors">
                      <Check size={10} className="text-[#e8702a]" />
                    </div>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              {/* Bottom ambient accent line */}
              <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#e8702a]/0 group-hover:via-[#e8702a]/50 to-transparent transition-all duration-500" />
            </div>
          )
        })}
      </div>

    </section>
  )
}
