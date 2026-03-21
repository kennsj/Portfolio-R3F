import { Link } from "@tanstack/react-router"
import { useKpIndex, getKpColor, getKpLabel } from "../../../hooks/useKpIndex"
import { useManualKp } from "../../../hooks/KpContext"
import { useState } from "react"
import NavLink from "../../UI/NavLink/NavLink"

import styles from "./Nav.module.scss"

const Nav = () => {
	const { data } = useKpIndex()
	const { manualKp } = useManualKp()
	const [tooltipVisible, setTooltipVisible] = useState(false)

	const kp = manualKp ?? data?.latest ?? 0
	const color = getKpColor(kp)
	const { label } = getKpLabel(kp)

	return (
		<nav className={styles.nav}>
			<nav className={styles["nav-container"]} aria-label='Main'>
				<Link to='/'>
					<img src='/kj-logo.svg' alt='Kenneth Jørgensen' />
				</Link>
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
