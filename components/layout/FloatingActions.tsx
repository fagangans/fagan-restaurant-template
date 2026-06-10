'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Phone, CalendarDays, ChevronUp } from 'lucide-react'
import { getWhatsAppUrl, getPhoneUrl, t } from '@/lib/config'

export default function FloatingActions() {
  const [visible, setVisible] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handler = () => {
      setVisible(window.scrollY > 300)
      setShowScrollTop(window.scrollY > 800)
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const handleReserve = () => {
    const el = document.querySelector('#location')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <>
      {/* Desktop floating panel */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="hidden lg:flex fixed right-6 bottom-8 z-40 flex-col gap-2"
        role="complementary"
        aria-label={t.floatingActions.ariaQuickActions}
      >
        {/* WhatsApp */}
        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.floatingActions.ariaWhatsApp}
          className="group flex items-center gap-3 bg-[var(--color-surface-elevated)] border border-white/10 hover:border-[#25D366]/40 px-4 py-3 transition-all duration-300 hover:bg-[#25D366]/10"
        >
          <MessageCircle size={16} className="text-[#25D366] shrink-0" />
          <span className="text-xs text-stone-400 group-hover:text-white transition-colors font-sans uppercase tracking-[0.1em] whitespace-nowrap">
            {t.floatingActions.whatsapp}
          </span>
        </a>

        {/* Call */}
        <a
          href={getPhoneUrl()}
          aria-label={t.floatingActions.ariaCall}
          className="group flex items-center gap-3 bg-[var(--color-surface-elevated)] border border-white/10 hover:border-[var(--color-accent)]/40 px-4 py-3 transition-all duration-300 hover:bg-[var(--color-accent)]/5"
        >
          <Phone size={16} className="text-[var(--color-accent)] shrink-0" />
          <span className="text-xs text-stone-400 group-hover:text-white transition-colors font-sans uppercase tracking-[0.1em] whitespace-nowrap">
            {t.floatingActions.callUs}
          </span>
        </a>

        {/* Reserve */}
        <button
          onClick={handleReserve}
          aria-label={t.floatingActions.ariaReserve}
          className="group flex items-center gap-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] px-4 py-3 transition-all duration-300"
        >
          <CalendarDays size={16} className="text-[var(--color-surface)] shrink-0" />
          <span className="text-xs text-[var(--color-surface)] font-sans uppercase tracking-[0.1em] font-semibold whitespace-nowrap">
            {t.floatingActions.reserve}
          </span>
        </button>

        {/* Scroll to top */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              aria-label={t.floatingActions.ariaScrollTop}
              className="flex items-center justify-center w-12 h-12 bg-[var(--color-surface-elevated)] border border-white/10 hover:border-[var(--color-accent)]/30 text-stone-400 hover:text-[var(--color-accent)] transition-all duration-300 self-end"
            >
              <ChevronUp size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Mobile floating bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex border-t border-white/10"
        role="complementary"
        aria-label={t.floatingActions.ariaQuickActions}
      >
        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.floatingActions.ariaWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 bg-[#075E54] hover:bg-[#128C7E] py-4 transition-colors duration-200"
        >
          <MessageCircle size={18} className="text-white" />
          <span className="text-white text-xs font-sans font-semibold uppercase tracking-[0.1em]">
            {t.floatingActions.whatsapp}
          </span>
        </a>
        <button
          onClick={handleReserve}
          aria-label={t.floatingActions.ariaReserve}
          className="flex-1 flex items-center justify-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] py-4 transition-colors duration-200"
        >
          <CalendarDays size={18} className="text-[var(--color-surface)]" />
          <span className="text-[var(--color-surface)] text-xs font-sans font-semibold uppercase tracking-[0.1em]">
            {t.floatingActions.reserve}
          </span>
        </button>
      </motion.div>
    </>
  )
}
