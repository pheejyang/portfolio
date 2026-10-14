import { useCallback, useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import Home from './sections/Home'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Experience from './sections/Experience'
import Certificates from './sections/Certificates'
import Education from './sections/Education'
import Contact from './sections/Contact'
import Gallery from './sections/Gallery'

export const SECTION_IDS = [
  'home',
  'skills',
  'projects',
  'work-experience',
  'certificates',
  'education',
  'contact',
  'gallery',
] as const

const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

export default function App() {
  const [active, setActive] = useState<string>('home')
  const activeRef = useRef<string>('home')
  // While we are scrolling to a clicked section, ignore the sections we pass on the way.
  const lock = useRef<{ id: string; timer: number } | null>(null)
  const resync = useRef<() => void>(() => {})

  const releaseLock = () => {
    if (lock.current) clearTimeout(lock.current.timer)
    lock.current = null
  }

  const focusSection = useCallback((id: string, smooth: boolean) => {
    const el = document.getElementById(id)
    if (!el) return
    activeRef.current = id
    setActive(id)
    releaseLock()
    lock.current = {
      id,
      timer: window.setTimeout(() => {
        lock.current = null
        resync.current()
      }, 1500),
    }
    el.scrollIntoView({ behavior: smooth && !prefersReducedMotion() ? 'smooth' : 'auto', block: 'start' })
  }, [])

  const navigate = useCallback(
    (id: string) => {
      if (location.hash !== `#${id}`) history.pushState(null, '', `#${id}`)
      focusSection(id, true)
    },
    [focusSection],
  )

  // Active section = the one under a thin band at the middle of the screen.
  // Hysteresis: the current section stays active until it actually leaves the band,
  // so standing on a boundary can never make the highlight flip back and forth.
  useEffect(() => {
    const inBand = new Set<string>()
    const pick = () => {
      if (lock.current || inBand.has(activeRef.current)) return
      const next = SECTION_IDS.find((id) => inBand.has(id))
      if (next) {
        activeRef.current = next
        setActive(next)
      }
    }
    resync.current = pick
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inBand.add(e.target.id)
          else inBand.delete(e.target.id)
        }
        if (lock.current && inBand.has(lock.current.id)) releaseLock() // arrived
        pick()
      },
      { rootMargin: '-49% 0px -49% 0px' },
    )
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => {
      io.disconnect()
      releaseLock()
    }
  }, [])

  // Entrance animations: each section gets `.in` once, the first time it comes into view, and keeps it.
  // Nothing is ever removed, hidden or unmounted, so crossing a boundary again changes nothing.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -15% 0px' },
    )
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  // Direct links (/#projects), plus manual hash edits and back/forward.
  useEffect(() => {
    const fromHash = () => {
      const id = location.hash.slice(1)
      return (SECTION_IDS as readonly string[]).includes(id) ? id : null
    }
    let touched = false
    const markTouched = () => {
      touched = true
    }
    const events = ['wheel', 'touchstart', 'keydown'] as const
    events.forEach((ev) => window.addEventListener(ev, markTouched, { once: true, passive: true }))

    const first = fromHash()
    if (first) {
      requestAnimationFrame(() => focusSection(first, false))
      // Web fonts can change section heights; re-align once if the visitor has not moved yet.
      document.fonts?.ready.then(() => {
        if (!touched && fromHash() === first) focusSection(first, false)
      })
    }

    const onHash = () => {
      const id = fromHash()
      if (id) focusSection(id, true)
    }
    window.addEventListener('hashchange', onHash)
    return () => {
      window.removeEventListener('hashchange', onHash)
      events.forEach((ev) => window.removeEventListener(ev, markTouched))
    }
  }, [focusSection])

  return (
    <>
      <Navbar ids={SECTION_IDS} active={active} onNavigate={navigate} />
      <main>
        <Home onNavigate={navigate} />
        <Skills />
        <Projects />
        <Experience />
        <Certificates />
        <Education />
        <Contact />
        <Gallery />
      </main>
      <Footer />
      <BackToTop onNavigate={navigate} />
    </>
  )
}
