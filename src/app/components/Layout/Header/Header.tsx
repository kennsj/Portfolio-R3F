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

gsap.registerPlugin(SplitText, ScrollTrigger)

const Header = ({
	signalNavIntroAfterHero = false,
}: {
	signalNavIntroAfterHero?: boolean
}) => {
	const { markHomeHeroIntroComplete } = useHeroIntro()
	const { locale } = useI18n()
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

	useGSAP(
		() => {
			const header = headerRef.current
			if (!header) return
			const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
			if (reducedMotion) {
				gsap.set(header, { autoAlpha: 1 })
				if (signalNavIntroAfterHero) markHomeHeroIntroComplete()
				return
			}

			// Prepare the complete hero before the browser paints it. This avoids
			// showing the finished layout briefly before SplitText takes ownership.
			gsap.set(header, { autoAlpha: 0 })

			const splitInstances: SplitText[] = []
			let cancelled = false

			const fontReadyFallback = new Promise<void>((resolve) => {
				window.setTimeout(resolve, 900)
			})

			Promise.race([document.fonts.ready, fontReadyFallback]).then(() => {
				if (cancelled || !header.isConnected) return

				const h4 = h4Ref.current
				const h1 = h1Ref.current
				const h2 = h2Ref.current
				const p = pRef.current

				const supportingFrom = {
					autoAlpha: 0,
					yPercent: 110,
					rotationX: -28,
					transformPerspective: 900,
					transformOrigin: "50% 100%",
				}

				let splitH4: SplitText | undefined
				let splitH2: SplitText | undefined
				let splitP: SplitText | undefined

				if (h4) {
					splitH4 = SplitText.create(h4, {
						type: "lines",
						mask: "lines",
					})
					splitInstances.push(splitH4)
				}

				const heroLines = h1?.querySelectorAll<HTMLElement>("[data-hero-line]")

				if (h2) {
					splitH2 = SplitText.create(h2, { type: "lines", mask: "lines" })
					splitInstances.push(splitH2)
				}

				if (p) {
					splitP = SplitText.create(p, {
						type: "lines",
						mask: "lines",
					})
					splitInstances.push(splitP)
				}

				gsap.set(header, { autoAlpha: 1 })

				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: header,
						// Align trigger top with viewport top on first paint so the intro can run at scrollY === 0.
						start: "top top",
						toggleActions: "play none none none",
					},
					defaults: { ease: "shiftReveal" },
					onComplete: () => {
						if (signalNavIntroAfterHero) {
							markHomeHeroIntroComplete()
						}
					},
				})

				if (splitH4) {
					tl.from(splitH4.lines, { ...supportingFrom, duration: 0.8, stagger: 0.1 })
				}

				if (heroLines?.length) {
					tl.fromTo(
						heroLines,
						{ autoAlpha: 1, yPercent: 110, rotationX: -72, skewY: 3, clipPath: "inset(0 0 100% 0)", transformPerspective: 1100, transformOrigin: "50% 100%" },
						{ autoAlpha: 1, yPercent: 0, rotationX: 0, skewY: 0, clipPath: "inset(0 0 0% 0)", transformPerspective: 1100, transformOrigin: "50% 100%", duration: 1.2, stagger: 0.1, ease: "shiftTitle" },
						splitH4 ? "<+0.22" : 0,
					)
				}

				if (splitH2) {
					tl.from(splitH2.lines, { autoAlpha: 1, yPercent: 110, rotationX: -34, skewY: 2, transformPerspective: 900, transformOrigin: "50% 100%", duration: 0.8, stagger: 0.1 }, "<+0.12")
				}

				if (splitP) {
					tl.from(splitP.lines, { ...supportingFrom, duration: 0.8, stagger: 0.1 }, "<+0.08")
				}

				ScrollTrigger.refresh()

				requestAnimationFrame(() => {
					if (cancelled || !header.isConnected) return
					const st = tl.scrollTrigger
					if (!st || tl.progress() > 0) return
					const rect = header.getBoundingClientRect()
					const inView =
						rect.top < window.innerHeight && rect.bottom > 0
					if (inView) tl.play(0)
				})
			})

			return () => {
				cancelled = true
				splitInstances.splice(0).forEach((s) => s.revert())
			}
		},
		{ scope: headerRef, dependencies: [signalNavIntroAfterHero] },
	)

	return (
		<header ref={headerRef} className={styles.header}>
			<div className={styles.introMeta}>
				<h4 ref={h4Ref}>{locale === "nb" ? "Designer + frontendutvikler" : "Designer + frontend developer"}</h4>
				<p ref={pRef}>{locale === "nb" ? "Bodø / Nord-Norge" : "Bodø / Northern Norway"}</p>
			</div>
			<div className={styles.heroTitle}>
				<h1 ref={h1Ref}>
					<span className={styles.firstName} data-hero-line>Kenneth</span>
					<span className={styles.lastName} data-hero-line>Jørgensen</span>
					<span className={styles.coordinate} data-hero-line>67° N</span>
				</h1>
				<span className={styles.auroraLabel} aria-hidden='true'>Aurora borealis / Bodø</span>
			</div>
			<h2 ref={h2Ref}>
				{locale === "nb"
					? "Uavhengig designer og utvikler fra Bodø — tilgjengelig for ambisiøse prosjekter og kreative team."
					: "Independent designer and developer in Bodø — available for ambitious projects and creative teams."}
			</h2>
			<div className={styles.heroFooter}>
				<button className={styles.projectsLink} type='button' onClick={() => gsapScrollToHashIdWhenReady("work")}>
					{locale === "nb" ? "Prosjekter" : "Projects"}
				</button>
				<div className={styles.environment}>
					<div><span>{locale === "nb" ? "Lokalt" : "Local"}</span><strong>{localTime}</strong></div>
					<div><span>KP Index</span><strong>{kp.toFixed(1)}</strong></div>
					<div><span>Aurora</span><strong>{kpLabel}</strong></div>
					<div><span>{locale === "nb" ? "Status" : "Status"}</span><strong>{locale === "nb" ? "Tilgjengelig" : "Available"}</strong></div>
				</div>
			</div>
		</header>
	)
}

export default Header
