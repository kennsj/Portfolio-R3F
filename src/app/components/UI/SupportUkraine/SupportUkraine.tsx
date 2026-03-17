import styles from "./SupportUkraine.module.scss"

const SupportUkraine = () => {
	return (
		<a href='https://u24.gov.ua/' target='_blank'>
			<div className={styles.flag}>
				<div className={styles.blue}></div>
				<div className={styles.yellow}></div>
			</div>
		</a>
	)
}

export default SupportUkraine
