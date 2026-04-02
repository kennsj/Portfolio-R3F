import { useKpIndex, getKpColor, getKpLabel } from "../../../hooks/useKpIndex"
import { useManualKp } from "../../../hooks/KpContext"
import { useState, useRef, type MouseEvent } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import NavLink from "../../UI/NavLink/NavLink"
import { usePageTransition } from "../../../hooks/usePageTransition"
import { useHeroIntro } from "../../../hooks/HeroIntroContext"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useI18n } from "../../../hooks/useI18n"

import styles from "./Nav.module.scss"

gsap.registerPlugin(ScrollTrigger)

const Nav = () => {
	const navRef = useRef<HTMLElement>(null)
	const { data } = useKpIndex()
	const { manualKp } = useManualKp()
	const [tooltipVisible, setTooltipVisible] = useState(false)
	const { locale, t } = useI18n()

	const kp = manualKp ?? data?.latest ?? 0
	const color = getKpColor(kp)
	const { label } = getKpLabel(kp, locale)

	const { transitionTo } = usePageTransition()
	const containerRef = useRef<HTMLElement>(null)
	const { homeHeroIntroReady } = useHeroIntro()

	useGSAP(
		() => {
			const navEl = navRef.current
			let hidden = false

			const fadeNav = (nextHidden: boolean) => {
				if (!navEl) return
				hidden = nextHidden
				gsap.to(navEl, {
					autoAlpha: nextHidden ? 0 : 1,
					filter: nextHidden ? "blur(15px)" : "blur(0px)",
					// near-immediate: respond to direction change, not scroll progress
					duration: nextHidden ? 0.52 : 0.52,
					ease: "power2.out",
					overwrite: "auto",
				})
			}

			const st = ScrollTrigger.create({
				onUpdate: (self) => {
					const y = window.scrollY

					// Always show at the very top.
					if (y <= window.innerHeight) {
						if (hidden) fadeNav(false)
						return
					}

					// direction: 1 = scrolling down, -1 = scrolling up
					if (self.direction === 1) {
						if (!hidden) fadeNav(true)
					} else if (self.direction === -1) {
						if (hidden) fadeNav(false)
					}
				},
			})

			const el = containerRef.current
			if (!el) {
				st.kill()
				return
			}

			if (!homeHeroIntroReady) {
				gsap.set(el, { autoAlpha: 0, pointerEvents: "none" })
				st.kill()
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

			gsap.to(
				navRef.current,

				{
					background: "#1010101a",
					boxShadow:
						"inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 8px 32px rgba(0, 0, 0, 0.2)",
					backdropFilter: "blur(12px)",
					duration: 0.5,
					ease: "power2.out",
					overwrite: "auto",
				},
			)

			gsap.set(el, { autoAlpha: 1, pointerEvents: "auto" })
			gsap.from(parts, {
				autoAlpha: 0,
				filter: "blur(14px)",
				yPercent: -38,
				duration: 0.75,
				stagger: 0.09,
				ease: "power2.out",
			})

			return () => {
				st.kill()
			}
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
					<NavLink href='/#about'>{t.navAbout}</NavLink>
					<NavLink href='/#work'>{t.navWork}</NavLink>
					<NavLink href='/#contact'>{t.navContact}</NavLink>

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
								<span className={styles["kp-location"]}>{t.kpLocation}</span>
							</div>
						)}
					</div>
				</div>
			</nav>
		</nav>
	)
}

export default Nav
