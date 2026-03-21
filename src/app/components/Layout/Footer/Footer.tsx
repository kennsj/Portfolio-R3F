import NavLink from "../../UI/NavLink/NavLink"
import HeadingAnimation from "../../UI/HeadingAnimation/HeadingAnimation"

import styles from "./Footer.module.scss"

const Footer = () => {
	return (
		<footer id='footer'>
			<div className={styles["footer-wrapper"]}>
				<div className={styles["footer-wrapper-left"]}>
					<img src='/kj-logo.svg' alt='Logo' />
					<p>
						Designer. Developer. <br />
						Occasional gamer.
					</p>
				</div>
				<div className={styles["footer-wrapper-center"]}>
					<HeadingAnimation level={3}>Navigation</HeadingAnimation>
					<ul>
						<li>
							<NavLink href='/#about'>About</NavLink>
						</li>
						<li>
							<NavLink href='/#work'>About</NavLink>
						</li>
						<li>
							<NavLink href='/#about'>About</NavLink>
						</li>
						<li>
							<NavLink href='/#about'>About</NavLink>
						</li>
					</ul>
				</div>
				<div className={styles["footer-wrapper-right"]}>
					<HeadingAnimation level={3}>Contact</HeadingAnimation>
					<ul>
						<li></li>
					</ul>
				</div>
			</div>
		</footer>
	)
}

export default Footer
