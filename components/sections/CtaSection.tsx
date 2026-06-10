'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { CalendarDays, MessageCircle } from 'lucide-react'
import { restaurant, getWhatsAppUrl } from '@/lib/config'
import { fadeUp, staggerContainer } from '@/lib/utils'

export default function CtaSection() {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })

  const scrollToReserve = () => {
    const el = document.querySelector('#location')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative py-32 lg:py-40 overflow-hidden" aria-label="Call to action">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={restaurant.hero.backgroundImage}
          alt={restaurant.name}
          fill
          className="object-cover"
          sizes="100vw"
          quality={75}
        />
        <div className="absolute inset-0 bg-black/70" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse at center, var(--color-accent-dark) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 section-padding">
        <div className="section-max-width">
          <motion.div
            ref={ref}
            variants={staggerContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div variants={fadeUp} custom={0} className="flex items-center justify-center gap-4 mb-8">
              <span className="divider-line" />
              <span className="text-label text-[var(--color-accent)] tracking-[0.3em]">
                Begin Your Journey
              </span>
              <span className="divider-line" />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              custom={0.1}
              className="heading-display text-5xl lg:text-6xl xl:text-7xl text-white mb-6"
            >
              Reserve Your Table
            </motion.h2>
            <motion.h2
              variants={fadeUp}
              custom={0.15}
              className="heading-display text-5xl lg:text-6xl xl:text-7xl gradient-text mb-8"
            >
              Tonight
            </motion.h2>

            <motion.p
              variants={fadeUp}
              custom={0.25}
              className="text-stone-300 text-lg leading-relaxed mb-12 font-sans font-light"
            >
              An extraordinary dining experience awaits. Book your table and let us craft an evening you&apos;ll never forget.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={0.35}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={scrollToReserve}
                className="btn-primary text-base px-10 py-5 w-full sm:w-auto justify-center"
                aria-label="Reserve a table"
              >
                <CalendarDays size={18} />
                Reserve Now
              </button>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-base px-10 py-5 w-full sm:w-auto justify-center"
                aria-label="Contact us on WhatsApp"
              >
                <MessageCircle size={18} />
                WhatsApp Us
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
