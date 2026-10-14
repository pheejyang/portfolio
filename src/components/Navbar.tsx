import { useEffect, useRef, useState } from 'react'
import hero from '../../data/hero.json'
import { useI18n, type Lang } from '../locale/i18n'
import { IconClose, IconMenu, IconMoon, IconSun } from './Icons'

interface Props {
  ids: readonly string[]
  active: string
  onNavigate: (id: string) => void
}

const langs: { code: Lang; label: string }[] = [
  { code: 'la', label: 'ລາວ' },
  { code: 'en', label: 'EN' },
]

export default function Navbar({ ids, active, onNavigate }: Props) {
  const { t, lang, setLang } = useI18n()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme ?? 'light')
  const sentinel = useRef<HTMLDivElement>(null)

  // "Scrolled" state comes from an observer on a 1px marker at the top of the page (no scroll listener).
  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Close the mobile menu with Escape or when the screen becomes wide enough for the desktop bar.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const mq = matchMedia('(min-width: 1280px)')
    const onMq = () => mq.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onMq)
    return () => {
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onMq)
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {
      /* ignore */
    }
    setTheme(next)
  }

  const go = (id: string) => {
    setOpen(false)
    onNavigate(id)
  }

  const controls = (
    <>
      <div role="group" aria-label={t('nav.language')} className="flex rounded-xl border border-line bg-card p-0.5">
        {langs.map((l) => (
          <button
            key={l.code}
            type="button"
            aria-pressed={lang === l.code}
            onClick={() => setLang(l.code)}
            className={
              'min-w-10 cursor-pointer rounded-lg px-2.5 py-1 text-sm font-semibold transition-colors ' +
              (lang === l.code ? 'bg-accent text-accent-fg' : 'text-muted hover:text-fg')
            }
          >
            {l.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="icon-btn"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? t('nav.toLight') : t('nav.toDark')}
      >
        {theme === 'dark' ? <IconSun /> : <IconMoon />}
      </button>
    </>
  )

  return (
    <>
      <div ref={sentinel} aria-hidden="true" className="pointer-events-none absolute top-0 left-0 h-2 w-px" />
      <header
        className={
          'fixed inset-x-0 top-0 z-40 border-b backdrop-blur transition-[background-color,box-shadow,border-color] duration-300 ' +
          (scrolled || open ? 'border-line shadow-card' : 'border-transparent')
        }
        style={{ background: scrolled || open ? 'var(--nav)' : 'transparent' }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              go('home')
            }}
            aria-label={t('nav.goHome')}
            className="flex min-w-0 items-center gap-3 font-bold"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-sm text-accent-fg">
              {hero.name.en
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)}
            </span>
            <span className="truncate">{hero.name[lang]}</span>
          </a>

          {/* Desktop */}
          <nav aria-label={t('nav.primary')} className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {ids.map((id) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={active === id ? 'location' : undefined}
                    onClick={(e) => {
                      e.preventDefault()
                      go(id)
                    }}
                    className={
                      'relative block rounded-lg px-2.5 py-2 text-sm font-medium transition-colors after:absolute after:inset-x-2.5 after:bottom-0.5 after:h-0.5 after:origin-left after:rounded after:bg-accent after:transition-transform ' +
                      (active === id
                        ? 'text-accent after:scale-x-100'
                        : 'text-muted after:scale-x-0 hover:text-fg')
                    }
                  >
                    {t(`nav.${id}`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="hidden items-center gap-2 xl:flex">{controls}</div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="icon-btn xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            onClick={() => setOpen(!open)}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>

        {/* Mobile menu: slides open under the brand row, header is fixed so nothing below moves */}
        <div
          id="mobile-menu"
          inert={!open}
          className={
            'grid transition-[grid-template-rows] duration-200 xl:hidden ' + (open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')
          }
        >
          <div className="overflow-hidden">
            <div className="max-h-[calc(100svh-var(--nav-h))] overflow-y-auto px-5 pb-5 md:px-8">
              <hr className="border-line" />
              <nav aria-label={t('nav.primary')} className="py-2">
                <ul>
                  {ids.map((id) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        aria-current={active === id ? 'location' : undefined}
                        onClick={(e) => {
                          e.preventDefault()
                          go(id)
                        }}
                        className={
                          'block rounded-lg px-3 py-2.5 font-medium ' +
                          (active === id ? 'bg-soft text-accent' : 'text-fg hover:bg-soft')
                        }
                      >
                        {t(`nav.${id}`)}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <hr className="border-line" />
              <div className="flex items-center justify-between gap-3 pt-4">{controls}</div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
