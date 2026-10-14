import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../locale/i18n'
import { IconArrowUp } from './Icons'

export default function BackToTop({ onNavigate }: { onNavigate: (id: string) => void }) {
  const { t } = useI18n()
  const [show, setShow] = useState(false)
  const marker = useRef<HTMLDivElement>(null)

  // The marker covers the top half of the first screen; once it scrolls out of view the button appears.
  useEffect(() => {
    const el = marker.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <>
      <div ref={marker} aria-hidden="true" className="pointer-events-none absolute top-0 left-0 h-[50svh] w-px" />
      <button
        type="button"
        onClick={() => onNavigate('home')}
        aria-label={t('backToTop')}
        title={t('backToTop')}
        tabIndex={show ? 0 : -1}
        aria-hidden={!show}
        className={
          'fixed right-4 bottom-4 z-30 grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-accent text-accent-fg shadow-card transition-[opacity,transform] duration-300 hover:brightness-110 md:right-6 md:bottom-6 ' +
          (show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0')
        }
      >
        <IconArrowUp />
      </button>
    </>
  )
}
