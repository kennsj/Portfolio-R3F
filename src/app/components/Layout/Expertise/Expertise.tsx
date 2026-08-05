import { useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import SplitText from "gsap/SplitText"
import { useI18n } from "../../../hooks/useI18n"
import styles from "./Expertise.module.scss"
import { usePageTransition } from "../../../hooks/usePageTransition"

gsap.registerPlugin(ScrollTrigger, SplitText)

const Expertise = () => {
	const { t } = useI18n()
	const { transitionTo } = usePageTransition()
	const sectionRef = useRef<HTMLElement>(null)
	const [activeIndex, setActiveIndex] = useState(0)
	const active = t.expertiseModes[activeIndex] ?? t.expertiseModes[0]

	useGSAP(() => {
		const section = sectionRef.current
		if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
		const title = section.querySelector<HTMLElement>("[data-field-title]")
		if (!title) return
		const split = SplitText.create(title, { type: "lines", mask: "lines" })
		const timeline = gsap.timeline({
			scrollTrigger: { trigger: section, start: "top 76%", once: true },
			defaults: { ease: "shiftReveal" },
		})
		timeline
			.from(split.lines, { yPercent: 110, rotationX: -28, duration: 0.8, stagger: 0.08 })
			.from(section.querySelectorAll("[data-field-index]"), { y: 24, autoAlpha: 0, duration: 0.55, stagger: 0.07 }, "-=.4")
		return () => {
			timeline.scrollTrigger?.kill()
			timeline.kill()
			split.revert()
		}
	}, { scope: sectionRef })

	return (
		<section ref={sectionRef} className={styles.section} aria-label={`${t.expertiseCapabilitiesLabel} / ${t.expertiseFieldsLabel}`} data-aurora-state data-aurora-presence='0.92' data-aurora-color='#8ed7ad'>
			<header className={styles.header}>
				<span className={styles.eyebrow}>02 / {t.expertiseEyebrow}</span>
				<a href='/about' onClick={(event) => { event.preventDefault(); transitionTo('/about') }} data-field-about>{t.expertiseAboutCta}<i aria-hidden='true'>↗</i></a>
			</header>

			<div className={styles.composition}>
				<div className={styles.stage}>
					<h2 data-field-title>{t.expertiseTitleLineOne}<br /><em>{t.expertiseTitleLineTwo}</em></h2>
					<div className={styles.activeWord} aria-live='polite'>
						<span>{active.meta}</span>
						<strong>{active.title}</strong>
						<p>{active.description}</p>
					</div>
				</div>

				<div className={styles.practiceMap}>
					<div className={styles.groupHead}><span>01—04</span><strong>{t.expertiseCapabilitiesLabel}</strong></div>
					<ol>
						{t.expertiseModes.map((mode, index) => (
							<li key={mode.title} data-field-index>
								<button
									type='button'
									className={activeIndex === index ? styles.active : ""}
									onMouseEnter={() => setActiveIndex(index)}
									onFocus={() => setActiveIndex(index)}
									aria-pressed={activeIndex === index}
								>
									<span>{String(index + 1).padStart(2, "0")}</span>
									<strong>{mode.title}</strong>
									<i aria-hidden='true'>↗</i>
								</button>
							</li>
						))}
					</ol>
					<div className={styles.contexts}>
						<span>{t.expertiseFieldsLabel}</span>
						<div>{t.expertiseContexts.map((context) => <em key={context}>{context}</em>)}</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Expertise
