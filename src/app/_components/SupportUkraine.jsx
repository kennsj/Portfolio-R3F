import styles from "./styles.module.scss"

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
