import NavLink from "../../UI/NavLink/NavLink"
import ArrowLink from "../../UI/ArrowLink/ArrowLink"
import { useKpIndex, getKpLabel } from "../../../hooks/useKpIndex"
import { useManualKp } from "../../../hooks/KpContext"
import { usePageTransition } from "@/app/hooks/usePageTransition"

import styles from "./Footer.module.scss"

const Footer = () => {
	const { data } = useKpIndex()
	const { manualKp } = useManualKp()
	const kp = manualKp ?? data?.latest ?? 0
	const { label } = getKpLabel(kp)

	const { transitionTo } = usePageTransition()

	const onLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault()
		transitionTo("/")
	}

	return (
		<footer>
			<div id='footer' className={styles["footer-wrapper"]}>
				<hr data-footer-reveal />
				<div className={styles["footer-wrapper-top"]}>
					<div className={styles["footer-wrapper-left"]} data-footer-reveal>
						<a href='/' onClick={onLogoClick}>
							<img src='/kj-logo.svg' alt='Logo' />
						</a>

						<p>
							Designer. Developer. <br />
							Occasional gamer.
						</p>
					</div>
					<div className={styles["footer-wrapper-center"]}>
						{/* No HeadingAnimation: lazy sections keep the doc short on first paint, so ST "top 80%" would fire here at load. */}
						<h3 className={styles.footerSectionTitle}>Navigation</h3>
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
						<h3 className={styles.footerSectionTitle}>Contact</h3>
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
