import Image from "next/image"
import styles from "../styles/Styles.module.scss"

const Footer = () => {
	return (
		<footer>
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
						<a href='#'>
							<Image src={"/icons/arrow.svg"} width={60} height={60} />
						</a>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
