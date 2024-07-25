"use client"

import Image from "next/image"
import styles from "../styles/Styles.module.scss"

import { motion, inView } from "framer-motion"

const Footer = () => {
	return (
		<motion.footer
			id='#footer'
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{
				ease: "easeIn",
				type: "tween",
				delay: 0,
				duration: 0.8,
			}}
		>
			<div className={styles.footer__wrapper}>
				<div className={styles.footer__container}>
					<div className={styles.footer__left}>
						<span>Bodø, Norway</span>
						<h2>
							<a href='tel:004746694520'>+47 46 69 45 20</a>
						</h2>
						<span>
							<a href='mailto:kennethsjorgensen@gmail.com'>
								kennethsjorgensen@gmail.com
							</a>
						</span>
					</div>
					<div className={styles.footer__right}>
						<div>
							<span>Want to work with me or hire me?</span>
							<h2>Contact me</h2>
						</div>
						<a href='mailto:kennethsjorgensen@gmail.com'>
							<Image
								src={"/icons/arrow.svg"}
								alt='Arrow icon with a link to contact me through email'
								width={60}
								height={60}
							/>
						</a>
					</div>
				</div>
			</div>
		</motion.footer>
	)
}

export default Footer
