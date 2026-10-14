import { useRef, useState, type KeyboardEvent } from 'react'
import projects from '../../data/project.json'
import { IconChevronLeft, IconChevronRight, IconCode, IconExternal } from '../components/Icons'
import { asset, safeUrl, step } from '../lib'
import { useI18n, type Text } from '../locale/i18n'

interface Project {
  id: string
  name: Text
  description: Text
  technologies?: string[]
  images?: string[]
  githubUrl?: string
  liveUrl?: string
  likes?: number // accepted in the data but intentionally not displayed (there is no like system)
  placeholderImages?: boolean // shows a "placeholder screenshots" badge
}

export default function Projects() {
  const { t, tx } = useI18n()
  const list = projects as Project[]
  const [p, setP] = useState(0)
  const [i, setI] = useState(0)
  const startX = useRef<number | null>(null)

  const project = list[p]
  const images = project?.images ?? []
  const github = safeUrl(project?.githubUrl)
  const live = safeUrl(project?.liveUrl)

  const moveImage = (dir: 1 | -1) => images.length > 1 && setI((i + dir + images.length) % images.length)
  const moveProject = (dir: 1 | -1) => {
    setP((p + dir + list.length) % list.length)
    setI(0)
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') moveImage(-1)
    if (e.key === 'ArrowRight') moveImage(1)
  }

  return (
    <section id="projects" className="section bg-bg" aria-labelledby="projects-title">
      <div className="wrap">
        <div className="reveal flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="projects-title" className="section-title">
              {t('projects.title')}
            </h2>
            <span className="title-bar" />
            <p className="section-sub">{t('projects.subtitle')}</p>
          </div>
          {list.length > 1 && (
            <div className="flex items-center gap-2">
              <button type="button" className="icon-btn" onClick={() => moveProject(-1)} aria-label={t('projects.prevProject')}>
                <IconChevronLeft />
              </button>
              <span className="min-w-28 text-center text-sm text-muted" aria-live="polite">
                {t('projects.projectOf', { n: p + 1, total: list.length })}
              </span>
              <button type="button" className="icon-btn" onClick={() => moveProject(1)} aria-label={t('projects.nextProject')}>
                <IconChevronRight />
              </button>
            </div>
          )}
        </div>

        {!project ? (
          <p className="reveal mt-8 text-muted">{t('projects.empty')}</p>
        ) : (
          <article className="reveal mt-10 grid items-center gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12" style={step(1)}>
            {/* Image carousel: buttons, dots, arrow keys and swipe */}
            <div
              role="group"
              aria-roledescription="carousel"
              aria-label={tx(project.name)}
              tabIndex={0}
              onKeyDown={onKey}
              onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (startX.current === null) return
                const dx = e.changedTouches[0].clientX - startX.current
                startX.current = null
                if (Math.abs(dx) > 50) moveImage(dx < 0 ? 1 : -1)
              }}
              className="card relative overflow-hidden"
            >
              {images.length === 0 ? (
                <div className="grid aspect-[16/10] place-items-center bg-soft text-accent">
                  <IconCode width={48} height={48} />
                </div>
              ) : (
                <div
                  className="flex touch-pan-y transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(-${i * 100}%)` }}
                >
                  {images.map((src, k) => (
                    <div
                      key={src}
                      className="aspect-[16/10] w-full shrink-0"
                      role="group"
                      aria-roledescription="slide"
                      aria-label={t('projects.image', { n: k + 1, total: images.length })}
                      aria-hidden={k !== i}
                    >
                      <img
                        src={asset(src)}
                        alt={t('projects.imageAlt', { name: tx(project.name), n: k + 1 })}
                        width={1280}
                        height={800}
                        loading={k === 0 ? 'eager' : 'lazy'}
                        draggable={false}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {project.placeholderImages && (
                <span className="absolute top-3 left-3 rounded-full bg-fg/85 px-3 py-1 text-xs font-semibold text-bg">
                  {t('projects.placeholder')}
                </span>
              )}

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => moveImage(-1)}
                    aria-label={t('projects.prevImage')}
                    className="icon-btn absolute top-1/2 left-3 -translate-y-1/2 opacity-90"
                  >
                    <IconChevronLeft />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(1)}
                    aria-label={t('projects.nextImage')}
                    className="icon-btn absolute top-1/2 right-3 -translate-y-1/2 opacity-90"
                  >
                    <IconChevronRight />
                  </button>
                  <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
                    {images.map((src, k) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setI(k)}
                        aria-label={t('projects.goToImage', { n: k + 1 })}
                        aria-current={k === i}
                        className={
                          'h-2.5 cursor-pointer rounded-full border border-line transition-[width,background-color] ' +
                          (k === i ? 'w-6 bg-accent' : 'w-2.5 bg-card')
                        }
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div>
              <h3 className="text-2xl font-bold">{tx(project.name)}</h3>
              <p className="mt-3 text-muted">{tx(project.description)}</p>
              {project.technologies && project.technologies.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <li key={tech} className="tag">
                      {tech}
                    </li>
                  ))}
                </ul>
              )}
              {(github || live) && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {github && (
                    <a className="btn btn-ghost" href={github} target="_blank" rel="noopener noreferrer">
                      <IconCode />
                      {t('projects.github')}
                    </a>
                  )}
                  {live && (
                    <a className="btn btn-primary" href={live} target="_blank" rel="noopener noreferrer">
                      <IconExternal />
                      {t('projects.live')}
                    </a>
                  )}
                </div>
              )}
            </div>
          </article>
        )}
      </div>
    </section>
  )
}
