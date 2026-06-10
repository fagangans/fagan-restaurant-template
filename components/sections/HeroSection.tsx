'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { restaurant, t } from '@/lib/config'

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const { hero } = restaurant

  const scrollToMenu = () => {
    const el = document.querySelector('#menu')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToReserve = () => {
    const el = document.querySelector('#location')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={ref}
      id="hero"
      className="relative h-screen min-h-[600px] flex items-center overflow-hidden"
      aria-label={t.hero.ariaSection}
    >
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 scale-110"
        style={{ y: imageY }}
      >
        <Image
          src={hero.backgroundImage}
          alt={`${restaurant.name} — ${restaurant.tagline}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          quality={90}
        />
        {/* Cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-[var(--color-surface)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 section-padding w-full"
        style={{ y: textY, opacity }}
      >
        <div className="section-max-width">
          <div className="max-w-3xl">
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex items-center gap-4 mb-8"
            >
              <span className="divider-line" />
              <span className="text-label text-[var(--color-accent)] tracking-[0.3em]">
                {restaurant.tagline}
              </span>
            </motion.div>

            {/* Headline */}
            <div className="overflow-hidden mb-2">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, delay: 0.35, ease: [0.77, 0, 0.175, 1] }}
                className="heading-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-white"
              >
                {hero.headline}
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-8">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, delay: 0.5, ease: [0.77, 0, 0.175, 1] }}
                className="heading-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl gradient-text"
              >
                {hero.headlineAccent}
              </motion.h1>
            </div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-xl mb-12 font-sans font-light"
            >
              {hero.subheadline}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.95, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <button
                onClick={scrollToReserve}
                className="btn-primary"
                aria-label={t.hero.ariaReserve}
              >
                {t.hero.reserveTable}
              </button>
              <button
                onClick={scrollToMenu}
                className="btn-secondary"
                aria-label={t.hero.ariaExploreMenu}
              >
                {t.hero.exploreMenu}
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        onClick={scrollToMenu}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 group"
        aria-label={t.hero.ariaScrollDown}
      >
        <span className="text-label text-stone-500 text-[9px] tracking-[0.3em]">{t.hero.scroll}</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="text-stone-400 group-hover:text-[var(--color-accent)] transition-colors"
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.button>
    </section>
  )
}
