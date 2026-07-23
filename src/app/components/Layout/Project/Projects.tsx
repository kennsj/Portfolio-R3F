import { useRef, Fragment, useState, useCallback } from "react"
import { createPortal } from "react-dom"
import styles from "./Projects.module.scss"
import HeadingAnimation from "../../UI/HeadingAnimation/HeadingAnimation"
import { useProjectHoverPreview } from "./useProjectHoverPreview"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import SplitText from "gsap/SplitText"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { usePageTransition } from "../../../hooks/usePageTransition"
import { useI18n } from "../../../hooks/useI18n"

gsap.registerPlugin(ScrollTrigger, SplitText)

/** Match `usePageTransition` main fade-out so the hover preview exits in sync. */
const PAGE_OUT_DURATION = 0.55
const PAGE_OUT_EASE = "power2.inOut"

const Projects = () => {
	const { locale, t } = useI18n()
	const [previewInteractionLocked, setPreviewInteractionLocked] =
		useState(false)
	const projects = [
		{
			name: "Manshausen",
			link: "#",
			work: locale === "nb" ? "Personlig prosjekt" : "Personal project",
			image: "/videos/manshausen.webm",
			url: "/manshausen",
			urlText: "Redesign",
		},
		{
			name: "Verchia",
			link: "https://verchia.vercel.app/",
			work: locale === "nb" ? "Design / Kode" : "Design / Code",
			// result:
			// 	locale === "nb"
			// 		? "Visuell retning og skreddersydd frontend for et internasjonalt motemerke."
			// 		: "Visual direction and a custom front end for an international fashion label.",
			image: "/videos/verchia.webm",
			url: "/verchia",
			urlText: "Live",
		},
		{
			name: "Pradelna",
			link: "https://www.pradelnakrkonose.cz/",
			work: locale === "nb" ? "Kode" : "Code",
			// result:
			// 	locale === "nb"
			// 		? "Responsiv frontend med tydelig struktur for en lokal tjenestebedrift."
			// 		: "A responsive, clearly structured front end for a local service business.",
			image: "/videos/pradelna.webm",
			url: "/pradelna",
			urlText: "Live",
		},
		{
			name: "Dialog eXe",
			link: "https://dialog-exe.vercel.app/",
			work: "UX/UI",
			// result:
			// 	locale === "nb"
			// 		? "UX- og UI-konsept som gjør komplekse dialogflyter enklere å forstå."
			// 		: "A UX/UI concept that makes complex dialogue flows easier to understand.",
			image: "/videos/dx.webm",
			url: "/dialog-exe",
			urlText: "Case Study",
		},
	] as const

	const {
		shellRef,
		imgRef,
		videoRef,
		onMouseMove,
		onEnter,
		onLeave,
		onSectionLeave,
	} = useProjectHoverPreview(projects, {
		interactionDisabled: previewInteractionLocked,
	})

	const { transitionTo } = usePageTransition()

	const listRef = useRef<HTMLUListElement>(null)

	const handleProjectNavigate = useCallback(
		(projectUrl: string) => {
			setPreviewInteractionLocked(true)
			const img = imgRef.current
			const video = videoRef.current
			const out = {
				autoAlpha: 0,
				filter: "blur(10px)",
				duration: PAGE_OUT_DURATION,
				ease: PAGE_OUT_EASE,
			}
			if (img) {
				gsap.killTweensOf(img)
				gsap.to(img, out)
			}
			if (video) {
				gsap.killTweensOf(video)
				gsap.to(video, out)
			}
			transitionTo(`/project${projectUrl}`)
		},
		[transitionTo],
	)

	useGSAP(
		() => {
			const list = listRef.current
			if (!list) return

			const splitInstances: SplitText[] = []
			let cancelled = false
			let master: gsap.core.Timeline | null = null

			const rowStagger = 0.1

			document.fonts.ready.then(() => {
				if (cancelled || !list.isConnected) return

				master = gsap.timeline({
					scrollTrigger: {
						trigger: list,
						start: "top 80%",
						once: true,
						invalidateOnRefresh: true,
						fastScrollEnd: true,
					},
				})

				const listLinksSel = `.${CSS.escape(styles["list-links"])}`

				Array.from(list.children).forEach((child, i) => {
					const at = i * rowStagger

					if (child instanceof HTMLLIElement) {
						const h2 = child.querySelector("h2")
						const links = child.querySelector<HTMLElement>(listLinksSel)
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
							// fromTo: explicit end state avoids rare cases where a late
							// ScrollTrigger refresh + timeline.from() leaves .list-links stuck
							// at the “from” values while the title lines have already resolved.
							master.fromTo(
								links,
								{
									opacity: 0,
									filter: "blur(25px)",
									yPercent: 35,
								},
								{
									opacity: 1,
									filter: "blur(0px)",
									yPercent: 0,
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

				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						if (cancelled || !list.isConnected) return
						ScrollTrigger.refresh()
					})
				})
			})

			return () => {
				cancelled = true
				master?.scrollTrigger?.kill()
				master?.kill()
				master = null
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
					<HeadingAnimation level={3}>{t.projectsTitle}</HeadingAnimation>
					<ul
						ref={listRef}
						className={`${styles["projects-list"]}${previewInteractionLocked ? ` ${styles["projects-list--transitioning"]}` : ""}`}
					>
						{projects.map((project, index) => (
							<Fragment key={project.url}>
								<li
									className={styles["project-item"]}
									onClick={() => handleProjectNavigate(project.url)}
									onKeyDown={(event) => {
										if (event.key === "Enter" || event.key === " ") {
											event.preventDefault()
											handleProjectNavigate(project.url)
										}
									}}
									role='link'
									tabIndex={0}
									aria-label={`${project.name}: ${project.result}`}
									onMouseMove={onMouseMove}
									onMouseEnter={(e) => onEnter(project, index, e)}
									onMouseLeave={(e) => onLeave(index, e)}
									data-project-index={index}
									data-cursor='view'
								>
									<h2>{project.name}</h2>
									<p className={styles["project-result"]}>{project.result}</p>
									<div className={styles["list-links"]}>
										<span className={styles["project-work"]}>
											{project.work}
										</span>
										<span className={styles["arrow-link"]}>
											<span className={styles["arrow-link-text"]}>
												{/* {t.projectCaseStudy} */}
												{project.urlText}
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
								<hr />
								{/* {index < projects.length - 1 ? <hr /> : null} */}
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
						className={styles["project-hover"]}
						alt=''
						aria-hidden
					/>
					<video
						ref={videoRef}
						className={styles["project-hover"]}
						muted
						loop
						playsInline
						aria-hidden
					/>
				</div>,
				document.body,
			)}
		</>
	)
}

export default Projects
