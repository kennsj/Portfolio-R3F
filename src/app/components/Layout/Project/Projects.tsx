import styles from "./Projects.module.scss"

const Projects = () => {
	return (
		<section className={styles.projects}>
			<ul className={styles["projects-list"]}>
				<li>
					<h2>Verchia</h2>
				</li>
				<div className={styles["list-links"]}>
					<li className='work'>Design / Code</li>
					<li>
						Website
						<span className={styles["link-arrow"]}>
							<img src='/icons/arrow.svg'></img>
						</span>
					</li>
				</div>
			</ul>
			<ul className={styles["projects-list"]}>
				<li>
					<h2>Pradelna</h2>
				</li>
				<div className={styles["list-links"]}>
					<li className='work'>Design / Code</li>
					<li>
						Website
						<span className={styles["link-arrow"]}>
							<img src='/icons/arrow.svg'></img>
						</span>
					</li>
				</div>
			</ul>
			<ul className={styles["projects-list"]}>
				<li>
					<h2>Dialog eXe</h2>
				</li>
				<div className={styles["list-links"]}>
					<li className='work'>Design / Code</li>
					<li>
						Website
						<span className={styles["link-arrow"]}>
							<img src='/icons/arrow.svg'></img>
						</span>
					</li>
				</div>
			</ul>
			<ul className={styles["projects-list"]}>
				<li>
					<h2>Snø Oslo</h2>
				</li>
				<div className={styles["list-links"]}>
					<li className='work'>Design / Code</li>
					<li>
						Website
						<span className={styles["link-arrow"]}>
							<img src='/icons/arrow.svg'></img>
						</span>
					</li>
				</div>
			</ul>
		</section>
	)
}

export default Projects
