import { createFileRoute } from "@tanstack/react-router"
import { motion } from "framer-motion"
import styles from "./styles/ProjectPage.module.scss"

export const Route = createFileRoute("/manshausen")({
	component: ManshausenPage,
})

function ManshausenPage() {
	return (
		<main>
			<header className={styles.work__header}>
				<div initial={{ opacity: 0 }} className={styles.heading__container}>
					<h4>VR / Concept</h4>
					<h1 className={styles.highlighted}>Manshausen Island</h1>
					<p>Redesigning</p>
				</div>
			</header>

			<img
				className={styles.project_image__header}
				width={1920}
				height={1020}
				alt="..."
				src="/projects/manshausen.jpg"
				style={{ width: "75%", height: "auto", objectFit: "cover" }}
			/>

			<section className={styles.work__section}>
				<div className={styles.project__info}>
					<div className={styles.project__when}>
						<h4>When</h4>
						<span>2025</span>
					</div>

					<div className={styles.project__tools}>
						<h4>Tools</h4>
						<span>
							Next.js <br />
							Payload CMS <br />
							Framer Motion
						</span>
					</div>
				</div>
				<h2>
					Redesign of Manshausen Island's website, a project that involved both
					UI and web development work to create a more engaging and informative
					experience for visitors
				</h2>

				<p></p>

				<figure>
					<img
						width={1280}
						height={768}
						style={{ width: "100%", height: "auto" }}
						src="/projects/manshausen-menu.jpg"
						alt="Manshausen menu"
					/>
				</figure>
			</section>
		</main>
	)
}
