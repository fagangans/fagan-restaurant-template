import { Instagram, Facebook, MapPin, Phone, Mail, Clock } from 'lucide-react'
import { restaurant, t } from '@/lib/config'

export default function Footer() {
  const { location, name, logo } = restaurant

  return (
    <footer className="bg-[var(--color-surface)] border-t border-white/5">
      {/* Top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--color-accent)]/40 to-transparent" />

      <div className="section-padding py-16 lg:py-24">
        <div className="section-max-width">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className="font-display text-3xl lg:text-4xl font-light text-white tracking-wide">
                  {logo.text}
                </div>
                <div className="text-label text-[var(--color-accent)] text-[9px] tracking-[0.35em] mt-1">
                  {logo.subtext}
                </div>
              </div>
              <p className="text-stone-400 text-sm leading-relaxed max-w-sm font-sans font-light">
                {restaurant.shortDescription}
              </p>
              <div className="flex items-center gap-3 mt-8">
                {location.socialMedia?.instagram && (
                  <a
                    href={location.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t.footer.ariaInstagram}
                    className="social-icon"
                  >
                    <Instagram size={16} />
                  </a>
                )}
                {location.socialMedia?.facebook && (
                  <a
                    href={location.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t.footer.ariaFacebook}
                    className="social-icon"
                  >
                    <Facebook size={16} />
                  </a>
                )}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-label-lg text-[var(--color-accent)] mb-6 pb-3 border-b border-white/5">
                {t.footer.contact}
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-stone-400">
                  <MapPin size={14} className="mt-1 shrink-0 text-[var(--color-accent)]/70" />
                  <span className="leading-relaxed">{location.address}</span>
                </li>
                <li>
                  <a
                    href={`tel:${location.phone}`}
                    className="flex items-center gap-3 text-sm text-stone-400 hover:text-[var(--color-accent)] transition-colors duration-300 group"
                  >
                    <Phone size={14} className="shrink-0 text-[var(--color-accent)]/70 group-hover:text-[var(--color-accent)] transition-colors" />
                    {location.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${location.email}`}
                    className="flex items-center gap-3 text-sm text-stone-400 hover:text-[var(--color-accent)] transition-colors duration-300 group"
                  >
                    <Mail size={14} className="shrink-0 text-[var(--color-accent)]/70 group-hover:text-[var(--color-accent)] transition-colors" />
                    {location.email}
                  </a>
                </li>
              </ul>
            </div>

            {/* Hours */}
            <div>
              <h3 className="text-label-lg text-[var(--color-accent)] mb-6 pb-3 border-b border-white/5">
                {t.footer.openingHours}
              </h3>
              <ul className="space-y-4">
                {location.hours.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-stone-400">
                    <Clock size={14} className="mt-0.5 shrink-0 text-[var(--color-accent)]/70" />
                    <div>
                      <div className="text-stone-300 text-xs font-medium mb-0.5">{h.days}</div>
                      <div className="font-sans">
                        {h.open} – {h.close}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-stone-600 text-xs font-sans">
              © {new Date().getFullYear()} {name}. {t.footer.allRightsReserved}
            </p>
            <p className="text-stone-700 text-xs font-sans">
              {t.footer.builtBy}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
