import hero from '../../data/hero.json'
import { useI18n } from '../locale/i18n'
import SocialLinks from './SocialLinks'

export default function Footer() {
  const { t,lang } = useI18n()
  return (
    // snap "end" so the footer is reachable even with mandatory snapping
    <footer className="border-t border-line bg-footer [scroll-snap-align:end]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-6 text-center text-sm text-muted sm:flex-row sm:text-left md:px-8">
        <p>{t('footer.rights', { year: new Date().getFullYear(), name: hero.name[lang] })}</p>
        <SocialLinks label={t('footer.social')} />
      </div>
    </footer>
  )
}
