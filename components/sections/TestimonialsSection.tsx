'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { testimonials, t } from '@/lib/config'
import { interpolate } from '@/lib/i18n'
import { fadeUp, staggerContainer } from '@/lib/utils'

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const items = testimonials.items

  const next = useCallback(() => {
    setDirection(1)
    setCurrent((p) => (p + 1) % items.length)
  }, [items.length])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent((p) => (p - 1 + items.length) % items.length)
  }, [items.length])

  useEffect(() => {
    let timer = setInterval(next, 5000)
    const handleVisibility = () => {
      clearInterval(timer)
      if (!document.hidden) timer = setInterval(next, 5000)
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [next])

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 50, scale: 0.98 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d: number) => ({ opacity: 0, x: d * -50, scale: 0.98 }),
  }

  return (
    <section
      id="testimonials"
      className="py-24 lg:py-32 bg-[var(--color-surface)] relative overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,color-mix(in_srgb,var(--color-accent)_4%,transparent),transparent)] pointer-events-none" />

      <div className="relative section-padding">
        <div className="section-max-width">
          {/* Header */}
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
                {t.testimonials.sectionLabel}
              </span>
              <span className="divider-line" />
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={0.1}
              id="testimonials-heading"
              className="heading-display text-4xl lg:text-5xl xl:text-6xl text-white mb-4"
            >
              {testimonials.heading}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={0.2}
              className="text-stone-400 text-base max-w-xl mx-auto font-sans font-light"
            >
              {testimonials.subheading}
            </motion.p>

            {/* Rating badge */}
            <motion.div
              variants={fadeUp}
              custom={0.3}
              className="inline-flex items-center gap-3 mt-6 bg-[var(--color-surface-elevated)] border border-white/8 px-6 py-3.5"
            >
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="font-display text-xl text-white">{testimonials.stats.rating}</span>
              <span className="text-stone-500 text-xs font-sans">
                {testimonials.stats.totalReviews} {t.testimonials.reviews} · {testimonials.stats.platform}
              </span>
            </motion.div>
          </motion.div>

          {/* Carousel */}
          <div className="relative max-w-3xl mx-auto">
            {/* Large decorative quote mark */}
            <div className="absolute -top-6 -left-4 lg:-left-8 select-none pointer-events-none" aria-hidden="true">
              <span className="quote-mark-decor">&ldquo;</span>
            </div>

            <div
              role="region"
              className="overflow-hidden"
              aria-live="polite"
              aria-roledescription="carousel"
              aria-label={t.testimonials.ariaCarousel}
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="bg-[var(--color-surface-elevated)] border border-white/5 p-8 lg:p-12 relative"
                  aria-roledescription="slide"
                  aria-label={interpolate(t.testimonials.ariaSlideLabel, { name: items[current].name })}
                >
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(items[current].rating)].map((_, i) => (
                      <Star key={i} size={15} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>

                  {/* Review text */}
                  <blockquote className="font-serif text-lg lg:text-xl text-stone-200 leading-relaxed mb-8 font-light italic">
                    &ldquo;{items[current].review}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 overflow-hidden rounded-full avatar-gold shrink-0">
                      <Image
                        src={items[current].avatar}
                        alt={items[current].name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <div className="text-white font-sans font-semibold text-sm">{items[current].name}</div>
                      <div className="text-stone-500 font-sans text-xs mt-0.5">
                        {items[current].role} · {items[current].date}
                      </div>
                    </div>
                    {items[current].verified && (
                      <div className="ml-auto flex items-center gap-1.5 text-xs text-stone-500 font-sans">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(59,130,246,0.5)]">
                          <span className="text-white text-[9px] font-bold">✓</span>
                        </div>
                        {t.testimonials.verified}
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-2">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
                    aria-label={interpolate(t.testimonials.ariaGotoReview, { num: i + 1 })}
                    className={`transition-all duration-400 rounded-full ${
                      i === current
                        ? 'w-8 h-2 bg-[var(--color-accent)]'
                        : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  aria-label={t.testimonials.ariaPrev}
                  className="w-11 h-11 border border-white/10 flex items-center justify-center text-stone-400 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/40 transition-all duration-300 hover:-translate-x-0.5"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={next}
                  aria-label={t.testimonials.ariaNext}
                  className="w-11 h-11 border border-white/10 flex items-center justify-center text-stone-400 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/40 transition-all duration-300 hover:translate-x-0.5"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
