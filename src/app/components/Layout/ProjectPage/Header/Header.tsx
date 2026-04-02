import styles from "./Header.module.scss"
import AnimatedButton from "../../../UI/AnimatedButton/AnimatedButton"
import { useI18n } from "../../../../hooks/useI18n"

const Header = () => {
	const { t } = useI18n()

	return (
		<header className={styles.header}>
			<h4></h4>
			<h1>
				<span className='highlight'>{t.projectHeaderTitle}</span> <br />{" "}
				{t.projectHeaderComingSoon}
			</h1>
			{/* <p>LOCATION 67.2829° N, 14.4151° E</p> */}
			<AnimatedButton
				label={t.projectHeaderButton}
				onClick={() =>
					document.querySelector("#")?.scrollIntoView({
						behavior: "smooth",
						block: "start",
					})
				}
				dataScrollDown
				ariaDescribedBy='scroll-down-desc'
				revealDelay={0.85}
				revealDuration={1.2}
			/>
		</header>
	)
}

export default Header
