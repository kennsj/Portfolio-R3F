import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import SplitText from "gsap/SplitText"
import { useI18n } from "../../../hooks/useI18n"
import styles from "./Expertise.module.scss"

gsap.registerPlugin(ScrollTrigger, SplitText)

const Expertise = () => {
	const { locale } = useI18n()
	const sectionRef = useRef<HTMLElement>(null)
	const disciplines = ["Digital design", "Product design", "UI / UX", "Art direction", "Interaction", "Frontend", "Creative development", "Ecommerce", "WebGL", "Prototyping"]
	const fields = locale === "nb"
		? ["Reiseliv", "Arkitektur", "Kultur", "Mat", "Teknologi", "Merkevarer", "Tjenester"]
		: ["Hospitality", "Architecture", "Culture", "Food", "Technology", "Brands", "Services"]

	useGSAP(() => {
		const section = sectionRef.current
		if (!section) return
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
		if (reduced) return

		const title = section.querySelector<HTMLElement>("[data-field-title]")
		const about = section.querySelector<HTMLElement>("[data-field-about]")
		const rule = section.querySelector<HTMLElement>("[data-field-rule]")
		const rows = section.querySelectorAll<HTMLElement>("[data-field-row]")
		const titleSplit = title ? SplitText.create(title, { type: "lines", mask: "lines" }) : null
		const timeline = gsap.timeline({
			scrollTrigger: { trigger: section, start: "top 72%", once: true },
			defaults: { ease: "shiftReveal" },
		})

		timeline
			.fromTo(titleSplit?.lines ?? [], { yPercent: 110, rotationX: -38, skewY: 2.5, transformPerspective: 900, transformOrigin: "50% 100%" }, { yPercent: 0, rotationX: 0, skewY: 0, duration: 0.8, stagger: 0.1 })
			.fromTo(about, { yPercent: 110, rotationX: -28, transformPerspective: 900, transformOrigin: "50% 100%" }, { yPercent: 0, rotationX: 0, duration: 0.8 }, "-=0.3")
			.fromTo(rule, { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 2, ease: "shiftRule" }, "-=0.5")
			.fromTo(rows, { yPercent: 20, rotationX: -20, transformPerspective: 1000 }, { yPercent: 0, rotationX: 0, duration: 0.8, stagger: 0.1 }, "-=1.3")
		return () => titleSplit?.revert()
	}, { scope: sectionRef })

	const renderTrack = (items: string[], reverse = false) => (
		<div className={`${styles.track} ${reverse ? styles.trackReverse : ""}`}>
			{[0, 1].map((copy) => (
				<div className={styles.group} aria-hidden={copy === 1} key={copy}>
					{items.map((item) => <span key={`${copy}-${item}`}>{item}</span>)}
				</div>
			))}
		</div>
	)

	return (
		<section
			ref={sectionRef}
			className={styles.section}
			aria-label={locale === "nb" ? "Fagfelt og kapabiliteter" : "Territory and fields"}
			data-aurora-state
			data-aurora-presence='0.92'
			data-aurora-color='#8ed7ad'
		>
			<div className={styles.stage}>
				<h2 data-field-title>{locale === "nb" ? <>Fagfelt<br />og kapabiliteter</> : <>My territory<br />and fields</>}</h2>
				<a href='#about' data-field-about>{locale === "nb" ? "Om meg" : "About me"}</a>
			</div>

			<div className={styles.rule} data-field-rule />

			<div className={styles.rows}>
				<div className={styles.carousel} data-field-row aria-label={disciplines.join(", ")}>
					{renderTrack(disciplines)}
				</div>
				<div className={`${styles.carousel} ${styles.secondary}`} data-field-row aria-label={fields.join(", ")}>
					{renderTrack(fields, true)}
				</div>
			</div>
		</section>
	)
}

export default Expertise
