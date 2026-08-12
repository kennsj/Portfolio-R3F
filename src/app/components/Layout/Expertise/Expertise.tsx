import { useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useI18n } from "../../../hooks/useI18n"
import styles from "./Expertise.module.scss"
import { usePageTransition } from "../../../hooks/usePageTransition"
import ArrowIcon from "../../UI/ArrowIcon/ArrowIcon"

gsap.registerPlugin(ScrollTrigger)

const Expertise = () => {
	const { t } = useI18n()
	const { transitionTo } = usePageTransition()
	const sectionRef = useRef<HTMLElement>(null)
	const [activeIndex, setActiveIndex] = useState(1)
	const activeMode = t.expertiseModes[activeIndex]

	useGSAP(() => {
		const section = sectionRef.current
		if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

		const timeline = gsap.timeline({
			scrollTrigger: { trigger: section, start: "top 74%", once: true },
		})

		timeline
			.from(section.querySelector(`.${styles.lead}`), { autoAlpha: 0, filter: "blur(10px)", duration: 0.65, ease: "power2.out" })
			.from(section.querySelectorAll(`.${styles.discipline}`), { autoAlpha: 0, filter: "blur(10px)", duration: 0.65, stagger: 0.08, ease: "power2.out" }, "-=.2")

		return () => {
			timeline.scrollTrigger?.kill()
			timeline.kill()
		}
	}, { scope: sectionRef })

	return (
		<section
			ref={sectionRef}
			className={styles.section}
			aria-label={t.expertiseEyebrow}
			data-aurora-state
			data-aurora-presence="0.92"
			data-aurora-color="#8ed7ad"
		>
			<header className={styles.header}>
				<span className={styles.eyebrow}>02 / {t.expertiseEyebrow}</span>
				<a href="/about" onClick={(event) => {
					event.preventDefault()
					transitionTo("/about")
				}}>
					{t.expertiseAboutCta}<ArrowIcon />
				</a>
			</header>

			<div className={styles.lead}>
				<span>/ {t.expertiseFieldsLabel}</span>
				<h2>{t.expertiseTitleLineOne}<br />{t.expertiseTitleLineTwo}</h2>
				<p>{t.expertiseIntro}</p>
			</div>

			<ol className={styles.disciplines}>
				{t.expertiseModes.map((mode, index) => (
					<li key={mode.title} className={styles.discipline}>
						<button
							type="button"
							className={activeIndex === index ? styles.active : ""}
							onMouseEnter={() => setActiveIndex(index)}
							onFocus={() => setActiveIndex(index)}
							onClick={() => setActiveIndex(index)}
						>
							<strong>{mode.title}</strong>
							<span>{String(index + 1).padStart(2, "0")}</span>
						</button>
					</li>
				))}
				<li className={styles.activeCopy} aria-live="polite">
					<span>{activeMode.meta}</span>
					<p>{activeMode.description}</p>
				</li>
			</ol>
		</section>
	)
}

export default Expertise
