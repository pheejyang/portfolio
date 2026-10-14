import certificates from '../../data/certificate.json'
import { IconAward } from '../components/Icons'
import { asset, step } from '../lib'
import { useI18n, type Text } from '../locale/i18n'

interface Certificate {
  title: Text
  year?: string
  date?: string
  description?: Text
  image?: string
}

export default function Certificates() {
  const { t, tx } = useI18n()
  const items = certificates as Certificate[]
  return (
    <section id="certificates" className="section bg-bg" aria-labelledby="certificates-title">
      <div className="wrap">
        <div className="reveal">
          <h2 id="certificates-title" className="section-title">
            {t('certificates.title')}
          </h2>
          <span className="title-bar" />
        </div>

        {items.length === 0 ? (
          <p className="reveal mt-8 text-muted">{t('certificates.empty')}</p>
        ) : (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((c, i) => (
              <li key={`${tx(c.title)}-${c.year ?? c.date}`} className="reveal" style={step(i)}>
                <article className="card flex h-full flex-col overflow-hidden">
                  {c.image ? (
                    <img
                      src={asset(c.image)}
                      alt={tx(c.title)}
                      loading="lazy"
                      className="aspect-[4/3] w-full border-b border-line object-cover"
                    />
                  ) : (
                    <div className="grid aspect-[4/3] place-items-center border-b border-line bg-soft text-accent">
                      <IconAward width={44} height={44} />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <span className="tag self-start">{c.date ?? c.year}</span>
                    <h3 className="text-lg font-bold">{tx(c.title)}</h3>
                    {c.description && <p className="text-muted">{tx(c.description)}</p>}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
