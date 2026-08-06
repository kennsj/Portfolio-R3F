import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import SplitText from "gsap/SplitText"
import { useI18n } from "../../../hooks/useI18n"
import Aurora from "../Aurora/Aurora"
import styles from "./Contact.module.scss"

gsap.registerPlugin(ScrollTrigger, SplitText)

const Contact = ({ showForecast = false }: { showForecast?: boolean }) => {
	const { t } = useI18n()
	const sectionRef = useRef<HTMLElement>(null)

	useGSAP(() => {
		const section = sectionRef.current
		if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
		const title = section.querySelector<HTMLElement>("h2")
		const email = section.querySelector<HTMLElement>("[data-contact-email]")
		const lines = section.querySelectorAll<HTMLElement>("[data-contact-line]")
		const location = section.querySelector<HTMLElement>("[data-contact-location]")
		const titleSplit = title ? SplitText.create(title, { type: "lines", mask: "lines" }) : null
		const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: "top 72%", once: true } })
		tl.fromTo(location, { yPercent: 110, rotationX: -28, autoAlpha: 0, transformPerspective: 900 }, { yPercent: 0, rotationX: 0, autoAlpha: 1, duration: 0.8, ease: "shiftReveal" })
			.fromTo(titleSplit?.lines ?? [], { yPercent: 110, rotationX: -78, skewY: 3, transformPerspective: 1100, transformOrigin: "50% 100%" }, { yPercent: 0, rotationX: 0, skewY: 0, duration: 1.2, stagger: 0.1, ease: "shiftTitle" }, "-=0.35")
			.fromTo(email, { yPercent: 110, rotationX: -30, transformPerspective: 900, transformOrigin: "50% 100%" }, { yPercent: 0, rotationX: 0, duration: 0.8, ease: "shiftReveal" }, "-=0.5")
			.fromTo(lines, { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 2, stagger: 0.1, ease: "shiftRule" }, "-=0.45")
		return () => titleSplit?.revert()
	}, { scope: sectionRef })

	return (
		<section
			ref={sectionRef}
			id='contact'
			className={styles.section}
			aria-label={t.navContact}
			data-aurora-state
			data-aurora-presence='1.16'
			data-aurora-color='#a8f3c3'
		>
			{showForecast && (
				<div className={styles.forecast}>
					<Aurora />
				</div>
			)}

			<div className={styles.location} data-contact-location>
				<span>{t.contactBased}</span>
				<span>{t.contactWorldwide}</span>
			</div>

			<div className={styles.main}>
				<p>{t.contactPrompt}</p>
				<h2>{t.contactTitleLineOne}<br />{t.contactTitleLineTwo}</h2>
				<a data-contact-email href='mailto:hei@kennethjorgensen.no'>hei@kennethjorgensen.no</a>
			</div>

			<div className={styles.contactGrid}>
				<div data-contact-line>
					<span>{t.contactAvailableLabel}</span>
					<p>{t.contactAvailableCopy}</p>
				</div>
				<div data-contact-line>
					<span>{t.contactFindLabel}</span>
					<p><a href='https://www.linkedin.com/in/kennethstrandjorgensen/' target='_blank' rel='noreferrer'>LinkedIn</a> / <a href='https://github.com/kennsj' target='_blank' rel='noreferrer'>GitHub</a></p>
				</div>
			</div>
		</section>
	)
}

export default Contact
