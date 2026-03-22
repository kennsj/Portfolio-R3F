import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import NavLink from "../../UI/NavLink/NavLink"
import ArrowLink from "../../UI/ArrowLink/ArrowLink"
import HeadingAnimation from "../../UI/HeadingAnimation/HeadingAnimation"
import { useKpIndex, getKpLabel } from "../../../hooks/useKpIndex"
import { useManualKp } from "../../../hooks/KpContext"

import styles from "./Footer.module.scss"

gsap.registerPlugin(ScrollTrigger)

const Footer = () => {
	const footerRef = useRef<HTMLElement>(null)
	const { data } = useKpIndex()
	const { manualKp } = useManualKp()
	const kp = manualKp ?? data?.latest ?? 0
	const { label } = getKpLabel(kp)

	useGSAP(
		() => {
			const footer = footerRef.current
			if (!footer) return

			const sequence = footer.querySelectorAll<HTMLElement>(
				"[data-footer-reveal]",
			)
			if (!sequence.length) return

			gsap.fromTo(
				sequence,
				{
					opacity: 0,
					filter: "blur(16px)",
					yPercent: 10,
				},
				{
					opacity: 1,
					filter: "blur(0px)",
					yPercent: 0,
					duration: 0.8,
					stagger: 0.11,
					ease: "power2.out",
					scrollTrigger: {
						trigger: footer,
						start: "top bottom",
						toggleActions: "play none none none",
						invalidateOnRefresh: true,
					},
				},
			)

			requestAnimationFrame(() => {
				ScrollTrigger.refresh()
			})
		},
		{ scope: footerRef },
	)

	return (
		<footer ref={footerRef} id='footer'>
			<div className={styles["footer-wrapper"]}>
				<hr data-footer-reveal />
				<div className={styles["footer-wrapper-top"]}>
					<div
						className={styles["footer-wrapper-left"]}
						data-footer-reveal
					>
						<img src='/kj-logo.svg' alt='Logo' />
						<p>
							Designer. Developer. <br />
							Occasional gamer.
						</p>
					</div>
					<div className={styles["footer-wrapper-center"]}>
						<HeadingAnimation level={3}>Navigation</HeadingAnimation>
						<ul data-footer-reveal>
							<li>
								<NavLink href='/'>Home</NavLink>
							</li>
							<li>
								<NavLink href='/#about'>About</NavLink>
							</li>
							<li>
								<NavLink href='/#work'>Work</NavLink>
							</li>
							<li>
								<NavLink href='#contact'>Contact</NavLink>
							</li>
						</ul>
					</div>
					<div className={styles["footer-wrapper-right"]}>
						<HeadingAnimation level={3}>Contact</HeadingAnimation>
						<ul data-footer-reveal>
							<li>
								<ArrowLink
									href='https://www.linkedin.com/in/kennethstrandjorgensen/'
									target='_blank'
								>
									LinkedIn
								</ArrowLink>
							</li>
							<li>
								<ArrowLink href='https://github.com/kennsj' target='_blank'>
									GitHub
								</ArrowLink>
							</li>
							<li>
								<ArrowLink href='#' target='_blank'>
									CV / Resume
								</ArrowLink>
							</li>
							<li>
								<ArrowLink href='mailto:hello@kj.design'>
									hello@kj.design
								</ArrowLink>
							</li>
						</ul>
					</div>
				</div>
				<hr data-footer-reveal />
				<div className={styles["footer-wrapper-bottom"]} data-footer-reveal>
					<p>© {new Date().getFullYear()} Kenneth Jørgensen</p>
					<div className={styles["kp"]}>
						<div className={styles["kp-row"]}>
							<span className={styles["kp-value"]}>Kp {kp.toFixed(1)}</span>
							<span className={styles["kp-dot"]} aria-hidden />
							<span className={styles["kp-status"]}>{label}</span>
						</div>
						<p className={styles["kp-location"]}>Bodø, Norway</p>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
