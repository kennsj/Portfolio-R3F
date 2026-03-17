import { Link } from "@tanstack/react-router"
import styles from "./Nav.module.scss"

const Nav = () => {
	return (
		<nav className={styles.nav}>
			<nav className={styles["nav-container"]} aria-label='Main'>
				<img src='/kj-logo.svg' alt='Kenneth Jørgensen' />
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
				</div>
			</nav>
		</nav>
	)
}

export default Nav
