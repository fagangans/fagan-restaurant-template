'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Crown, Users, Trees, Moon, Car, Sparkles } from 'lucide-react'
import { restaurant, t } from '@/lib/config'
import { fadeUp, staggerContainer } from '@/lib/utils'

const iconMap = {
  crown: Crown,
  users: Users,
  trees: Trees,
  moon: Moon,
  car: Car,
  sparkles: Sparkles,
}

export default function FacilitiesSection() {
  const { facilities } = restaurant
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section
      id="facilities"
      className="py-24 lg:py-32 bg-[var(--color-surface)]"
      aria-labelledby="facilities-heading"
    >
      <div className="section-padding">
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
                {t.facilities.sectionLabel}
              </span>
              <span className="divider-line" />
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={0.1}
              id="facilities-heading"
              className="heading-display text-4xl lg:text-5xl xl:text-6xl text-white mb-4"
            >
              {t.facilities.heading}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={0.2}
              className="text-stone-400 text-base max-w-xl mx-auto font-sans font-light"
            >
              {t.facilities.description}
            </motion.p>
          </motion.div>

          {/* Facilities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility, i) => {
              const Icon = iconMap[facility.icon as keyof typeof iconMap] || Crown
              return (
                <motion.article
                  key={facility.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    delay: 0.3 + i * 0.08,
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="card-elevated group overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={facility.image}
                      alt={facility.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      quality={80}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-elevated)] via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 w-10 h-10 bg-[var(--color-surface-overlay)]/80 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                      <Icon size={16} className="text-[var(--color-accent)]" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-serif text-white text-lg font-medium mb-1.5">
                      {facility.name}
                    </h3>
                    <p className="text-stone-500 text-xs leading-relaxed font-sans mb-4">
                      {facility.description}
                    </p>

                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                      <span className="text-[var(--color-accent)] text-xs font-sans uppercase tracking-[0.1em]">
                        {facility.capacity}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {facility.features.slice(0, 3).map((feat) => (
                        <span
                          key={feat}
                          className="text-[9px] font-sans text-stone-500 border border-white/5 px-2 py-1 uppercase tracking-[0.1em]"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
