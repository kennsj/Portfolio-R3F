"use client"

import Link from "next/link"
import Image from "next/image"
import { useRef, useState } from "react"
import styles from "./styles.module.scss"
import { motion, useMotionValueEvent, useScroll } from "framer-motion"

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
			variants={navVariant}
			transition={{ duration: 0.4, ease: "easeInOut" }}
			animate={smallerNav ? "scrollDown" : "scrollUp"}
		>
			<div className={styles.nav__container}>
				<Link href='/'>
					<Image
						src='/kj-logo.svg'
						width={30}
						height={30}
						alt='Logo for Kenneth Jørgensen'
					/>
				</Link>
				<motion.div
					variants={navMenuVariant}
					transition={{ duration: 0.4, ease: "easeInOut" }}
					animate={smallerNav ? "scrollDown" : "scrollUp"}
					className={styles.menu}
				>
					<span>
						<a href='/about'>About</a>
					</span>
					<span>
						<a href='#'>Work</a>
					</span>
					<span>
						<a href='#'>Contact</a>
					</span>
				</motion.div>
			</div>
		</motion.nav>
	)
}

export default Nav
