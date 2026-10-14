import experience from '../../data/experience.json'
import { IconPin } from '../components/Icons'
import { step } from '../lib'
import { useI18n, type Text } from '../locale/i18n'

interface Job {
  position: Text
  companyName: Text
  from: string
  to?: string
  location?: Text
  description?: Text[]
}

export default function Experience() {
  const { t, tx } = useI18n()
  const jobs = experience as Job[]
  return (
    <section id="work-experience" className="section bg-alt" aria-labelledby="work-experience-title">
      <div className="wrap">
        <div className="reveal">
          <h2 id="work-experience-title" className="section-title">
            {t('experience.title')}
          </h2>
          <span className="title-bar" />
        </div>

        {jobs.length === 0 ? (
          <p className="reveal mt-8 text-muted">{t('experience.empty')}</p>
        ) : (
          <ol className="mt-10 space-y-6 border-l-2 border-line pl-6 md:pl-8">
            {jobs.map((job, i) => (
              <li key={`${tx(job.companyName)}-${job.from}`} className="reveal relative" style={step(i)}>
                <span className="absolute top-6 -left-[calc(1.5rem+7px)] h-3 w-3 rounded-full border-2 border-accent bg-bg md:-left-[calc(2rem+7px)]" />
                <article className="card p-5 md:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                    <div>
                      <h3 className="text-lg font-bold md:text-xl">{tx(job.position)}</h3>
                      <p className="font-medium text-accent">{tx(job.companyName)}</p>
                    </div>
                    <span className="tag">
                      {job.from} – {job.to || t('experience.present')}
                    </span>
                  </div>
                  {job.location && (
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                      <IconPin width={16} height={16} />
                      {tx(job.location)}
                    </p>
                  )}
                  {job.description && job.description.length > 0 && (
                    <ul className="mt-4 list-disc space-y-1.5 pl-5 text-muted marker:text-accent">
                      {job.description.map((d, k) => (
                        <li key={k}>{tx(d)}</li>
                      ))}
                    </ul>
                  )}
                </article>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
