import { useLayoutEffect } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useI18n } from "./hooks/useI18n"
import { usePageTransition } from "./hooks/usePageTransition"
import styles from "./styles/AboutPage.module.scss"

gsap.registerPlugin(ScrollTrigger)

export default function AboutPage() {
	const { t } = useI18n()
	const { transitionTo } = usePageTransition()
	useLayoutEffect(() => window.scrollTo(0, 0), [])
	useGSAP(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
		gsap.utils.toArray<HTMLElement>("[data-about-reveal]").forEach((element) => {
			gsap.from(element, { y: 72, autoAlpha: 0, duration: 1, ease: "shiftReveal", scrollTrigger: { trigger: element, start: "top 88%", once: true } })
		})
	})
	const go = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => { event.preventDefault(); transitionTo(href) }

	return (
		<article className={styles.page}>
			<header className={styles.hero}>
				<div className={styles.coordinates}><span>{t.aboutLocation}</span><span>67°17′N / 14°23′E</span></div>
				<h1>Kenneth<br /><span>Jørgensen</span></h1>
				<p>{t.aboutHero}</p>
			</header>

			<section className={styles.portrait} data-about-reveal>
				<figure><img src='/images/kenneth-aurora.jpg' alt={t.aboutPortraitAlt} /></figure>
				<p>{t.aboutPortraitStatement}</p>
			</section>

			<section className={styles.story} data-about-reveal>
				<span>01 / {t.aboutPracticeLabel}</span>
				<div>
					{t.aboutPracticeBody.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
				</div>
			</section>

			<section className={styles.capabilities} data-about-reveal>
				<div className={styles.capabilitiesHead}><span>02 / {t.expertiseCapabilitiesLabel}</span><h2>{t.aboutCapabilitiesTitle}</h2></div>
				<ul>
					{t.aboutCapabilities.map((item, index) => <li key={item}><small>{String(index + 1).padStart(2, "0")}</small><span>{item}</span></li>)}
				</ul>
			</section>

			<section className={styles.now} data-about-reveal>
				<span>03 / {t.aboutNowLabel}</span>
				<p>{t.aboutNowBody}</p>
				<a href='mailto:hei@kennethjorgensen.no'>hei@kennethjorgensen.no <i aria-hidden='true'>↗</i></a>
			</section>

			<a className={styles.workLink} href='/#work' onClick={(event) => go(event, '/#work')}><span>{t.aboutWorkCta}</span><strong>{t.aboutWorkTitle}</strong><i aria-hidden='true'>↗</i></a>
		</article>
	)
}
