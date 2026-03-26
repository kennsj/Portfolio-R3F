import styles from "./Header.module.scss"
import AnimatedButton from "../../../UI/AnimatedButton/AnimatedButton"

const Header = () => {
	return (
		<header className={styles.header}>
			<h4></h4>
			<h1>
				<span className='highlight'>Case Study</span> <br /> coming soon
			</h1>
			{/* <p>LOCATION 67.2829° N, 14.4151° E</p> */}
			<AnimatedButton
				label='Explore case'
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
