import { useSyncExternalStore } from 'react'
import en from './en.json'
import la from './la.json'

export type Lang = 'la' | 'en'

/**
 * Content from /data/*.json can be written two ways:
 *   "plain string"                       -> same text in every language
 *   { "la": "ລາວ", "en": "English" }     -> per-language text
 * A missing language falls back to Lao, then English.
 */
export type Text = string | { la?: string; en?: string }

const dict: Record<Lang, Record<string, string>> = { la, en }
const FALLBACK: Lang = 'la'

function readSaved(): Lang {
  try {
    return localStorage.getItem('lang') === 'en' ? 'en' : 'la'
  } catch {
    return FALLBACK
  }
}

let current: Lang = readSaved()
const listeners = new Set<() => void>()

export function setLang(next: Lang) {
  if (next === current) return
  current = next
  try {
    localStorage.setItem('lang', next)
  } catch {
    /* storage unavailable, ignore */
  }
  document.documentElement.lang = next === 'en' ? 'en' : 'lo'
  listeners.forEach((fn) => fn())
}

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function useI18n() {
  const lang = useSyncExternalStore(subscribe, () => current)

  /** Interface text, with optional {placeholders}. */
  const t = (key: string, vars?: Record<string, string | number>) => {
    let s = dict[lang][key] ?? dict[FALLBACK][key] ?? key
    if (vars) for (const k in vars) s = s.replaceAll(`{${k}}`, String(vars[k]))
    return s
  }

  /** Portfolio content from JSON. */
  const tx = (v?: Text) => {
    if (!v) return ''
    if (typeof v === 'string') return v
    return v[lang] ?? v[FALLBACK] ?? v.en ?? ''
  }

  return { lang, t, tx, setLang }
}
