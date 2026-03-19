import styles from "./ExperienceTools.module.scss"

const experienceItems = [
	"Product thinking from concept to code",
	"Motion + interaction design (micro-animations)",
	"Front-end architecture with performance in mind",
]

const toolItems = [
	"React",
	"TypeScript",
	"Three.js (R3F)",
	"GSAP",
	"Sass / SCSS modules",
	"TanStack Router",
	"Vite",
]

const ExperienceTools = () => {
	return (
		<section className={styles.section} aria-label='Experience and tools'>
			<h3 className={styles.heading}>Experience / Tools</h3>

			<div className={styles.grid}>
				<div className={styles.column}>
					<h4 className={styles.columnTitle}>Experience</h4>
					<ul className={styles.list}>
						{experienceItems.map((item) => (
							<li key={item} className={styles.listItem}>
								<span className={styles.index}>01</span>
								<span>{item}</span>
							</li>
						))}
					</ul>
				</div>

				<div className={styles.column}>
					<h4 className={styles.columnTitle}>Tools</h4>
					<div className={styles.chips} role='list'>
						{toolItems.map((tool, idx) => (
							<span key={tool} className={styles.chip} role='listitem' aria-label={tool}>
								{tool}
							</span>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}

export default ExperienceTools

