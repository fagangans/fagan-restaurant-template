'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, ArrowRight } from 'lucide-react'
import { restaurant, t } from '@/lib/config'
import { fadeUp, staggerContainer } from '@/lib/utils'

export default function SignatureDishSection() {
  const { signatureDish } = restaurant

  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })
  const [imgRef, imgInView] = useInView({ threshold: 0.1, triggerOnce: true })

  if (!signatureDish.enabled) return null

  const handleWhatsApp = () => {
    const el = document.querySelector('#location')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden" aria-labelledby="signature-heading">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[var(--color-surface-elevated)]" />
      <div
        className="absolute right-0 top-0 bottom-0 w-1/2 opacity-5"
        style={{
          background:
            'radial-gradient(ellipse at right center, var(--color-accent) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 section-padding">
        <div className="section-max-width">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            {/* Image */}
            <motion.div
              ref={imgRef}
              initial={{ opacity: 0, scale: 0.95, x: -40 }}
              animate={imgInView ? { opacity: 1, scale: 1, x: 0 } : {}}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* Decorative frame */}
                <div className="absolute -inset-3 border border-[var(--color-accent)]/15 z-10 pointer-events-none" />
                <div className="absolute -inset-6 border border-[var(--color-accent)]/5 z-10 pointer-events-none" />

                <Image
                  src={signatureDish.image}
                  alt={signatureDish.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  quality={90}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Floating price badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={imgInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -bottom-6 -right-4 lg:right-8 bg-[var(--color-accent)] text-[var(--color-surface)] px-6 py-3"
              >
                <div className="text-label text-[9px] tracking-[0.25em] mb-0.5 opacity-70">
                  {t.signatureDish.startingFrom}
                </div>
                <div className="font-display text-xl font-light">{signatureDish.price}</div>
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
              ref={ref}
              variants={staggerContainer}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="order-1 lg:order-2"
            >
              <motion.div variants={fadeUp} custom={0} className="flex items-center gap-4 mb-6">
                <span className="divider-line" />
                <span className="text-label text-[var(--color-accent)] tracking-[0.3em]">
                  {signatureDish.subtitle}
                </span>
              </motion.div>

              <motion.h2
                variants={fadeUp}
                custom={0.1}
                id="signature-heading"
                className="heading-display text-4xl lg:text-5xl xl:text-6xl text-white mb-6"
              >
                {signatureDish.name}
              </motion.h2>

              <motion.p
                variants={fadeUp}
                custom={0.2}
                className="text-stone-400 text-base leading-relaxed mb-8 font-sans font-light"
              >
                {signatureDish.description}
              </motion.p>

              {/* Badges */}
              <motion.div
                variants={fadeUp}
                custom={0.3}
                className="flex flex-wrap gap-3 mb-10"
              >
                {signatureDish.badges.map((badge) => (
                  <span
                    key={badge}
                    className="flex items-center gap-1.5 px-4 py-2 border border-[var(--color-accent)]/30 text-[var(--color-accent)] text-xs font-sans uppercase tracking-[0.15em]"
                  >
                    <Star size={10} fill="currentColor" />
                    {badge}
                  </span>
                ))}
              </motion.div>

              <motion.button
                variants={fadeUp}
                custom={0.4}
                onClick={handleWhatsApp}
                className="btn-ghost group"
                aria-label={t.signatureDish.ariaOrder}
              >
                {t.signatureDish.orderNow}
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
