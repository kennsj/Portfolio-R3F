import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import SplitText from "gsap/SplitText"
import { useGSAP } from "@gsap/react"
import styles from "./Header.module.scss"
import { useEffect, useRef, useState } from "react"
import { useHeroIntro } from "../../../hooks/HeroIntroContext"
import { useI18n } from "../../../hooks/useI18n"
import { gsapScrollToHashIdWhenReady } from "../../../utils/gsapScroll"
import { getKpLabel, useKpIndex } from "../../../hooks/useKpIndex"
import { deterministicCharacterOrder } from "../../../hooks/use-character-reveal"
import AnimatedButton from "../../UI/AnimatedButton/AnimatedButton"

gsap.registerPlugin(ScrollTrigger, SplitText)

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
	const [heroIntroStarted, setHeroIntroStarted] = useState(false)
	const headerRef = useRef<HTMLElement>(null)
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
		let timeline: gsap.core.Timeline | null = null
		let titleSplit: SplitText | null = null

		document.fonts.ready.then(() => {
			if (cancelled || !header.isConnected) return
			const canvas = document.querySelector<HTMLElement>("#canvas")
			const curtain = document.querySelector<HTMLElement>(".home-intro-curtain")
			const supporting = header.querySelectorAll<HTMLElement>(
				`.${styles.sideRole}, .${styles.positioning} h2, .${styles.positioning} p, .${styles.projectsButton}, .${styles.environment} > div`,
			)
			const supportingLines = header.querySelectorAll<HTMLElement>(`.${styles.heroRule}`)
			const title = h1Ref.current
			const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

			timeline = gsap.timeline()
			if (!reducedMotion) {
				gsap.set(supporting, { autoAlpha: 0, filter: "blur(10px)" })
				gsap.set(supportingLines, { autoAlpha: 0, scaleX: 0, filter: "blur(6px)" })
			}
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
			timeline.call(() => setHeroIntroStarted(true), [], reducedMotion ? 0 : 0.3)
			if (title && !reducedMotion) {
				try {
					titleSplit = SplitText.create(title, { type: "words,chars" })
					gsap.set(titleSplit.chars, { autoAlpha: 0, filter: "blur(12px)" })
					const characterOrder = deterministicCharacterOrder(titleSplit.chars.length)
					const characterRank = new Map(characterOrder.map((characterIndex, rank) => [characterIndex, rank]))

					timeline.fromTo(titleSplit.chars, {
						autoAlpha: 0,
						filter: "blur(12px)",
					}, {
						autoAlpha: 1,
						filter: "blur(0px)",
						duration: .8,
						stagger: (characterIndex) => (characterRank.get(characterIndex) ?? characterIndex) * .022,
						ease: "power2.out",
					}, .35)
				} catch {
					gsap.set(title, { autoAlpha: 1, filter: "none" })
				}
			}
			const supportingStart = reducedMotion ? 0.15 : 1.05
			timeline.call(markHomeHeroIntroComplete, [], supportingStart)
			if (!reducedMotion) {
				timeline.fromTo(supporting, {
					autoAlpha: 0,
					filter: "blur(10px)",
				}, {
					autoAlpha: 1,
					filter: "blur(0px)",
					duration: .7,
					ease: "power2.out",
				}, supportingStart)
				timeline.fromTo(supportingLines, {
					autoAlpha: 0,
					scaleX: 0,
					filter: "blur(6px)",
				}, {
					autoAlpha: 1,
					scaleX: 1,
					filter: "blur(0px)",
					duration: .8,
					ease: "power2.out",
				}, supportingStart)
			}
		})

		return () => {
			cancelled = true
			timeline?.kill()
			titleSplit?.revert()
		}
	}, { scope: headerRef, dependencies: [signalNavIntroAfterHero, homeHeroSceneReady] })

	useGSAP(() => {
		const header = headerRef.current
		if (!header || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
		const copy = header.querySelector<HTMLElement>("h2")
		if (!copy) return
		gsap.to(copy, {
			yPercent: -28,
			autoAlpha: 0,
			ease: "none",
			scrollTrigger: { trigger: header, start: "top top", end: "bottom top", scrub: .7 },
		})
	}, { scope: headerRef })

	return (
		<header
			ref={headerRef}
			className={`${styles.header} ${signalNavIntroAfterHero && !heroIntroStarted ? styles.heroPending : ""}`}
			style={signalNavIntroAfterHero && !heroIntroStarted ? { opacity: 0, visibility: "hidden" } : undefined}
		>
			<div className={styles.heroBody}>
				<div className={styles.heroTitle}>
					<h1 ref={h1Ref}>
						<span className={styles.firstName} data-hero-line>Kenneth</span>
						<span className={styles.lastName} data-hero-line>Jørgensen</span>
					</h1>
				</div>
				<div className={styles.positioning}>
					<span className={styles.heroRule} aria-hidden="true" />
					<span className={styles.sideRole}>{locale === "nb" ? <>Designer<br />+ utvikler</> : <>Designer<br />+ developer</>}</span>
					<h2 ref={h2Ref}>{t.headerHeroTitle}</h2>
					<p ref={pRef}>{locale === "nb" ? "Jeg hjelper virksomheter og kreative team med visuell retning, nettsider og digitale produkter — fra første idé til ferdig frontend." : "I help businesses and creative teams with visual direction, websites, and digital products — from first idea to finished front-end."}</p>
				</div>
			</div>
			<div className={styles.heroFooter}>
				<span className={styles.heroRule} aria-hidden="true" />
				<AnimatedButton
					className={styles.projectsButton}
					label={t.headerProjectsCta}
					onClick={() => gsapScrollToHashIdWhenReady("work")}
					dataScrollDown
					revealDelay={0.85}
					revealDuration={1.2}
				/>
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
