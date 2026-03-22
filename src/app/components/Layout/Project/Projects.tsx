import { useRef, Fragment } from "react"
import { createPortal } from "react-dom"
import styles from "./Projects.module.scss"
import HeadingAnimation from "../../UI/HeadingAnimation/HeadingAnimation"
import { useProjectHoverPreview } from "./useProjectHoverPreview"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import SplitText from "gsap/SplitText"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { usePageTransition } from "../../../hooks/usePageTransition"

gsap.registerPlugin(ScrollTrigger, SplitText)

const projects = [
	{
		name: "Verchia",
		link: "https://verchia.vercel.app/",
		work: "Design / Code",
		image: "/images/verchia.png",
		url: "/verchia",
		urlText: "Case Study",
	},
	{
		name: "Pradelna",
		link: "https://pradelna.vercel.app/",
		work: "Design / Code",
		image: "/images/pradelna.png",
		url: "/pradelna",
		urlText: "Case Study",
	},
	{
		name: "Dialog eXe",
		link: "https://dialog-exe.vercel.app/",
		work: "Design / Code",
		image: "/images/verchia.png",
		url: "/dialog-exe",
		urlText: "Case Study",
	},
	{
		name: "Snø Oslo",
		link: "https://snø-oslo.vercel.app/",
		work: "Design / Code",
		image: "/images/verchia.png",
		url: "/sno-oslo",
		urlText: "Case Study",
	},
] as const

const Projects = () => {
	const {
		shellRef,
		imgRef,
		currentProject,
		onMouseMove,
		onEnter,
		onLeave,
		onSectionLeave,
	} = useProjectHoverPreview(projects)

	const { transitionTo } = usePageTransition()

	const listRef = useRef<HTMLUListElement>(null)

	useGSAP(
		() => {
			const list = listRef.current
			if (!list) return

			const splitInstances: SplitText[] = []
			let cancelled = false

			const rowStagger = 0.1

			document.fonts.ready.then(() => {
				if (cancelled || !list.isConnected) return

				const master = gsap.timeline({
					scrollTrigger: {
						trigger: list,
						start: "top 80%",
					},
				})

				Array.from(list.children).forEach((child, i) => {
					const at = i * rowStagger

					if (child instanceof HTMLLIElement) {
						const h2 = child.querySelector("h2")
						const links = h2?.nextElementSibling as HTMLElement | null
						if (!h2) return

						const split = SplitText.create(h2, {
							type: "lines",
							// mask: "lines",
						})
						splitInstances.push(split)

						master.from(
							split.lines,
							{
								opacity: 0,
								filter: "blur(25px)",
								yPercent: 100,
								stagger: 0.001,
								duration: 1,
								ease: "power2.out",
							},
							at,
						)

						if (links) {
							master.from(
								links,
								{
									opacity: 0,
									filter: "blur(25px)",
									yPercent: 35,
									duration: 0.9,
									ease: "power2.out",
								},
								at + 0.05,
							)
						}
					} else if (child instanceof HTMLHRElement) {
						master.to(
							child,
							{
								filter: "blur(0px)",
								scaleX: 1,
								transformOrigin: "left",
								duration: 1,
								ease: "power2.out",
							},
							at,
						)
					}
				})
			})

			return () => {
				cancelled = true
				splitInstances.splice(0).forEach((s) => s.revert())
			}
		},
		{ scope: listRef },
	)

	return (
		<>
			<section
				id='work'
				onMouseMove={onMouseMove}
				onMouseLeave={onSectionLeave}
			>
				<div className={styles["projects-wrapper"]}>
					<HeadingAnimation level={3}>Selected work</HeadingAnimation>
					<ul ref={listRef} className={styles["projects-list"]}>
						{projects.map((project, index) => (
							<Fragment key={project.url}>
								<li
									className={styles["project-item"]}
									onClick={() => transitionTo(`/project${project.url}`)}
									onMouseMove={onMouseMove}
									onMouseEnter={(e) => onEnter(project, index, e)}
									onMouseLeave={(e) => onLeave(index, e)}
									data-project-index={index}
									data-cursor='view'
								>
									<h2>{project.name}</h2>
									<div className={styles["list-links"]}>
										<span className={styles["project-work"]}>
											{project.work}
										</span>
										<span className={styles["arrow-link"]}>
											<span className={styles["arrow-link-text"]}>
												Case study
											</span>
											<span className={styles["arrow-link-icon"]}>
												<svg
													xmlns='http://www.w3.org/2000/svg'
													width='24'
													height='24'
													viewBox='0 0 24 24'
													fill='none'
													stroke='currentColor'
													strokeWidth='1.5'
													strokeLinecap='round'
													strokeLinejoin='round'
												>
													<path d='M5 12h14M13 6l6 6-6 6' />
												</svg>
											</span>
										</span>
									</div>
								</li>
								{index < projects.length - 1 ? <hr /> : null}
							</Fragment>
						))}
					</ul>
				</div>
			</section>

			{createPortal(
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
				</div>,
				document.body,
			)}
		</>
	)
}

export default Projects
