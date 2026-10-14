import contactData from '../../data/contact.json'
import type { Contact } from '../lib'
import { safeUrl } from '../lib'
import { contactIcons } from './Icons'
import { useI18n } from '../locale/i18n'

const keys = ['facebook', 'tiktok', 'youtube', 'portfolio'] as const

/** Round icon links for whichever social URLs are filled in data/contact.json. Renders nothing if none. */
export default function SocialLinks({ label }: { label?: string }) {
  const { t } = useI18n()
  const contact = contactData as Contact
  const links = keys.map((k) => ({ k, url: safeUrl(contact[k]) })).filter((l) => l.url)
  if (!links.length) return null
  return (
    <ul className="flex flex-wrap gap-2" aria-label={label}>
      {links.map(({ k, url }) => {
        const Icon = contactIcons[k]
        return (
          <li key={k}>
            <a className="icon-btn" href={url} target="_blank" rel="noopener noreferrer" aria-label={t(`contact.${k}`)}>
              <Icon />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
