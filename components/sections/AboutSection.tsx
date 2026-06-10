'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Leaf, Star, Users } from 'lucide-react'
import { restaurant, t } from '@/lib/config'
import { fadeUp, staggerContainer } from '@/lib/utils'

const iconMap = { leaf: Leaf, star: Star, users: Users }

export default function AboutSection() {
  const { about } = restaurant
  const [ref, inView] = useInView({ threshold: 0.15, triggerOnce: true })
  const [imgRef, imgInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [statsRef, statsInView] = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <section id="about" className="relative py-24 lg:py-32 overflow-hidden" aria-labelledby="about-heading">
      <div className="section-padding">
        <div className="section-max-width">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Image */}
            <motion.div
              ref={imgRef}
              initial={{ opacity: 0, x: -40 }}
              animate={imgInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={about.image}
                  alt={`${restaurant.name} ${t.about.ariaKitchen}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent opacity-60" />
              </div>

              {/* Stats overlay */}
              <motion.div
                ref={statsRef}
                initial={{ opacity: 0, y: 30 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute -bottom-8 -right-4 lg:-right-8 grid grid-cols-2 gap-px bg-[var(--color-accent)]/20"
              >
                {about.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-[var(--color-surface-overlay)] px-6 py-4 text-center"
                  >
                    <div className="font-display text-2xl font-light text-[var(--color-accent)]">
                      {stat.number}
                    </div>
                    <div className="text-stone-500 text-xs mt-1 font-sans uppercase tracking-[0.1em]">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
              ref={ref}
              variants={staggerContainer}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="lg:pl-4"
            >
              <motion.div variants={fadeUp} custom={0} className="flex items-center gap-4 mb-6">
                <span className="divider-line" />
                <span className="text-label text-[var(--color-accent)] tracking-[0.3em]">
                  {t.about.sectionLabel}
                </span>
              </motion.div>

              <motion.h2
                variants={fadeUp}
                custom={0.1}
                id="about-heading"
                className="heading-display text-4xl lg:text-5xl xl:text-6xl mb-8"
              >
                <span className="text-white">{about.heading}</span>{' '}
                <span className="gradient-text">{about.headingAccent}</span>
              </motion.h2>

              <motion.p
                variants={fadeUp}
                custom={0.25}
                className="text-stone-400 text-base leading-relaxed mb-6 font-sans font-light"
              >
                {about.story}
              </motion.p>

              <motion.p
                variants={fadeUp}
                custom={0.35}
                className="text-stone-400 text-base leading-relaxed mb-10 font-sans font-light"
              >
                {about.mission}
              </motion.p>

              {/* Values */}
              <motion.div variants={fadeUp} custom={0.45} className="space-y-5">
                {about.values.map((value) => {
                  const Icon = iconMap[value.icon as keyof typeof iconMap] || Leaf
                  return (
                    <div key={value.title} className="flex items-start gap-4">
                      <div className="w-10 h-10 border border-[var(--color-accent)]/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon size={16} className="text-[var(--color-accent)]" />
                      </div>
                      <div>
                        <div className="text-white text-sm font-sans font-medium mb-1">
                          {value.title}
                        </div>
                        <div className="text-stone-500 text-sm font-sans font-light">
                          {value.description}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
