import styles from "../styles/Styles.module.scss"

import { motion } from "framer-motion"
import Reveal from "./Animations/Reveal"

const Footer = () => {
	return (
		<motion.footer
			id="footer"
			initial={{ opacity: 1 }}
			transition={{
				ease: "easeIn",
				type: "tween",
				delay: 0,
				duration: 0.8,
			}}
		>
			<div className={styles.footer__wrapper}>
				<div className={styles.footer__container}>
					<Reveal>
						<div className={styles.footer__left}>
							<span>Bodø, Norway</span>
							<h2>
								<a href="tel:004746694520">+47 46 69 45 20</a>
							</h2>
							<span>
								<a href="mailto:kennethsjorgensen@gmail.com">
									kennethsjorgensen@gmail.com
								</a>
							</span>
						</div>
						<div className={styles.footer__right}>
							<a href="mailto:kennethsjorgensen@gmail.com">
								<div>
									<span>Want to work with me or hire me?</span>
									<h2>Contact me</h2>
								</div>
								<img
									src="/icons/arrow.svg"
									alt="Arrow icon with a link to contact me through email"
									width={60}
									height={60}
								/>
							</a>
						</div>
					</Reveal>
				</div>
			</div>
		</motion.footer>
	)
}

export default Footer
