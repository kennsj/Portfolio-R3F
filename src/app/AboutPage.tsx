import { useI18n } from "./hooks/useI18n"
import { usePageTransition } from "./hooks/usePageTransition"

import styles from "./styles/AboutPage.module.scss"

export default function AboutPage() {
	const { t } = useI18n()
	const { transitionTo } = usePageTransition()

	return (
		<>
			<img
				src='/images/kenneth-aurora.jpg'
				alt='About Page Hero'
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					opacity: 0.5,
					zIndex: -1,
					// transform: "scaleX(-1)",
				}}
			/>
			<header className={styles.header}>
				<h4>About</h4>
				<h1>
					Kenneth <br />
					<span className='highlight'>Jørgensen</span>
				</h1>
				<h3>
					A designer and developer from Bodø, northern Norway. I care about the
					full process, from the first concept to the last line of code.
				</h3>
			</header>
			<main></main>
		</>
	)
}
