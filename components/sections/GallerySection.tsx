'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { X, ZoomIn } from 'lucide-react'
import { gallery, t } from '@/lib/config'
import { interpolate } from '@/lib/i18n'
import { fadeUp, staggerContainer } from '@/lib/utils'

export default function GallerySection() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [lightboxItem, setLightboxItem] = useState<(typeof gallery.items)[0] | null>(null)
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  const filtered =
    activeFilter === 'all'
      ? gallery.items
      : gallery.items.filter((item) => item.category === activeFilter)

  return (
    <section
      id="gallery"
      className="py-24 lg:py-32 bg-[var(--color-surface-elevated)]"
      aria-labelledby="gallery-heading"
    >
      <div className="section-padding">
        <div className="section-max-width">
          {/* Header */}
          <motion.div
            ref={ref}
            variants={staggerContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="text-center mb-12"
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <span className="divider-line" />
              <span className="text-label text-[var(--color-accent)] tracking-[0.3em]">
                {t.gallery.sectionLabel}
              </span>
              <span className="divider-line" />
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={0.1}
              id="gallery-heading"
              className="heading-display text-4xl lg:text-5xl xl:text-6xl text-white mb-4"
            >
              {gallery.heading}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={0.2}
              className="text-stone-400 text-base max-w-lg mx-auto font-sans font-light"
            >
              {gallery.subheading}
            </motion.p>
          </motion.div>

          {/* Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 mb-10 justify-start lg:justify-center"
            role="tablist"
            aria-label={t.gallery.ariaFilters}
          >
            {gallery.categories.map((cat) => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={activeFilter === cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`shrink-0 px-5 py-2.5 text-xs font-sans uppercase tracking-[0.15em] transition-all duration-300 ${
                  activeFilter === cat.id
                    ? 'bg-[var(--color-accent)] text-[var(--color-surface)]'
                    : 'border border-white/10 text-stone-400 hover:border-[var(--color-accent)]/30 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </motion.div>

          {/* Masonry Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3"
            >
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="break-inside-avoid relative group overflow-hidden cursor-pointer"
                  onClick={() => setLightboxItem(item)}
                  role="button"
                  tabIndex={0}
                  aria-label={interpolate(t.gallery.ariaViewItem, { alt: item.alt })}
                  onKeyDown={(e) => e.key === 'Enter' && setLightboxItem(item)}
                >
                  <div
                    className={`relative overflow-hidden ${
                      item.span === 'large'
                        ? 'aspect-[3/2]'
                        : item.span === 'medium'
                        ? 'aspect-[4/3]'
                        : 'aspect-square'
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      quality={80}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                        <ZoomIn size={18} className="text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxItem(null)}
            role="dialog"
            aria-modal="true"
            aria-label={lightboxItem.alt}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl max-h-[90vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxItem.image.replace('w=600', 'w=1200').replace('w=800', 'w=1600')}
                alt={lightboxItem.alt}
                fill
                className="object-contain"
                sizes="100vw"
                quality={90}
              />
            </motion.div>
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              aria-label={t.gallery.ariaCloseLightbox}
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
