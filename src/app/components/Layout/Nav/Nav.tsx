import { useKpIndex, getKpColor, getKpLabel } from "../../../hooks/useKpIndex"
import { useManualKp } from "../../../hooks/KpContext"
import { useState, useRef, type MouseEvent } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import NavLink from "../../UI/NavLink/NavLink"
import { usePageTransition } from "../../../hooks/usePageTransition"
import { useHeroIntro } from "../../../hooks/HeroIntroContext"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import styles from "./Nav.module.scss"

gsap.registerPlugin(ScrollTrigger)

const Nav = () => {
	const navRef = useRef<HTMLElement>(null)
	const { data } = useKpIndex()
	const { manualKp } = useManualKp()
	const [tooltipVisible, setTooltipVisible] = useState(false)

	const kp = manualKp ?? data?.latest ?? 0
	const color = getKpColor(kp)
	const { label } = getKpLabel(kp)

	const { transitionTo } = usePageTransition()
	const containerRef = useRef<HTMLElement>(null)
	const { homeHeroIntroReady } = useHeroIntro()

	useGSAP(
		() => {
			let lastY = window.scrollY

			ScrollTrigger.create({
				onUpdate: () => {
					const currentY = window.scrollY

					if (currentY > lastY && currentY > 100) {
						gsap.killTweensOf(navRef.current)
						gsap.to(navRef.current, {
							autoAlpha: 0,
							filter: "blur(15px)",
							duration: 0.6,
							ease: "power2.inOut",
						})
					} else if (currentY < lastY) {
						gsap.killTweensOf(navRef.current)
						gsap.to(navRef.current, {
							autoAlpha: 1,
							filter: "blur(0px)",
							duration: 0.3,
							ease: "power2.inOut",
						})
					}

					lastY = currentY
				},
			})

			const el = containerRef.current
			if (!el) return

			if (!homeHeroIntroReady) {
				gsap.set(el, { autoAlpha: 0, pointerEvents: "none" })
				return
			}

			const logo = el.querySelector<HTMLElement>(":scope > a")
			const linkRow = el.querySelector<HTMLElement>(`.${styles["nav-links"]}`)
			const parts: HTMLElement[] = []
			if (logo) parts.push(logo)
			if (linkRow) {
				Array.from(linkRow.children).forEach((child) => {
					if (child instanceof HTMLElement) parts.push(child)
				})
			}

			if (!parts.length) return

			gsap.set(el, { autoAlpha: 1, pointerEvents: "auto" })
			gsap.from(parts, {
				autoAlpha: 0,
				filter: "blur(14px)",
				yPercent: -38,
				duration: 0.75,
				stagger: 0.09,
				ease: "power2.out",
			})
		},
		{ scope: containerRef, dependencies: [homeHeroIntroReady] },
	)

	const onLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault()
		transitionTo("/")
	}

	return (
		<nav ref={navRef} className={styles.nav}>
			<nav
				ref={containerRef}
				className={styles["nav-container"]}
				aria-label='Main'
				aria-hidden={!homeHeroIntroReady}
			>
				<a href='/' onClick={onLogoClick}>
					<img src='/kj-logo.svg' alt='Kenneth Jørgensen' />
				</a>
				<div className={styles["nav-links"]}>
					<NavLink href='/#about'>About</NavLink>
					<NavLink href='/#work'>Works</NavLink>
					<NavLink href='/#contact'>Contact</NavLink>

					<div
						className={styles["kp-indicator"]}
						onMouseEnter={() => setTooltipVisible(true)}
						onMouseLeave={() => setTooltipVisible(false)}
					>
						<span className={styles["kp-dot"]} style={{ background: color }} />
						{tooltipVisible && (
							<div className={styles["kp-tooltip"]}>
								<div>
									<span className={styles["kp-value"]}>Kp {kp.toFixed(1)}</span>
									<span className={styles["kp-status"]}>{label}</span>
								</div>
								<span className={styles["kp-location"]}>Bodø, Norway</span>
							</div>
						)}
					</div>
				</div>
			</nav>
		</nav>
	)
}

export default Nav
