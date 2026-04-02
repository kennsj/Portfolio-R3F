import gsap from "gsap"
import SplitText from "gsap/SplitText"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import styles from "./Header.module.scss"
import { useRef } from "react"
import AnimatedButton from "../../UI/AnimatedButton/AnimatedButton"
import { useHeroIntro } from "../../../hooks/HeroIntroContext"
import { useI18n } from "../../../hooks/useI18n"

gsap.registerPlugin(SplitText, ScrollTrigger)

const Header = ({
	signalNavIntroAfterHero = false,
}: {
	signalNavIntroAfterHero?: boolean
}) => {
	const { markHomeHeroIntroComplete } = useHeroIntro()
	const { t } = useI18n()
	const headerRef = useRef<HTMLElement>(null)
	const h4Ref = useRef<HTMLHeadingElement>(null)
	const h1Ref = useRef<HTMLHeadingElement>(null)
	const pRef = useRef<HTMLParagraphElement>(null)

	useGSAP(
		() => {
			const header = headerRef.current
			if (!header) return

			gsap.set(header, { autoAlpha: 0 })

			const splitInstances: SplitText[] = []
			let cancelled = false

			document.fonts.ready.then(() => {
				if (cancelled || !header.isConnected) return

				const h4 = h4Ref.current
				const h1 = h1Ref.current
				const p = pRef.current

				const charFrom = {
					autoAlpha: 0,
					filter: "blur(25px)",
					yPercent: 20,
				}

				let splitH4: SplitText | undefined
				let splitH1: SplitText | undefined
				let splitP: SplitText | undefined

				if (h4) {
					splitH4 = SplitText.create(h4, {
						type: "chars",
					})
					splitInstances.push(splitH4)
				}

				if (h1) {
					splitH1 = SplitText.create(h1, {
						type: "lines, chars",
					})
					splitInstances.push(splitH1)
				}

				if (p) {
					splitP = SplitText.create(p, {
						type: "chars",
					})
					splitInstances.push(splitP)
				}

				// Header shell visible; char motion is owned by the timeline only.
				// (Pre-setting charFrom + a ScrollTrigger that never advances left text stuck hidden.)
				gsap.set(header, { autoAlpha: 1 })

				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: header,
						// Align trigger top with viewport top on first paint so the intro can run at scrollY === 0.
						start: "top top",
						toggleActions: "play none none none",
					},
					defaults: {
						duration: 1.2,
						stagger: 0.01,
						yPercent: 20,
						ease: "power2.out",
					},
					onComplete: () => {
						if (signalNavIntroAfterHero) {
							markHomeHeroIntroComplete()
						}
					},
				})

				if (splitH4) {
					tl.from(splitH4.chars, { ...charFrom })
				}

				if (splitH1) {
					tl.from(
						splitH1.chars,
						{ ...charFrom },
						splitH4 ? "<+0.5" : 0,
					)
				}

				if (splitP) {
					tl.from(splitP.chars, { ...charFrom }, "<+0.2")
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
			<h4 ref={h4Ref}>
				{t.headerTagline}
			</h4>
			<h1 ref={h1Ref}>
				{t.headerTitleDesignedPrefix}
				<span className='highlight'>{t.headerDarkWord}</span>.
				<br />
				{t.headerTitleBuiltPrefix}
				<span className='highlight'>{t.headerLightWord}</span>.
			</h1>
			<p ref={pRef}>{t.headerLocation}</p>
			<AnimatedButton
				label={t.headerExplore}
				onClick={() =>
					document.querySelector("#about")?.scrollIntoView({
						behavior: "smooth",
						block: "start",
					})
				}
				dataScrollDown
				ariaDescribedBy='scroll-down-desc'
				revealDelay={0.85}
				revealDuration={1.2}
			/>
		</header>
	)
}

export default Header
