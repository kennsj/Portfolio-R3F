import { Link } from "@tanstack/react-router"
import styles from "./Nav.module.scss"
import { useKpIndex, getKpColor, getKpLabel } from "../../../hooks/useKpIndex"
import { useManualKp } from "../../../hooks/KpContext"
import { useState } from "react"

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
					<Link to='/' className={styles["nav-link"]}>
						ABOUT
					</Link>
					<Link to='/' className={styles["nav-link"]}>
						WORK
					</Link>
					<Link to='/#footer' className={styles["nav-link"]}>
						CONTACT
					</Link>

					<div
						className={styles["kp-indicator"]}
						onMouseEnter={() => setTooltipVisible(true)}
						onMouseLeave={() => setTooltipVisible(false)}
					>
						<span className={styles["kp-dot"]} style={{ background: color }} />
						{tooltipVisible && (
							<div className={styles["kp-tooltip"]}>
								<span className={styles["kp-value"]}>Kp {kp.toFixed(1)}</span>
								<span className={styles["kp-status"]}>{label}</span>
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
