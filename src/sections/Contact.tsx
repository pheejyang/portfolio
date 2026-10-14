import contactData from '../../data/contact.json'
import { contactIcons } from '../components/Icons'
import { safeUrl, step, telHref, type Contact as ContactData } from '../lib'
import { useI18n } from '../locale/i18n'

const order = ['mobile', 'email', 'facebook', 'tiktok', 'youtube', 'portfolio'] as const

interface Row {
  key: (typeof order)[number]
  text: string
  href: string
  external: boolean
}

export default function Contact() {
  const { t } = useI18n()
  const data = contactData as ContactData

  // Build the list from whatever is filled in; empty fields are skipped.
  const rows: Row[] = []
  for (const key of order) {
    const value = data[key]?.trim()
    if (!value) continue
    if (key === 'mobile') rows.push({ key, text: value, href: telHref(value), external: false })
    else if (key === 'email') rows.push({ key, text: value, href: `mailto:${value}`, external: false })
    else {
      const url = safeUrl(value)
      if (url) rows.push({ key, text: url.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, ''), href: url, external: true })
    }
  }

  return (
    <section id="contact" className="section bg-bg" aria-labelledby="contact-title">
      <div className="wrap">
        <div className="reveal">
          <h2 id="contact-title" className="section-title">
            {t('contact.title')}
          </h2>
          <span className="title-bar" />
          <p className="section-sub">{t('contact.invite')}</p>
        </div>

        {rows.length === 0 ? (
          <p className="reveal mt-8 text-muted">{t('contact.empty')}</p>
        ) : (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((r, i) => {
              const Icon = contactIcons[r.key]
              return (
                <li key={r.key} className="reveal" style={step(i)}>
                  <a
                    href={r.href}
                    {...(r.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="card flex items-center gap-4 p-4 transition-colors hover:border-accent"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-soft text-accent">
                      <Icon width={22} height={22} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-muted">{t(`contact.${r.key}`)}</span>
                      <span className="block truncate font-semibold">{r.text}</span>
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
