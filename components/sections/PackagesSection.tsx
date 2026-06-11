'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Check, MessageCircle } from 'lucide-react'
import { packages, formatPrice, getWhatsAppUrl, t } from '@/lib/config'
import { interpolate } from '@/lib/i18n'
import { fadeUp, staggerContainer } from '@/lib/utils'

function RotatingWord() {
  const words = packages.rotatingWords
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % words.length)
    }, 2200)
    return () => clearInterval(timer)
  }, [words.length])

  return (
    <div className="relative h-[1.15em] overflow-hidden inline-block min-w-[220px] sm:min-w-[300px]">
      <AnimatePresence mode="wait">
        <motion.span
          key={current}
          initial={{ y: '110%', opacity: 0, scale: 0.95 }}
          animate={{ y: '0%', opacity: 1, scale: 1 }}
          exit={{ y: '-110%', opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0 flex items-center gradient-text"
        >
          {words[current]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

export default function PackagesSection() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section
      id="packages"
      className="relative py-24 lg:py-32 bg-[var(--color-surface-elevated)] overflow-hidden"
      aria-labelledby="packages-heading"
    >
      {/* Background decoration */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1/2 opacity-[0.04]"
        style={{
          background:
            'radial-gradient(ellipse at left center, var(--color-accent) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute right-0 bottom-0 w-1/3 h-1/2 opacity-[0.03]"
        style={{
          background:
            'radial-gradient(ellipse at right bottom, var(--color-accent-light) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 section-padding">
        <div className="section-max-width">
          {/* Rotating headline */}
          <motion.div
            ref={ref}
            variants={staggerContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="text-center mb-16"
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <span className="divider-line" />
              <span className="text-label text-[var(--color-accent)] tracking-[0.3em]">
                {t.packages.sectionLabel}
              </span>
              <span className="divider-line" />
            </motion.div>

            <motion.div variants={fadeUp} custom={0.1} className="mb-1">
              <h2 id="packages-heading" className="heading-display text-4xl lg:text-5xl xl:text-6xl text-white">
                {packages.heading}
              </h2>
            </motion.div>

            <motion.div variants={fadeUp} custom={0.2} className="mb-6">
              <div className="heading-display text-4xl lg:text-5xl xl:text-6xl">
                <RotatingWord />
              </div>
            </motion.div>

            <motion.p
              variants={fadeUp}
              custom={0.3}
              className="text-stone-400 text-base max-w-xl mx-auto font-sans font-light"
            >
              {packages.subheading}
            </motion.p>
          </motion.div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {packages.packages.map((pkg, i) => (
              <motion.article
                key={pkg.id}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`relative overflow-hidden group bg-[var(--color-surface)] transition-all duration-500 ${
                  pkg.highlight
                    ? 'package-card-highlight'
                    : 'border border-white/5 hover:border-[var(--color-accent)]/25 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]'
                }`}
              >
                {/* Highlight badge */}
                {pkg.badge && (
                  <div className="absolute top-4 right-4 z-20 bg-[var(--color-accent)] text-[var(--color-surface)] text-[9px] font-sans uppercase tracking-[0.15em] font-semibold px-3 py-1.5">
                    {pkg.badge}
                  </div>
                )}

                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={pkg.image}
                    alt={pkg.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-108"
                    style={{ transition: 'transform 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
                    quality={80}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-[var(--color-surface)]/15 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="text-label text-[var(--color-accent)] text-[9px] tracking-[0.25em]">
                      {pkg.subtitle}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-7">
                  <h3 className="font-serif text-white text-xl font-medium mb-2.5">{pkg.name}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed mb-6 font-sans font-light">
                    {pkg.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-white/5">
                    <span className="text-label text-stone-600 text-[9px]">{t.packages.priceFrom}</span>
                    <span className="font-display text-3xl font-light text-[var(--color-accent)]">
                      {formatPrice(pkg.priceFrom)}
                    </span>
                    <span className="text-stone-500 text-xs font-sans">/{pkg.priceUnit}</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-7">
                    {pkg.features.slice(0, 4).map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-stone-400 text-xs font-sans">
                        <div className="w-4 h-4 rounded-full border border-[var(--color-accent)]/40 flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={9} className="text-[var(--color-accent)]" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={getWhatsAppUrl(
                      interpolate(t.packages.whatsappMessage, { name: pkg.name })
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full flex items-center justify-center gap-2 py-3.5 text-xs font-sans uppercase tracking-[0.15em] font-semibold transition-all duration-300 min-height-[48px] ${
                      pkg.highlight
                        ? 'bg-[var(--color-accent)] text-[var(--color-surface)] hover:bg-[var(--color-accent-light)] hover:shadow-[0_8px_25px_color-mix(in_srgb,var(--color-accent)_35%,transparent)]'
                        : 'border border-white/15 text-stone-300 hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)]'
                    }`}
                  >
                    <MessageCircle size={14} />
                    {t.packages.inquireNow}
                  </a>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Custom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="text-center bg-[var(--color-surface-overlay)] border border-[var(--color-accent)]/10 p-10 lg:p-14 relative overflow-hidden"
          >
            {/* Subtle glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--color-accent)_5%,transparent)_0%,transparent_70%)] pointer-events-none" />
            <div className="relative z-10">
              <h3 className="heading-serif text-white text-2xl lg:text-3xl mb-3">{packages.cta.heading}</h3>
              <p className="text-stone-400 text-sm mb-8 font-sans font-light max-w-md mx-auto leading-relaxed">
                {packages.cta.description}
              </p>
              <a
                href={getWhatsAppUrl(packages.cta.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex"
              >
                <MessageCircle size={16} />
                {packages.cta.buttonText}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
