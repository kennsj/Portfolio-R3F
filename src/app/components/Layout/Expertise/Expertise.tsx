import { useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import SplitText from "gsap/SplitText"
import { useI18n } from "../../../hooks/useI18n"
import styles from "./Expertise.module.scss"
import { usePageTransition } from "../../../hooks/usePageTransition"

gsap.registerPlugin(ScrollTrigger, SplitText)

type FocusItem = { label: string; group: "capabilities" | "fields"; index: number }

const disciplines = ["Digital design", "Product design", "UI / UX", "Art direction", "Interaction", "Frontend", "Creative development", "Ecommerce", "WebGL", "Prototyping"]

const Expertise = () => {
	const { locale } = useI18n()
	const { transitionTo } = usePageTransition()
	const sectionRef = useRef<HTMLElement>(null)
	const [active, setActive] = useState<FocusItem>({ label: disciplines[0], group: "capabilities", index: 0 })
	const fields = locale === "nb"
		? ["Reiseliv", "Arkitektur", "Kultur", "Mat", "Teknologi", "Merkevarer", "Tjenester"]
		: ["Hospitality", "Architecture", "Culture", "Food", "Technology", "Brands", "Services"]

	useGSAP(() => {
		const section = sectionRef.current
		if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
		const split = SplitText.create(section.querySelector("[data-field-title]"), { type: "lines", mask: "lines" })
		gsap.timeline({ scrollTrigger: { trigger: section, start: "top 76%", once: true }, defaults: { ease: "shiftReveal" } })
			.from(split.lines, { yPercent: 110, rotationX: -28, duration: .8, stagger: .08 })
			.from(section.querySelectorAll("[data-field-index]"), { y: 24, autoAlpha: 0, duration: .55, stagger: .035 }, "-=.4")
		return () => split.revert()
	}, { scope: sectionRef })

	const focus = (label: string, group: FocusItem["group"], index: number) => setActive({ label, group, index })
	const copy = active.group === "capabilities"
		? (locale === "nb" ? "Hvordan jeg former og bygger opplevelser." : "How I shape and build experiences.")
		: (locale === "nb" ? "Verdener jeg liker å gi form til." : "Worlds I like to give form to.")

	return (
		<section ref={sectionRef} className={styles.section} aria-label={locale === "nb" ? "Fagfelt og områder" : "Capabilities and fields"} data-aurora-state data-aurora-presence='0.92' data-aurora-color='#8ed7ad'>
			<header className={styles.header}>
				<span className={styles.eyebrow}>02 / {locale === "nb" ? "Fagfelt og områder" : "Capabilities and fields"}</span>
				<a href='/about' onClick={(event) => { event.preventDefault(); transitionTo('/about') }} data-field-about>{locale === "nb" ? "Om meg" : "About me"}<i>↗</i></a>
			</header>

			<div className={styles.composition}>
				<div className={styles.stage}>
					<h2 data-field-title>{locale === "nb" ? <>Fagfelt<br /><em>og områder</em></> : <>Capabilities<br /><em>and fields</em></>}</h2>
					<div className={styles.activeWord} aria-live='polite'>
						<span>{active.group === "capabilities" ? "01" : "02"} / {active.group === "capabilities" ? (locale === "nb" ? "Fagfelt" : "Capabilities") : (locale === "nb" ? "Områder" : "Fields")}</span>
						<strong>{active.label}</strong>
						<p>{copy}</p>
					</div>
				</div>

				<div className={styles.indexes}>
					<div className={styles.indexGroup}>
						<div className={styles.groupHead}><span>01</span><strong>{locale === "nb" ? "Fagfelt" : "Capabilities"}</strong></div>
						<ol>{disciplines.map((item, index) => <li key={item} data-field-index><button className={active.label === item ? styles.active : ""} onMouseEnter={() => focus(item, "capabilities", index)} onFocus={() => focus(item, "capabilities", index)}><span>{String(index + 1).padStart(2, "0")}</span>{item}</button></li>)}</ol>
					</div>
					<div className={`${styles.indexGroup} ${styles.fieldGroup}`}>
						<div className={styles.groupHead}><span>02</span><strong>{locale === "nb" ? "Områder" : "Fields"}</strong></div>
						<ol>{fields.map((item, index) => <li key={item} data-field-index><button className={active.label === item ? styles.active : ""} onMouseEnter={() => focus(item, "fields", index)} onFocus={() => focus(item, "fields", index)}><span>{String(index + 1).padStart(2, "0")}</span>{item}</button></li>)}</ol>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Expertise
