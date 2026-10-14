import education from '../../data/education.json'
import { IconPin } from '../components/Icons'
import { step } from '../lib'
import { useI18n, type Text } from '../locale/i18n'

interface Entry {
  degree: Text
  institution: Text
  from: string
  to?: string
  description?: Text
}

export default function Education() {
  const { t, tx } = useI18n()
  const items = education as Entry[]
  return (
    <section id="education" className="section bg-alt" aria-labelledby="education-title">
      <div className="wrap">
        <div className="reveal">
          <h2 id="education-title" className="section-title">
            {t('education.title')}
          </h2>
          <span className="title-bar" />
        </div>

        {items.length === 0 ? (
          <p className="reveal mt-8 text-muted">{t('education.empty')}</p>
        ) : (
          <ol className="mt-10 space-y-6 border-l-2 border-line pl-6 md:pl-8">
            {items.map((e, i) => (
              <li key={`${tx(e.degree)}-${e.from}`} className="reveal relative" style={step(i)}>
                <span className="absolute top-6 -left-[calc(1.5rem+7px)] h-3 w-3 rounded-full border-2 border-accent bg-bg md:-left-[calc(2rem+7px)]" />
                <article className="card p-5 md:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                    <h3 className="text-lg font-bold md:text-xl">{tx(e.degree)}</h3>
                    <span className="tag">
                      {e.from}
                      {e.to ? ` – ${e.to}` : ''}
                    </span>
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 text-muted">
                    <IconPin width={16} height={16} className="shrink-0" />
                    {tx(e.institution)}
                  </p>
                  {e.description && <p className="mt-3 text-muted">{tx(e.description)}</p>}
                </article>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
