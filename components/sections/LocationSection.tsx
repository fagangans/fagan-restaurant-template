'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { MapPin, Phone, Mail, Clock, MessageCircle, CalendarDays } from 'lucide-react'
import { restaurant, getWhatsAppUrl, t } from '@/lib/config'
import { fadeUp, staggerContainer } from '@/lib/utils'

export default function LocationSection() {
  const { location } = restaurant
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section
      id="location"
      className="py-24 lg:py-32 bg-[var(--color-surface-elevated)]"
      aria-labelledby="location-heading"
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
                {t.location.sectionLabel}
              </span>
              <span className="divider-line" />
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={0.1}
              id="location-heading"
              className="heading-display text-4xl lg:text-5xl xl:text-6xl text-white mb-4"
            >
              {t.location.heading}
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative aspect-[4/3] overflow-hidden border border-white/5"
            >
              <iframe
                src={location.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${restaurant.name} ${t.location.ariaMapTitle}`}
                className="absolute inset-0"
              />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-8"
            >
              {/* Address */}
              <div>
                <h3 className="text-label-lg text-[var(--color-accent)] mb-4">{t.location.address}</h3>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-[var(--color-accent)]/60 mt-0.5 shrink-0" />
                  <p className="text-stone-300 text-sm leading-relaxed">{location.address}</p>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-label-lg text-[var(--color-accent)] mb-4">{t.location.contact}</h3>
                <div className="space-y-3">
                  <a
                    href={`tel:${location.phone}`}
                    className="flex items-center gap-3 text-stone-300 text-sm hover:text-[var(--color-accent)] transition-colors"
                  >
                    <Phone size={16} className="text-[var(--color-accent)]/60 shrink-0" />
                    {location.phone}
                  </a>
                  <a
                    href={`mailto:${location.email}`}
                    className="flex items-center gap-3 text-stone-300 text-sm hover:text-[var(--color-accent)] transition-colors"
                  >
                    <Mail size={16} className="text-[var(--color-accent)]/60 shrink-0" />
                    {location.email}
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div>
                <h3 className="text-label-lg text-[var(--color-accent)] mb-4">{t.location.openingHours}</h3>
                <div className="space-y-2.5">
                  {location.hours.map((h, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Clock size={14} className="text-[var(--color-accent)]/60 shrink-0" />
                      <div className="flex items-center justify-between flex-1">
                        <span className="text-stone-400 text-sm font-sans">{h.days}</span>
                        <span className="text-stone-300 text-sm font-sans tabular-nums">
                          {h.open} – {h.close}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex-1 justify-center"
                  aria-label={t.location.ariaReserveWA}
                >
                  <CalendarDays size={16} />
                  {t.location.reserveTable}
                </a>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex-1 justify-center"
                  aria-label={t.location.ariaWhatsApp}
                >
                  <MessageCircle size={16} />
                  {t.location.whatsapp}
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
