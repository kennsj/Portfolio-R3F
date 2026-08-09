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
