import type { MouseEvent } from "react"
import { useNavigate } from "@tanstack/react-router"
import styles from "./Projects.module.scss"
import { setLightColor } from "../../Experiences/lightStore"
import HeadingAnimation from "../../UI/HeadingAnimation/HeadingAnimation"
import { useProjectHoverPreview } from "./useProjectHoverPreview"

const projects = [
	{
		name: "Verchia",
		link: "https://verchia.vercel.app/",
		work: "Design / Code",
		image: "/images/verchia.png",
		url: "/verchia",
	},
	{
		name: "Pradelna",
		link: "https://pradelna.vercel.app/",
		work: "Design / Code",
		image: "/images/pradelna.png",
		url: "/pradelna",
	},
	{
		name: "Dialog eXe",
		link: "https://dialog-exe.vercel.app/",
		work: "Design / Code",
		image: "/images/verchia.png",
		url: "/dialog-exe",
	},
	{
		name: "Snø Oslo",
		link: "https://snø-oslo.vercel.app/",
		work: "Design / Code",
		image: "/images/verchia.png",
		url: "/sno-oslo",
	},
] as const

const Projects = () => {
	const navigate = useNavigate()
	const {
		shellRef,
		imgRef,
		currentProject,
		onMouseMove,
		onEnter,
		onLeave,
		onSectionLeave,
	} = useProjectHoverPreview(projects)

	const handleProjectClick = (e: MouseEvent, slug: string) => {
		e.preventDefault()
		setLightColor("#E4DCCB")
		setTimeout(() => {
			navigate({ to: `/project/${slug}` })
		}, 1200)
	}

	return (
		<>
			<section
				className={styles.projects}
				onMouseMove={onMouseMove}
				onMouseLeave={onSectionLeave}
			>
				<HeadingAnimation level={3}>Featured works</HeadingAnimation>
				<ul className={styles["projects-list"]}>
					{projects.map((project, index) => (
						<li
							key={project.url}
							className={styles["project-item"]}
							onClick={(e) => handleProjectClick(e, project.url)}
							onMouseMove={onMouseMove}
							onMouseEnter={(e) => onEnter(project, index, e)}
							onMouseLeave={(e) => onLeave(index, e)}
							data-project-index={index}
							data-cursor='view'
						>
							<h2>{project.name}</h2>
							<div className={styles["list-links"]}>
								<span className={styles["project-work"]}>{project.work}</span>
								<div>
									Visit
									<span className={styles["link-arrow"]}>
										<img src='/icons/arrow.svg' alt='' />
									</span>
								</div>
							</div>
						</li>
					))}
				</ul>
			</section>

			<div
				ref={shellRef}
				className={styles["project-hover-shell"]}
				aria-hidden='true'
			>
				<img
					ref={imgRef}
					src={currentProject.image}
					alt={currentProject.name}
					className={styles["project-hover"]}
				/>
			</div>
		</>
	)
}

export default Projects
