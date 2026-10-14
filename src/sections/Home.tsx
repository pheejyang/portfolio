import { useEffect, useState, type MouseEvent } from 'react'
import hero from '../../data/hero.json'
import { IconChevronDown, IconDownload } from '../components/Icons'
import SocialLinks from '../components/SocialLinks'
import { asset, step } from '../lib'
import { useI18n } from '../locale/i18n'

export default function Home({ onNavigate }: { onNavigate: (id: string) => void }) {
  const { t, tx,lang } = useI18n()
  const titles = hero.titles.map(tx).filter(Boolean)
  const titlesKey = titles.join('|')
  const [typed, setTyped] = useState(titles[0] ?? '')
  const [cvMissing, setCvMissing] = useState(false)
  const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

  // Typing effect. It starts on the full first title (so the page is readable at once),
  // holds it, then deletes and types the next one at a calm pace.
  useEffect(() => {
    const list = titlesKey.split('|').filter(Boolean)
    setTyped(list[0] ?? '')
    if (reduced || list.length < 2) return
    let i = 0
    let n = list[0].length
    let dir: 1 | -1 = -1
    let timer = window.setTimeout(tick, 2400)
    function tick() {
      n += dir
      setTyped(list[i].slice(0, n))
      let wait = dir === 1 ? 110 : 55
      if (dir === 1 && n === list[i].length) {
        dir = -1
        wait = 2400
      } else if (dir === -1 && n === 0) {
        dir = 1
        i = (i + 1) % list.length
        wait = 450
      }
      timer = window.setTimeout(tick, wait)
    }
    return () => clearTimeout(timer)
  }, [titlesKey, reduced])

  // Download the CV; if public/cv.pdf is missing (a dev server would answer with an HTML page) show a hint instead.
  const downloadCv = async (e: MouseEvent) => {
    e.preventDefault()
    const url = asset('cv.pdf')
    try {
      const r = await fetch(url, { method: 'HEAD' })
      if (!r.ok || (r.headers.get('content-type') ?? '').includes('text/html')) {
        setCvMissing(true)
        return
      }
    } catch {
      /* offline or file:// - just try the download */
    }
    setCvMissing(false)
    const a = document.createElement('a')
    a.href = url
    a.download = `${hero.name.en.replace(/\s+/g, '-')}-CV.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <section id="home" className="section bg-bg" aria-labelledby="home-title">
      <div className="wrap flex min-h-[calc(100svh-var(--nav-h))] flex-col py-6 md:py-8">
        <div className="grid flex-1 items-center gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <p className="reveal font-medium text-accent" style={step(0)}>
              {t('hero.greeting')}
            </p>
            <h1 id="home-title" className="reveal mt-1 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl" style={step(1)}>
              {hero.name[lang]}
            </h1>
            <p className="reveal mt-3 min-h-[1.6em] text-xl font-semibold text-muted sm:text-2xl md:text-3xl" style={step(2)}>
              <span className="sr-only">{titles.join(', ')}</span>
              <span aria-hidden="true">
                {typed}
                {!reduced && <span className="cursor" />}
              </span>
            </p>
            <p className="reveal mt-5 max-w-xl text-base text-muted sm:text-lg" style={step(3)}>
              {tx(hero.profile)}
            </p>
            <div className="reveal mt-7 flex flex-wrap gap-3" style={step(4)}>
              <button type="button" className="btn btn-primary" onClick={() => onNavigate('contact')}>
                {t('hero.contact')}
              </button>
              <a className="btn btn-ghost" href={asset('cv.pdf')} download onClick={downloadCv}>
                <IconDownload />
                {t('hero.cv')}
              </a>
            </div>
            {cvMissing && (
              <p role="status" className="mt-3 text-sm font-medium text-amber-700 dark:text-amber-300">
                {t('hero.cvMissing')}
              </p>
            )}
            <div className="reveal mt-6" style={step(5)}>
              <SocialLinks />
            </div>
          </div>

          <div className="reveal order-first flex justify-center md:order-last md:justify-end" style={step(2)}>
            <div className="relative isolate w-full max-w-[13rem] sm:max-w-[16rem] md:max-w-sm">
              <div className="absolute inset-0 -z-10 translate-x-3 translate-y-3 rounded-3xl border-2 border-accent/60" />
              <img
                src={asset('hero.jpg')}
                alt={t('hero.photoAlt', { name: hero.name[lang] })}
                width={178}
                height={237}
                fetchPriority="high"
                className="aspect-[3/4] w-full rounded-3xl border border-line object-cover shadow-card"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-6">
          <button type="button" className="icon-btn" onClick={() => onNavigate('skills')} aria-label={t('hero.scroll')}>
            <IconChevronDown className="bounce" />
          </button>
        </div>
      </div>
    </section>
  )
}
