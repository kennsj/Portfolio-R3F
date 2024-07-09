import { motion } from "framer-motion"
import styles from "../styles/ProjectPage.module.scss"

const page = () => {
	const testUrlChange = () => {
		window.history.pushState(null, "", "/sno")
	}

	return (
		<main>
			<header className={styles.work__header}>
				<div initial={{ opacity: 0 }} className={styles.heading__container}>
					<h4>Hi</h4>
					<h1 className={styles.highlighted}>Hi</h1>
				</div>
			</header>

			<section className={styles.work__section}>
				<div
					className={styles.image__container}
					initial={
						{
							// width: "100%",
							// width: imageDetails.width,
							// height: imageDetails.height,
						}
					}
					// initial={{ scale: 1 }}
					animate={{
						// y: 0,
						width: "100%",
						// transition: { ...transition },
					}}
				>
					{/* <motion.img
								// initial={{ scale: 1 }}
								initial={{
									width: imageDetails.width,
									height: imageDetails.height,
								}}
								animate={{
									y: 0,
									width: "100%",
									transition: { delay: 0.2, ...transition },
								}}
								src={workImages[0]}
							/> */}
				</div>
				<div className={styles.project__info}>
					<div className={styles.project__when}>
						<h4 className={styles.highlighted}>When</h4>
						<span>2018</span>
					</div>
					<div className={styles.project__who}>
						<h4 className={styles.highlighted}>By</h4>
						Kenneth
					</div>
					<div className={styles.project__tools}>
						<h4 className={styles.highlighted}>Tools</h4>
						Figma
					</div>
				</div>
				<p>Something</p>
				{/* {isImage ? (
								<img src={props.url} />
							) : (
								<video>
									<source src={props.url} type='video/mp4' />
								</video>
							)} */}
			</section>
		</main>
	)
}

export default page
