'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'
import { gallery, t } from '@/lib/config'
import { interpolate } from '@/lib/i18n'
import { fadeUp, staggerContainer } from '@/lib/utils'

export default function GallerySection() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [lightboxItem, setLightboxItem] = useState<(typeof gallery.items)[0] | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const filtered =
    activeFilter === 'all'
      ? gallery.items
      : gallery.items.filter((item) => item.category === activeFilter)

  useEffect(() => {
    if (!lightboxItem) return
    closeButtonRef.current?.focus()
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxItem(null)
      if (e.key === 'ArrowRight') navigateLightbox(1)
      if (e.key === 'ArrowLeft') navigateLightbox(-1)
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxItem, lightboxIndex])

  const openLightbox = (item: (typeof gallery.items)[0], index: number) => {
    setLightboxItem(item)
    setLightboxIndex(index)
  }

  const navigateLightbox = (dir: number) => {
    const newIndex = (lightboxIndex + dir + filtered.length) % filtered.length
    setLightboxIndex(newIndex)
    setLightboxItem(filtered[newIndex])
  }

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

          {/* Filter tabs */}
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
                className={`shrink-0 px-5 py-2.5 text-xs font-sans uppercase tracking-[0.15em] transition-all duration-300 min-h-[44px] ${
                  activeFilter === cat.id
                    ? 'bg-[var(--color-accent)] text-[var(--color-surface)]'
                    : 'border border-white/10 text-stone-400 hover:border-[var(--color-accent)]/40 hover:text-white'
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
              transition={{ duration: 0.35 }}
              className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3"
            >
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.45 }}
                  className="break-inside-avoid relative group overflow-hidden cursor-pointer"
                  onClick={() => openLightbox(item, i)}
                  role="button"
                  tabIndex={0}
                  aria-label={interpolate(t.gallery.ariaViewItem, { alt: item.alt })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      openLightbox(item, i)
                    }
                  }}
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
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      quality={80}
                    />
                    {/* Editorial overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                      <div className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/40 flex items-center justify-center mb-2">
                        <ZoomIn size={18} className="text-white" />
                      </div>
                    </div>
                    {/* Caption reveal */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
                      <p className="text-white text-xs font-sans leading-snug line-clamp-2">{item.alt}</p>
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
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-50 bg-black/97 flex items-center justify-center p-4"
            onClick={() => setLightboxItem(null)}
            role="dialog"
            aria-modal="true"
            aria-label={lightboxItem.alt}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative max-w-5xl max-h-[85vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxItem.image.replace(/w=\d+/, 'w=1600')}
                alt={lightboxItem.alt}
                fill
                className="object-contain"
                sizes="100vw"
                quality={90}
              />
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-center">
                <p className="text-stone-300 text-sm font-sans">{lightboxItem.alt}</p>
              </div>
            </motion.div>

            {/* Close */}
            <button
              ref={closeButtonRef}
              onClick={() => setLightboxItem(null)}
              className="absolute top-5 right-5 w-11 h-11 bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-200"
              aria-label={t.gallery.ariaCloseLightbox}
            >
              <X size={20} />
            </button>

            {/* Navigation */}
            {filtered.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateLightbox(-1) }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:-translate-x-0.5 transition-all duration-200"
                  aria-label="Gambar sebelumnya"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateLightbox(1) }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:translate-x-0.5 transition-all duration-200"
                  aria-label="Gambar berikutnya"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
