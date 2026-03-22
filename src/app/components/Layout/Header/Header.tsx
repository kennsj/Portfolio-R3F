import gsap from "gsap"
import SplitText from "gsap/SplitText"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import styles from "./Header.module.scss"
import { useRef } from "react"
import AnimatedButton from "../../UI/AnimatedButton/AnimatedButton"
import { useHeroIntro } from "../../../hooks/HeroIntroContext"

gsap.registerPlugin(SplitText, ScrollTrigger)

const Header = ({
	signalNavIntroAfterHero = false,
}: {
	signalNavIntroAfterHero?: boolean
}) => {
	const { markHomeHeroIntroComplete } = useHeroIntro()
	const headerRef = useRef<HTMLElement>(null)
	const h4Ref = useRef<HTMLHeadingElement>(null)
	const h1Ref = useRef<HTMLHeadingElement>(null)
	const pRef = useRef<HTMLParagraphElement>(null)

	useGSAP(
		() => {
			const header = headerRef.current
			if (!header) return

			const splitInstances: SplitText[] = []
			let cancelled = false

			document.fonts.ready.then(() => {
				if (cancelled || !header.isConnected) return

				const h4 = h4Ref.current
				const h1 = h1Ref.current
				const p = pRef.current

				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: header,
						start: "top 80%",
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

				const charFrom = {
					opacity: 0,
					filter: "blur(25px)",
					yPercent: 20,
				}

				if (h4) {
					const splitH4 = SplitText.create(h4, {
						type: "chars",
					})
					splitInstances.push(splitH4)
					tl.from(splitH4.chars, { ...charFrom })
				}

				if (h1) {
					const split = SplitText.create(h1, {
						type: "lines, chars",
					})
					splitInstances.push(split)
					tl.from(split.chars, { ...charFrom }, "<+0.5")
				}

				if (p) {
					const splitP = SplitText.create(p, {
						type: "chars",
					})
					splitInstances.push(splitP)
					tl.from(splitP.chars, { ...charFrom }, "<+0.2")
				}
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
			<h4 ref={h4Ref}>Designer. Developer. Occasional gamer.</h4>
			<h1 ref={h1Ref}>
				Designed in the <span className='highlight'>dark</span>.
				<br /> Built for the <span className='highlight'>light</span>.
			</h1>
			<p ref={pRef} id='scroll-down-desc'>
				Based in Bodø, northern Norway
			</p>
			<AnimatedButton
				label='Go exploring'
				onClick={() =>
					document.querySelector("main")?.scrollIntoView({
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
