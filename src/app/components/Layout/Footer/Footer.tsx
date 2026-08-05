import { usePageTransition } from "@/app/hooks/usePageTransition"
import { useI18n } from "@/app/hooks/useI18n"
import styles from "./Footer.module.scss"

const Footer = () => {
	const { transitionTo } = usePageTransition()
	const { locale, setLocale, t } = useI18n()

	const goTo = (href: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault()
		transitionTo(href)
	}

	return (
		<footer id='footer' className={styles.footer}>
			<div className={styles.inner}>
				<div className={styles.signature}>
					<span>KJ / 67°17′N</span>
					<p>{t.footerStatement}</p>
				</div>
				<div className={styles.availability}><i aria-hidden='true' /><span>{t.footerAvailability}</span></div>
				<nav aria-label={t.footerNavigationLabel}>
					<a href='/' onClick={goTo('/')}>{t.footerHome}</a>
					<a href='/#work' onClick={goTo('/#work')}>{t.footerWork}</a>
					<a href='/about' onClick={goTo('/about')}>{t.footerAbout}</a>
					<a href='/#contact' onClick={goTo('/#contact')}>{t.footerContact}</a>
				</nav>
				<div className={styles.utility}>
					<p>© {new Date().getFullYear()} Kenneth Jørgensen</p>
					<div className={styles.languages} aria-label={t.languageSwitchLabel}>
						<button type='button' className={locale === 'nb' ? styles.active : ''} onClick={() => setLocale('nb')} lang='nb' aria-pressed={locale === 'nb'}>NO</button>
						<span>/</span>
						<button type='button' className={locale === 'en' ? styles.active : ''} onClick={() => setLocale('en')} lang='en' aria-pressed={locale === 'en'}>EN</button>
					</div>
					<a className={styles.top} href='#top'>{t.footerBackToTop} ↑</a>
				</div>
			</div>
		</footer>
	)
}

export default Footer
