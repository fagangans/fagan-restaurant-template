import { Instagram, Facebook, MapPin, Phone, Mail, Clock } from 'lucide-react'
import { restaurant, t } from '@/lib/config'

export default function Footer() {
  const { location, name, logo } = restaurant

  return (
    <footer className="bg-[var(--color-surface)] border-t border-white/5">
      <div className="section-padding py-16 lg:py-20">
        <div className="section-max-width">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className="font-display text-3xl font-light text-white">{logo.text}</div>
                <div className="text-label text-[var(--color-accent)] text-[9px] tracking-[0.35em] mt-1">
                  {logo.subtext}
                </div>
              </div>
              <p className="text-stone-400 text-sm leading-relaxed max-w-sm">
                {restaurant.shortDescription}
              </p>
              <div className="flex items-center gap-4 mt-6">
                {location.socialMedia?.instagram && (
                  <a
                    href={location.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t.footer.ariaInstagram}
                    className="w-10 h-10 border border-white/10 flex items-center justify-center text-stone-400 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/30 transition-all duration-300"
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
                    className="w-10 h-10 border border-white/10 flex items-center justify-center text-stone-400 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/30 transition-all duration-300"
                  >
                    <Facebook size={16} />
                  </a>
                )}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-label-lg text-[var(--color-accent)] mb-6">{t.footer.contact}</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-stone-400">
                  <MapPin size={14} className="mt-1 shrink-0 text-[var(--color-accent)]/60" />
                  <span>{location.address}</span>
                </li>
                <li>
                  <a
                    href={`tel:${location.phone}`}
                    className="flex items-center gap-3 text-sm text-stone-400 hover:text-[var(--color-accent)] transition-colors"
                  >
                    <Phone size={14} className="shrink-0 text-[var(--color-accent)]/60" />
                    {location.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${location.email}`}
                    className="flex items-center gap-3 text-sm text-stone-400 hover:text-[var(--color-accent)] transition-colors"
                  >
                    <Mail size={14} className="shrink-0 text-[var(--color-accent)]/60" />
                    {location.email}
                  </a>
                </li>
              </ul>
            </div>

            {/* Hours */}
            <div>
              <h3 className="text-label-lg text-[var(--color-accent)] mb-6">{t.footer.openingHours}</h3>
              <ul className="space-y-3">
                {location.hours.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-stone-400">
                    <Clock size={14} className="mt-0.5 shrink-0 text-[var(--color-accent)]/60" />
                    <div>
                      <div className="text-stone-300 text-xs">{h.days}</div>
                      <div>
                        {h.open} – {h.close}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-stone-600 text-xs">
              © {new Date().getFullYear()} {name}. {t.footer.allRightsReserved}
            </p>
            <p className="text-stone-700 text-xs">
              {t.footer.builtBy}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
