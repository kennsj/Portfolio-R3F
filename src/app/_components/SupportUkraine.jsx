import styles from "../styles/Styles.module.scss"

const SupportUkraine = () => {
	return (
		<a href='https://supportukrainenow.org/'>
			<div className={styles.flag}>
				<div className={styles.blue}></div>
				<div className={styles.yellow}></div>
			</div>
		</a>
	)
}

export default SupportUkraine
