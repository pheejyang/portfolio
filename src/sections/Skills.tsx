import skills from '../../data/skill.json'
import { step } from '../lib'
import { useI18n } from '../locale/i18n'

// Percentages come from data/skill.json; anything outside 0-100 is clamped.
const clamp = (n: number) => (Number.isFinite(n) ? Math.min(100, Math.max(0, Math.round(n))) : 0)

export default function Skills() {
  const { t } = useI18n()
  return (
    <section id="skills" className="section bg-alt" aria-labelledby="skills-title">
      <div className="wrap">
        <div className="reveal">
          <h2 id="skills-title" className="section-title">
            {t('skills.title')}
          </h2>
          <span className="title-bar" />
          <p className="section-sub">{t('skills.subtitle')}</p>
        </div>

        <ul className="mt-10 grid gap-x-12 gap-y-6 md:grid-cols-2">
          {skills.map((s, i) => {
            const level = clamp(s.level)
            return (
              <li key={s.name} className="reveal" style={step(i)}>
                <div className="mb-2 flex items-baseline justify-between gap-3">
                  <span className="font-semibold">{s.name}</span>
                  <span className="text-sm font-medium text-muted tabular-nums">{level}%</span>
                </div>
                <div
                  role="progressbar"
                  aria-label={s.name}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={level}
                  className="h-2.5 overflow-hidden rounded-full bg-line"
                >
                  <div
                    className="bar-fill h-full w-full rounded-full bg-accent"
                    style={{ '--p': level / 100, '--i': i } as React.CSSProperties}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
