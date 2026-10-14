// Tiny shared helpers.

/** Resolve a file in /public (works for any Vite `base`). */
export const asset = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, '')

export interface Contact {
  mobile?: string
  email?: string
  facebook?: string
  tiktok?: string
  youtube?: string
  portfolio?: string
}

/** Only accept http(s) URLs for external links. */
export const safeUrl = (u?: string) => (u && /^https?:\/\//i.test(u.trim()) ? u.trim() : '')

/** "+856 (0) 9601 9866" -> "tel:+85696019866" (drops the optional "(0)" trunk digit). */
export const telHref = (mobile: string) => 'tel:' + mobile.replace(/\(0\)/g, '').replace(/[^\d+]/g, '')

import type { CSSProperties } from 'react'

/** Stagger index for entrance animations: style={step(2)} */
export const step = (n: number) => ({ '--i': n }) as CSSProperties
