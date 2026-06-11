'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Flame } from 'lucide-react'
import { menu, formatPrice, t } from '@/lib/config'
import { fadeUp, staggerContainer } from '@/lib/utils'

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState(menu.categories[0]?.id ?? '')
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  const filteredItems = menu.items.filter((item) => item.categoryId === activeCategory)

  return (
    <section id="menu" className="py-24 lg:py-32 bg-[var(--color-surface)]" aria-labelledby="menu-heading">
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
            <motion.div variants={fadeUp} custom={0} className="flex items-center justify-center gap-4 mb-6">
              <span className="divider-line" />
              <span className="text-label text-[var(--color-accent)] tracking-[0.3em]">
                {t.menu.sectionLabel}
              </span>
              <span className="divider-line" />
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={0.1}
              id="menu-heading"
              className="heading-display text-4xl lg:text-5xl xl:text-6xl text-white mb-4"
            >
              {t.menu.heading}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={0.2}
              className="text-stone-400 text-base max-w-xl mx-auto font-sans font-light"
            >
              {t.menu.description}
            </motion.p>
          </motion.div>

          {/* Category Nav — with active indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 mb-12 justify-start lg:justify-center"
            role="tablist"
            aria-label={t.menu.ariaCategories}
          >
            {menu.categories.map((cat) => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={activeCategory === cat.id}
                aria-controls={`menu-panel-${cat.id}`}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative shrink-0 px-6 py-3 text-xs font-sans uppercase tracking-[0.15em] transition-all duration-300 min-h-[44px] ${
                  activeCategory === cat.id
                    ? 'text-[var(--color-surface)] bg-[var(--color-accent)]'
                    : 'text-stone-400 border border-white/10 hover:border-[var(--color-accent)]/40 hover:text-white'
                }`}
              >
                {cat.name}
                {activeCategory === cat.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[var(--color-accent)] -z-10"
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />
                )}
              </button>
            ))}
          </motion.div>

          {/* Menu Items Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              id={`menu-panel-${activeCategory}`}
              role="tabpanel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredItems.map((item, i) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  className="card-elevated group overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      quality={80}
                    />
                    {/* Hover image overlay */}
                    <div className="absolute inset-0 bg-[var(--color-accent)]/0 group-hover:bg-[var(--color-accent)]/5 transition-colors duration-500" />
                    {item.badge && (
                      <div className="absolute top-3 left-3 bg-[var(--color-accent)] text-[var(--color-surface)] text-[9px] font-sans uppercase tracking-[0.15em] font-semibold px-2.5 py-1">
                        {item.badge}
                      </div>
                    )}
                    {item.isSpicy && (
                      <div
                        className="absolute top-3 right-3 w-6 h-6 bg-red-500/90 flex items-center justify-center"
                        aria-label={t.menu.ariaSpicy}
                      >
                        <Flame size={12} className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="font-serif text-white text-base font-medium mb-1.5 leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-stone-500 text-xs leading-relaxed font-sans mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-lg font-light text-[var(--color-accent)]">
                        {formatPrice(item.price)}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {item.isHalal && (
                          <span className="text-[9px] font-sans text-emerald-400 border border-emerald-400/30 px-2 py-0.5 uppercase tracking-[0.1em]">
                            {t.menu.halal}
                          </span>
                        )}
                        {item.isVegetarian && (
                          <span className="text-[9px] font-sans text-green-400 border border-green-400/30 px-2 py-0.5 uppercase tracking-[0.1em]">
                            {t.menu.vegetarian}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
