import { Link } from "@tanstack/react-router"
import { useState } from "react"
import { motion, useMotionValueEvent, useScroll } from "framer-motion"
import styles from "../styles/Styles.module.scss"

const Nav = () => {
	let { scrollY } = useScroll()

	const [smallerNav, setSmallerNav] = useState(false)

	useMotionValueEvent(scrollY, "change", (latest) => {
		const prev = scrollY.getPrevious()

		if (latest > prev) {
			setSmallerNav(true)
		} else {
			setSmallerNav(false)
		}
	})

	const navVariant = {
		scrollDown: { height: "70px" },
		scrollUp: { height: "120px" },
	}

	const navLogoVariant = {
		scrollDown: { width: "1.5rem" },
		scrollUp: { width: "2rem" },
	}

	const navMenuVariant = {
		scrollDown: { opacity: 0 },
		scrollUp: { opacity: 1 },
	}

	return (
		<motion.nav
			id={styles.nav}
		>
			<div className={styles.nav__container}>
				<Link to="/">
					<img
						className={styles.nav_logo}
						src="/kj-logo.svg"
						width={30}
						height={30}
						alt="Personal logo for Kenneth Jørgensen"
					/>
				</Link>
				<motion.div
					variants={navMenuVariant}
					transition={{ duration: 0.4, ease: "easeInOut" }}
					animate={smallerNav ? "scrollDown" : "scrollUp"}
					className={styles.menu}
				>
					<span className={styles.span_link}>
						<a className={styles.nav_link} href="#">
							Work
						</a>
					</span>
					<span className={styles.span_link}>
						<a className={styles.nav_link} href="#">
							About
						</a>
					</span>
					<span className={styles.span_link}>
						<Link to="/#footer">Contact</Link>
					</span>
				</motion.div>
			</div>
		</motion.nav>
	)
}

export default Nav
