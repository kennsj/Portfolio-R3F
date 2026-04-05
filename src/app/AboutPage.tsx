import TextBlock from "./components/UI/TextBlock/TextBlock"
import AnimatedButton from "./components/UI/AnimatedButton/AnimatedButton"
import { useI18n } from "./hooks/useI18n"
import { usePageTransition } from "./hooks/usePageTransition"

import styles from "./AboutPage.module.scss"

export default function AboutPage() {
	const { t } = useI18n()
	const { transitionTo } = usePageTransition()

	return (
		<div className={styles.page}>
			<header className={styles.hero}>
				<h4 className={styles.eyebrow}>{t.aboutPageEyebrow}</h4>
				<h1 className={styles.title}>{t.aboutPageHeading}</h1>
				<p className={styles.lead}>{t.aboutPageLead}</p>
			</header>

			<section className={styles.body} aria-label={t.aboutPageHeading}>
				<TextBlock textSize='md'>{t.aboutPageIntro}</TextBlock>
				<TextBlock textSize='sm' className={styles.gap}>
					{t.aboutPageBody2}
				</TextBlock>
				<TextBlock textSize='sm' className={styles.gap}>
					{t.aboutPageBody3}
				</TextBlock>
			</section>

			<div className={styles.actions}>
				<AnimatedButton
					label={t.aboutPageCtaHome}
					onClick={() => transitionTo("/")}
					revealDelay={0}
					revealDuration={0.35}
				/>
				<AnimatedButton
					label={t.aboutPageCtaWork}
					onClick={() => transitionTo("/#work")}
					revealDelay={0.08}
					revealDuration={0.35}
				/>
			</div>
		</div>
	)
}
