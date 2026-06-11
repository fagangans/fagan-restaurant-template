'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { restaurant, t } from '@/lib/config'
import { cn } from '@/lib/utils'

const navLinks = [
  { key: 'menu' as const, href: '#menu' },
  { key: 'packages' as const, href: '#packages' },
  { key: 'gallery' as const, href: '#gallery' },
  { key: 'about' as const, href: '#about' },
  { key: 'contact' as const, href: '#location' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    if (mobileOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [mobileOpen])

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-[var(--color-surface)]/90 backdrop-blur-lg shadow-2xl border-b border-white/8'
            : 'bg-transparent'
        )}
      >
        <div className="section-padding">
          <div className="section-max-width">
            <div className="flex items-center justify-between h-16 lg:h-20">
              {/* Logo */}
              <a
                href="#"
                className="flex flex-col leading-none group"
                aria-label={`${restaurant.name} — ${t.nav.ariaHome}`}
              >
                <span className="font-display text-xl lg:text-2xl font-light text-white tracking-wide group-hover:text-[var(--color-accent)] transition-colors duration-300">
                  {restaurant.logo.text}
                </span>
                <span className="text-label text-[var(--color-accent)] text-[8px] tracking-[0.35em]">
                  {restaurant.logo.subtext}
                </span>
              </a>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-8" aria-label={t.nav.ariaMain}>
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="text-xs uppercase tracking-[0.2em] text-stone-300 hover:text-[var(--color-accent)] transition-colors duration-300 font-sans font-medium underline-reveal"
                  >
                    {t.nav[link.key]}
                  </button>
                ))}
              </nav>

              {/* Desktop CTA */}
              <div className="hidden lg:flex items-center gap-4">
                <button
                  onClick={() => handleNavClick('#location')}
                  className="btn-primary btn-luxury-enhance text-xs py-3 px-6"
                >
                  {t.nav.reserveTable}
                </button>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-white hover:text-[var(--color-accent)] transition-colors"
                aria-label={mobileOpen ? t.nav.ariaCloseMenu : t.nav.ariaOpenMenu}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-40 bg-[var(--color-surface)] flex flex-col justify-center"
          >
            <div className="section-padding py-20">
              <nav className="flex flex-col gap-6" aria-label={t.nav.ariaMobile}>
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.href}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 + 0.1 }}
                    onClick={() => handleNavClick(link.href)}
                    className="text-left font-display text-3xl font-light text-white hover:text-[var(--color-accent)] transition-colors duration-300"
                  >
                    {t.nav[link.key]}
                  </motion.button>
                ))}
              </nav>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                onClick={() => handleNavClick('#location')}
                className="btn-primary mt-10 w-full justify-center"
              >
                {t.nav.reserveTable}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
