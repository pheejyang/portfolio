import type { ReactNode, SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>

// Small inline icon set (stroke icons + three filled brand icons), so no icon library is needed.
const stroke = (children: ReactNode) =>
  function Icon(props: P) {
    return (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        {children}
      </svg>
    )
  }

const fill = (d: string) =>
  function Icon(props: P) {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" {...props}>
        <path d={d} />
      </svg>
    )
  }

export const IconPhone = stroke(
  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />,
)
export const IconMail = stroke(
  <>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </>,
)
export const IconGlobe = stroke(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
  </>,
)
export const IconSun = stroke(
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </>,
)
export const IconMoon = stroke(<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />)
export const IconMenu = stroke(<path d="M4 6h16M4 12h16M4 18h16" />)
export const IconClose = stroke(<path d="M18 6 6 18M6 6l12 12" />)
export const IconChevronDown = stroke(<path d="m6 9 6 6 6-6" />)
export const IconChevronLeft = stroke(<path d="m15 18-6-6 6-6" />)
export const IconChevronRight = stroke(<path d="m9 18 6-6-6-6" />)
export const IconArrowUp = stroke(<path d="M12 19V5M5 12l7-7 7 7" />)
export const IconDownload = stroke(<path d="M12 3v12m0 0-4-4m4 4 4-4M4 21h16" />)
export const IconCode = stroke(<path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />)
export const IconExternal = stroke(<path d="M15 3h6v6M10 14 21 3M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />)
export const IconAward = stroke(
  <>
    <circle cx="12" cy="8" r="6" />
    <path d="m8.2 13.1-1.2 8.9 5-3 5 3-1.2-8.9" />
  </>,
)
export const IconPin = stroke(
  <>
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </>,
)

export const IconFacebook = fill(
  'M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z',
)
export const IconTikTok = fill(
  'M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.6 2.6 0 0 1-2.6-2.6 2.6 2.6 0 0 1 3.37-2.48V9.66a5.7 5.7 0 0 0-.78-.05 5.7 5.7 0 0 0-5.7 5.7 5.7 5.7 0 0 0 5.7 5.7 5.7 5.7 0 0 0 5.7-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.3 4.3 0 0 1-3.25-1.48z',
)
export const IconYouTube = fill(
  'M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z',
)

export const contactIcons = {
  mobile: IconPhone,
  email: IconMail,
  facebook: IconFacebook,
  tiktok: IconTikTok,
  youtube: IconYouTube,
  portfolio: IconGlobe,
} as const
