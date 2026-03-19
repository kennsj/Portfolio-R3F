import { useState, useRef, useEffect } from "react"
import styles from "./Projects.module.scss"
import { Link } from "@tanstack/react-router"
import gsap from "gsap"

const projects = [
	{
		name: "Verchia",
		link: "https://verchia.vercel.app/",
		work: "Design / Code",
		image: "/images/verchia.png",
		url: "/projects/verchia",
	},
	{
		name: "Pradelna",
		link: "https://pradelna.vercel.app/",
		work: "Design / Code",
		image: "/images/pradelna.png",
		url: "/projects/pradelna",
	},
	{
		name: "Dialog eXe",
		link: "https://dialog-exe.vercel.app/",
		work: "Design / Code",
		image: "/images/verchia.png",
		url: "/projects/dialog-exe",
	},
	{
		name: "Snø Oslo",
		link: "https://snø-oslo.vercel.app/",
		work: "Design / Code",
		image: "/images/verchia.png",
		url: "/projects/sno-oslo",
	},
]

const Projects = () => {
	const [currentProject, setCurrentProject] = useState<
		(typeof projects)[number]
	>(projects[0])
	const [visible, setVisible] = useState(false)

	const shellRef = useRef<HTMLDivElement>(null)
	const imgRef = useRef<HTMLImageElement>(null)
	const targetPos = useRef({ x: 0, y: 0 })
	const currentPos = useRef({ x: 0, y: 0 })
	const lastPointer = useRef<{ x: number; y: number } | null>(null)
	const isScrollingRef = useRef(false)
	const scrollEndTimeoutRef = useRef<number | null>(null)

	const visibleRef = useRef(false)
	const activeIndexRef = useRef<number>(-1)
	const hideTimeoutRef = useRef<number | null>(null)
	const lastEnterYRef = useRef<number | null>(null)
	const recheckTimeoutRef = useRef<number | null>(null)

	const LERP_FACTOR = 0.12

	// Lerp loop
	useEffect(() => {
		let rafId: number
		const tick = () => {
			if (shellRef.current && visibleRef.current) {
				currentPos.current.x +=
					(targetPos.current.x - currentPos.current.x) * LERP_FACTOR
				currentPos.current.y +=
					(targetPos.current.y - currentPos.current.y) * LERP_FACTOR

				gsap.set(shellRef.current, {
					left: currentPos.current.x,
					top: currentPos.current.y,
				})
			}
			rafId = requestAnimationFrame(tick)
		}
		rafId = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(rafId)
	}, [])

	const handleMouseMove = (e: React.MouseEvent) => {
		targetPos.current = { x: e.clientX, y: e.clientY }
		lastPointer.current = { x: e.clientX, y: e.clientY }
	}

	const animateInFirst = (
		project: (typeof projects)[number],
		index: number,
		x: number,
		y: number,
	) => {
		targetPos.current = { x, y }
		currentPos.current = { x, y }
		if (shellRef.current) {
			gsap.set(shellRef.current, { left: x, top: y })
		}

		activeIndexRef.current = index
		lastEnterYRef.current = y
		visibleRef.current = true
		setVisible(true)

		if (!imgRef.current) return

		gsap.killTweensOf(imgRef.current)
		setCurrentProject(project)

		// Fade in + enter from bottom (clipped by the frame).
		gsap.set(imgRef.current, { opacity: 0, yPercent: 100 })
		gsap.to(imgRef.current, {
			opacity: 1,
			yPercent: 0,
			duration: 0.4,
			ease: "cubic.bezier(0.165, 0.84, 0.44, 1)",
		})
	}

	const handleEnter = (
		project: (typeof projects)[number],
		index: number,
		e: React.MouseEvent,
	) => {
		// Cancel pending hide when switching links.
		if (hideTimeoutRef.current) {
			clearTimeout(hideTimeoutRef.current)
			hideTimeoutRef.current = null
		}

		if (!visibleRef.current) {
			animateInFirst(project, index, e.clientX, e.clientY)
			return
		}

		// Already hovering another link -> slide old image out, slide new image in.
		const prevIndex = activeIndexRef.current
		if (prevIndex === index) {
			targetPos.current = { x: e.clientX, y: e.clientY }
			return
		}

		const prevY = lastEnterYRef.current
		const dir = prevY == null ? 1 : e.clientY > prevY ? 1 : -1 // moving down = 1, moving up = -1
		const outY = dir === 1 ? -100 : 100
		const inY = dir === 1 ? 100 : -100

		activeIndexRef.current = index
		lastEnterYRef.current = e.clientY
		targetPos.current = { x: e.clientX, y: e.clientY }

		if (!imgRef.current) {
			setCurrentProject(project)
			return
		}

		// Animate the currently visible image away, then swap src and animate back in.
		gsap.to(imgRef.current, {
			yPercent: outY,
			opacity: 0,
			duration: 0.2,
			ease: "power3.inOut",
			onComplete: () => {
				if (!imgRef.current) return

				imgRef.current.src = project.image
				imgRef.current.alt = project.name
				setCurrentProject(project)

				gsap.set(imgRef.current, { yPercent: inY, opacity: 0 })
				gsap.to(imgRef.current, {
					yPercent: 0,
					opacity: 1,
					duration: 0.4,
					ease: "cubic.bezier(0.165, 0.84, 0.44, 1)",
				})
			},
		})
	}

	const handleLeave = (index: number, e: React.MouseEvent) => {
		// Small delay to check if we've entered another link.
		const { clientX, clientY } = e
		const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null
		const closest = el?.closest("[data-project-index]") as HTMLElement | null
		const pointerIsOverProject = Boolean(closest)

		if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)

		// If the leave is caused by scroll, the pointer may still be over a project item.
		// Only clear/cancel when the pointer isn't over any project anymore.
		if (!pointerIsOverProject) {
			if (recheckTimeoutRef.current) {
				clearTimeout(recheckTimeoutRef.current)
				recheckTimeoutRef.current = null
			}
			lastPointer.current = null
		}

		// If the pointer isn't over a project item anymore, hide immediately.
		if (!pointerIsOverProject) {
			activeIndexRef.current = -1
			lastEnterYRef.current = null
			visibleRef.current = false
			setVisible(false)

			if (imgRef.current) {
				gsap.killTweensOf(imgRef.current)
				gsap.set(imgRef.current, { opacity: 0 })
			}
			return
		}

		hideTimeoutRef.current = window.setTimeout(() => {
			if (activeIndexRef.current !== index) return

			activeIndexRef.current = -1
			lastEnterYRef.current = null
			if (!pointerIsOverProject) lastPointer.current = null
			visibleRef.current = false
			setVisible(false)

			if (imgRef.current) {
				gsap.killTweensOf(imgRef.current)
				gsap.set(imgRef.current, { opacity: 0 })
				gsap.to(imgRef.current, {
					opacity: 0,
					duration: 0.25,
					ease: "power3.out",
				})
			}
		}, 50)
	}

	const handleSectionLeave = () => {
		if (!isScrollingRef.current) lastPointer.current = null
		if (hideTimeoutRef.current) {
			clearTimeout(hideTimeoutRef.current)
			hideTimeoutRef.current = null
		}

		hideHover()
	}

	const hideHover = () => {
		// Cancel delayed hide (e.g. when switching links quickly).
		if (hideTimeoutRef.current) {
			clearTimeout(hideTimeoutRef.current)
			hideTimeoutRef.current = null
		}

		if (recheckTimeoutRef.current) {
			clearTimeout(recheckTimeoutRef.current)
			recheckTimeoutRef.current = null
		}

		activeIndexRef.current = -1
		lastEnterYRef.current = null
		visibleRef.current = false
		setVisible(false)

		if (imgRef.current) {
			gsap.killTweensOf(imgRef.current)
			gsap.to(imgRef.current, {
				opacity: 0,
				duration: 0.2,
				ease: "power3.out",
			})
		}

		// Re-show automatically if we're still hovering a project link
		// but scroll kept the pointer over it (no mouseenter event fired).
		recheckTimeoutRef.current = window.setTimeout(() => {
			if (!lastPointer.current) return

			const { x, y } = lastPointer.current
			const el = document.elementFromPoint(x, y) as HTMLElement | null
			if (!el) return

			const closest = el.closest("[data-project-index]") as HTMLElement | null
			if (!closest) return

			const idxRaw = closest.getAttribute("data-project-index")
			const idx = idxRaw ? Number(idxRaw) : NaN
			if (!Number.isFinite(idx)) return
			if (idx < 0 || idx >= projects.length) return

			// Only re-open if we are currently hidden (avoid fighting animations)
			if (!visibleRef.current) {
				animateInFirst(projects[idx], idx, x, y)
			}
		}, 90)
	}

	useEffect(() => {
		visibleRef.current = visible
	}, [visible])

	// Some interactions (wheel/scroll) can keep the mouse "logically" over the links
	// while the content repositions, so `onMouseLeave` doesn't always fire.
	useEffect(() => {
		const onWheel = () => {
			isScrollingRef.current = true
			if (scrollEndTimeoutRef.current) clearTimeout(scrollEndTimeoutRef.current)
			scrollEndTimeoutRef.current = window.setTimeout(() => {
				isScrollingRef.current = false
			}, 130)
			hideHover()
		}
		const onScroll = () => {
			isScrollingRef.current = true
			if (scrollEndTimeoutRef.current) clearTimeout(scrollEndTimeoutRef.current)
			scrollEndTimeoutRef.current = window.setTimeout(() => {
				isScrollingRef.current = false
			}, 130)
			hideHover()
		}
		const onPointerDown = () => hideHover()

		window.addEventListener("wheel", onWheel, { passive: true })
		window.addEventListener("scroll", onScroll, {
			capture: true,
			passive: true,
		})
		window.addEventListener("pointerdown", onPointerDown)

		return () => {
			window.removeEventListener("wheel", onWheel)
			window.removeEventListener("scroll", onScroll, true)
			window.removeEventListener("pointerdown", onPointerDown)
			if (scrollEndTimeoutRef.current) clearTimeout(scrollEndTimeoutRef.current)
		}
	}, [])

	return (
		<>
			<section
				className={styles.projects}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleSectionLeave}
			>
				{projects.map((project, index) => (
					<Link
						key={project.url}
						to={project.url}
						onMouseMove={handleMouseMove}
						onMouseEnter={(e) => handleEnter(project, index, e)}
						onMouseLeave={(e) => handleLeave(index, e)}
					>
						<article data-project-index={index}>
							<ul className={styles["projects-list"]}>
								<li className={styles["project-item"]}>
									<h2>{project.name}</h2>
									<div className={styles["list-links"]}>
										<li className={styles["project-work"]}>{project.work}</li>
										<li>
											Visit
											<span className={styles["link-arrow"]}>
												<img src='/icons/arrow.svg' alt='' />
											</span>
										</li>
									</div>
								</li>
							</ul>
						</article>
					</Link>
				))}
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
