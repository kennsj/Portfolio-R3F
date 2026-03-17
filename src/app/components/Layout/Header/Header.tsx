import styles from "./Header.module.scss"

const Header = () => {
	return (
		<>
			<header className={styles.header}>
				<h3>Avid gamer. Occasional perfectionist.</h3>
				<h1>
					Designed in the <span className='highlight'>dark</span>.
					<br /> Built for the <span className='highlight'>light</span>.
				</h1>
				<p>
					So nothing gets lost between <br /> the idea and the browser.
				</p>
			</header>
		</>
	)
}

export default Header
