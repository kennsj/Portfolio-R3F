import { useKpIndex, getKpColor, getKpLabel } from "../../../hooks/useKpIndex"
import { useManualKp } from "../../../hooks/KpContext"
import { useState, useRef, type MouseEvent } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import NavLink from "../../UI/NavLink/NavLink"
import { usePageTransition } from "../../../hooks/usePageTransition"
import { useHeroIntro } from "../../../hooks/HeroIntroContext"

import styles from "./Nav.module.scss"

const Nav = () => {
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
			const el = containerRef.current
			if (!el) return

			if (!homeHeroIntroReady) {
				gsap.set(el, { opacity: 0, pointerEvents: "none" })
				return
			}

			const logo = el.querySelector<HTMLElement>(":scope > a")
			const linkRow = el.querySelector<HTMLElement>(
				`.${styles["nav-links"]}`,
			)
			const parts: HTMLElement[] = []
			if (logo) parts.push(logo)
			if (linkRow) {
				Array.from(linkRow.children).forEach((child) => {
					if (child instanceof HTMLElement) parts.push(child)
				})
			}

			if (!parts.length) return

			gsap.set(el, { opacity: 1, pointerEvents: "auto" })
			gsap.from(parts, {
				opacity: 0,
				filter: "blur(14px)",
				yPercent: -38,
				duration: 0.75,
				stagger: 0.09,
				ease: "power2.out",
			})
		},
		{ scope: containerRef, dependencies: [homeHeroIntroReady] },
	)

	const onLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault()
		transitionTo("/")
	}

	return (
		<nav className={styles.nav}>
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
					<NavLink href='#contact'>Contact</NavLink>

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
