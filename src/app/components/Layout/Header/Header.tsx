import gsap from "gsap"
import SplitText from "gsap/SplitText"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import styles from "./Header.module.scss"
import { useEffect, useRef, useState } from "react"
import { useHeroIntro } from "../../../hooks/HeroIntroContext"
import { useI18n } from "../../../hooks/useI18n"
import { gsapScrollToHashIdWhenReady } from "../../../utils/gsapScroll"
import { getKpLabel, useKpIndex } from "../../../hooks/useKpIndex"
import { deterministicCharacterOrder } from "../../../hooks/use-character-reveal"

gsap.registerPlugin(SplitText, ScrollTrigger)

const Header = ({
	signalNavIntroAfterHero = false,
}: {
	signalNavIntroAfterHero?: boolean
}) => {
	const { homeHeroSceneReady, markHomeHeroIntroComplete } = useHeroIntro()
	const { locale, t } = useI18n()
	const { data } = useKpIndex()
	const kp = data?.latest ?? 0
	const { label: kpLabel } = getKpLabel(kp, locale)
	const [localTime, setLocalTime] = useState("--:--")
	const headerRef = useRef<HTMLElement>(null)
	const h4Ref = useRef<HTMLHeadingElement>(null)
	const h1Ref = useRef<HTMLHeadingElement>(null)
	const h2Ref = useRef<HTMLHeadingElement>(null)
	const pRef = useRef<HTMLParagraphElement>(null)

	useEffect(() => {
		const update = () => setLocalTime(new Intl.DateTimeFormat(locale === "nb" ? "nb-NO" : "en-GB", {
			hour: "2-digit",
			minute: "2-digit",
			timeZone: "Europe/Oslo",
			hour12: false,
		}).format(new Date()))
		update()
		const timer = window.setInterval(update, 30_000)
		return () => window.clearInterval(timer)
	}, [locale])

	useGSAP(() => {
		const header = headerRef.current
		if (!header || !signalNavIntroAfterHero || !homeHeroSceneReady) return

		let cancelled = false
		let split: SplitText | null = null
		let timeline: gsap.core.Timeline | null = null

		document.fonts.ready.then(() => {
			if (cancelled || !header.isConnected) return
			const canvas = document.querySelector<HTMLElement>("#canvas")
			const curtain = document.querySelector<HTMLElement>(".home-intro-curtain")
			const supporting = header.querySelectorAll<HTMLElement>(
				`.${styles.introMeta}, .${styles.positioning}, .${styles.heroFooter}`,
			)
			const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

			split = h1Ref.current ? SplitText.create(h1Ref.current, { type: "chars" }) : null
			const order = deterministicCharacterOrder(split?.chars.length ?? 0)
			const rank = new Map(order.map((characterIndex, position) => [characterIndex, position]))

			gsap.set(header, { autoAlpha: 1 })
			gsap.set(supporting, { autoAlpha: 0 })
			if (split) gsap.set(split.chars, { autoAlpha: 0, filter: reducedMotion ? "blur(0px)" : "blur(12px)" })

			timeline = gsap.timeline()
			if (canvas) {
				timeline.fromTo(
					canvas,
					{ autoAlpha: 0, filter: reducedMotion ? "brightness(1)" : "brightness(0.12)", scale: reducedMotion ? 1 : 1.03 },
					{ autoAlpha: 1, filter: "brightness(1)", scale: 1, duration: reducedMotion ? 0.2 : 1.8, ease: "power3.out" },
					0,
				)
			}
			if (curtain) {
				timeline.to(curtain, { autoAlpha: 0, duration: reducedMotion ? 0.2 : 1.5, ease: "power2.out" }, reducedMotion ? 0 : 0.15)
			}
			if (split) {
				timeline.to(split.chars, {
					autoAlpha: 1,
					filter: "blur(0px)",
					duration: reducedMotion ? 0.16 : 0.8,
					ease: "power2.out",
					stagger: reducedMotion ? 0 : (index) => (rank.get(index) ?? index) * 0.022,
				}, reducedMotion ? 0.1 : 0.9)
			}
			const supportingStart = reducedMotion ? 0.15 : 1.35
			timeline.call(markHomeHeroIntroComplete, [], supportingStart)
			timeline.to(supporting, { autoAlpha: 1, duration: reducedMotion ? 0.16 : 0.65, stagger: reducedMotion ? 0 : 0.08, ease: "power2.out" }, supportingStart)
		})

		return () => {
			cancelled = true
			timeline?.kill()
			split?.revert()
		}
	}, { scope: headerRef, dependencies: [signalNavIntroAfterHero, homeHeroSceneReady] })

	useGSAP(() => {
		const header = headerRef.current
		if (!header || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
		const title = header.querySelector<HTMLElement>(`.${styles.heroTitle}`)
		const copy = header.querySelector<HTMLElement>("h2")
		if (!title) return
		gsap.timeline({ scrollTrigger: { trigger: header, start: "top top", end: "bottom top", scrub: .7 } })
			.to(title, { yPercent: -10, scale: .94, transformOrigin: "50% 60%", filter: "blur(5px)", ease: "none" }, 0)
			.to(copy, { yPercent: -28, autoAlpha: 0, ease: "none" }, 0)
	}, { scope: headerRef })

	return (
		<header ref={headerRef} className={styles.header}>
			<div className={styles.introMeta}>
				<h4 ref={h4Ref}>{locale === "nb" ? "Design + utvikling" : "Design + development"}</h4>
				<span>Bodø / 67°17′N</span>
			</div>
			<div className={styles.heroBody}>
				<div className={styles.heroTitle}>
					<h1 ref={h1Ref}>
						<span className={styles.firstName} data-hero-line>Kenneth</span>
						<span className={styles.lastName} data-hero-line>Jørgensen</span>
					</h1>
				</div>
				<div className={styles.positioning}>
					<span className={styles.sideRole}>{locale === "nb" ? <>Designer<br />+ utvikler</> : <>Designer<br />+ developer</>}</span>
					<h2 ref={h2Ref}>{t.headerHeroTitle}</h2>
					<p ref={pRef}>{locale === "nb" ? "Jeg hjelper virksomheter og kreative team med visuell retning, nettsider og digitale produkter — fra første idé til ferdig frontend." : "I help businesses and creative teams with visual direction, websites, and digital products — from first idea to finished front-end."}</p>
				</div>
			</div>
			<div className={styles.heroFooter}>
				<button className={styles.projectsLink} type='button' onClick={() => gsapScrollToHashIdWhenReady("work")}>
					{t.headerProjectsCta}
				</button>
				<div className={styles.environment}>
					<div><span>{locale === "nb" ? "Lokal tid" : "Local time"}</span><strong>{localTime}</strong></div>
					<div><span>KP Index</span><strong>{kp.toFixed(1)}</strong></div>
					<div><span>{locale === "nb" ? "Nordlys" : "Aurora"}</span><strong>{kpLabel}</strong></div>
				</div>
			</div>
		</header>
	)
}

export default Header
