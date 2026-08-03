import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import styles from "./Projects.module.scss"
import HeadingAnimation from "../../UI/HeadingAnimation/HeadingAnimation"
import { usePageTransition } from "../../../hooks/usePageTransition"
import { useI18n } from "../../../hooks/useI18n"
import { setLightColor } from "../../Experiences/lightStore"

gsap.registerPlugin(ScrollTrigger)

const Projects = () => {
	const { locale, t } = useI18n()
	const { transitionTo } = usePageTransition()
	const [activeIndex, setActiveIndex] = useState<number | null>(null)
	const [locked, setLocked] = useState(false)
	const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)
	const listRef = useRef<HTMLUListElement>(null)
	const previewRef = useRef<HTMLDivElement>(null)
	const previewRevealRef = useRef<HTMLDivElement>(null)
	const previewMediaRef = useRef<HTMLDivElement>(null)
	const videoRefs = useRef<Array<HTMLVideoElement | null>>([])
	const currentIndexRef = useRef<number | null>(null)
	const previewOpenRef = useRef(false)
	const concealTimerRef = useRef<number | null>(null)
	const pointerRef = useRef({ x: 0, y: 0 })

	useEffect(() => setPortalRoot(document.body), [])
	useEffect(() => () => {
		if (concealTimerRef.current !== null) window.clearTimeout(concealTimerRef.current)
	}, [])

	useEffect(() => {
		if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
		document.querySelectorAll<HTMLVideoElement>("#work video").forEach((video) => video.pause())
	}, [])

	const projects = [
		{ name: "Manshausen", work: locale === "nb" ? "Personlig prosjekt" : "Personal project", image: "/videos/manshausen.webm", poster: "/images/kenneth-aurora.jpg", url: "/manshausen", type: "Redesign", color: "#78c69a" },
		{ name: "Verchia", work: locale === "nb" ? "Design / Kode" : "Design / Code", image: "/videos/verchia.webm", poster: "/images/verchia.webp", url: "/verchia", type: "Live", color: "#b6a6ee" },
		{ name: "Pradelna", work: locale === "nb" ? "Kode" : "Code", image: "/videos/pradelna.webm", poster: "/images/pradelna.webp", url: "/pradelna", type: "Live", color: "#e2cf9d" },
		{ name: "Dialog eXe", work: "UX / UI", image: "/videos/dx.webm", poster: "/images/dx-kino.webp", url: "/dialog-exe", type: "Case study", color: "#8bb8dc" },
	] as const

	useGSAP(() => {
		if (!listRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
		Array.from(listRef.current.children).forEach((row) => {
			const title = row.querySelector<HTMLElement>("strong")
			const number = row.querySelector(`.${styles.number}`)
			const rule = row.querySelector<HTMLElement>("[data-project-rule]")
			if (!title) return
			const timeline = gsap.timeline({
				scrollTrigger: { trigger: row, start: "top 88%", once: true },
			})
			timeline
				.fromTo(title,
					{ yPercent: 135, rotationX: -82, skewY: 2.5, transformPerspective: 1000, transformOrigin: "50% 100%" },
					{ yPercent: 0, rotationX: 0, skewY: 0, transformPerspective: 1000, transformOrigin: "50% 100%", duration: 0.8, ease: "shiftReveal" },
				)
				.from(number, { yPercent: 110, autoAlpha: 0, duration: 0.8, ease: "shiftReveal" }, 0.1)
				.from(rule, { scaleX: 0, transformOrigin: "left center", duration: 2, ease: "shiftRule" }, 0.12)
		})
	}, { scope: listRef })

	const reveal = useCallback((index: number, clientX?: number, clientY?: number) => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
		if (concealTimerRef.current !== null) {
			window.clearTimeout(concealTimerRef.current)
			concealTimerRef.current = null
		}
		setActiveIndex(index)
		setLightColor(projects[index].color)
		const preview = previewRef.current
		const revealFrame = previewRevealRef.current
		const media = previewMediaRef.current
		if (!preview || !revealFrame || !media) return
		const previousIndex = currentIndexRef.current
		const nextVideo = videoRefs.current[index]
		if (nextVideo) void nextVideo.play().catch(() => undefined)
		const x = clientX ?? window.innerWidth * 0.64
		const y = clientY ?? window.innerHeight * 0.52
		pointerRef.current = { x, y }
		gsap.set(preview, { x, y, autoAlpha: 1 })
		if (previewOpenRef.current && previousIndex === index) {
			gsap.killTweensOf(revealFrame)
			gsap.set(revealFrame, { scaleY: 1 })
			return
		}

		if (previewOpenRef.current && previousIndex !== null && previousIndex !== index) {
			const previousVideo = videoRefs.current[previousIndex]
			const travel = index > previousIndex ? 100 : -100
			gsap.killTweensOf([revealFrame, previousVideo, nextVideo])
			gsap.set(revealFrame, { scaleY: 1 })
			gsap.set(nextVideo, { autoAlpha: 1, yPercent: -travel })
			gsap.timeline({ defaults: { duration: 0.6, ease: "shiftReveal" } })
				.to(previousVideo, { yPercent: travel }, 0)
				.to(nextVideo, { yPercent: 0 }, 0)
				.set(previousVideo, { autoAlpha: 0, yPercent: 0 })
				.call(() => previousVideo?.pause())
			currentIndexRef.current = index
			return
		}

		videoRefs.current.forEach((video, videoIndex) => {
			if (!video) return
			gsap.set(video, { autoAlpha: videoIndex === index ? 1 : 0, yPercent: 0 })
			if (videoIndex !== index) video.pause()
		})
		currentIndexRef.current = index
		previewOpenRef.current = true
		gsap.killTweensOf([revealFrame, media])
		gsap.set(media, { yPercent: 0, scale: 1.6 })
		gsap.timeline()
			.fromTo(revealFrame,
				{ scaleY: 0, transformOrigin: "bottom" },
				{ scaleY: 1, duration: 0.8, ease: "shiftReveal" },
			)
			.to(media, { scale: 1.2, duration: 1.6, ease: "power2.out" }, 0)
	}, [projects])

	const hardDismiss = useCallback(() => {
		if (concealTimerRef.current !== null) {
			window.clearTimeout(concealTimerRef.current)
			concealTimerRef.current = null
		}

		const preview = previewRef.current
		const revealFrame = previewRevealRef.current
		const media = previewMediaRef.current
		gsap.killTweensOf([preview, revealFrame, media, ...videoRefs.current])
		if (preview) gsap.set(preview, { autoAlpha: 0, scale: 1, filter: "none" })
		if (revealFrame) gsap.set(revealFrame, { scaleY: 0, transformOrigin: "top" })

		videoRefs.current.forEach((video) => video?.pause())
		previewOpenRef.current = false
		currentIndexRef.current = null
		setActiveIndex(null)
		setLightColor("#7fbc98")
	}, [])

	useEffect(() => {
		if (activeIndex === null) return

		let scrollFrame: number | null = null
		const reconcileHoverAfterScroll = () => {
			if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame)
			scrollFrame = window.requestAnimationFrame(() => {
				scrollFrame = null
				const { x, y } = pointerRef.current
				const pointedRow = document.elementFromPoint(x, y)?.closest<HTMLElement>(`.${styles.projectRow}`)
				const focusedRow = document.activeElement?.closest<HTMLElement>(`.${styles.projectRow}`)
				const activeRow = pointedRow ?? focusedRow

				if (!activeRow) {
					hardDismiss()
					return
				}

				const nextIndex = Number(activeRow.dataset.projectIndex)
				if (Number.isInteger(nextIndex)) reveal(nextIndex, x, y)
			})
		}
		const dismissWhenHidden = () => {
			if (document.hidden) hardDismiss()
		}

		window.addEventListener("scroll", reconcileHoverAfterScroll, { passive: true })
		window.addEventListener("blur", hardDismiss)
		document.addEventListener("mouseleave", hardDismiss)
		document.addEventListener("visibilitychange", dismissWhenHidden)

		return () => {
			if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame)
			window.removeEventListener("scroll", reconcileHoverAfterScroll)
			window.removeEventListener("blur", hardDismiss)
			document.removeEventListener("mouseleave", hardDismiss)
			document.removeEventListener("visibilitychange", dismissWhenHidden)
		}
	}, [activeIndex, hardDismiss, reveal])

	const conceal = useCallback(() => {
		if (concealTimerRef.current !== null) window.clearTimeout(concealTimerRef.current)
		concealTimerRef.current = window.setTimeout(() => {
			setLightColor("#7fbc98")
			const preview = previewRef.current
			const revealFrame = previewRevealRef.current
			if (!preview || !revealFrame) return
			gsap.to(revealFrame, {
				scaleY: 0,
				transformOrigin: "top",
				duration: 0.6,
				ease: "shiftReveal",
				onComplete: () => {
					gsap.set(preview, { autoAlpha: 0 })
					videoRefs.current.forEach((video) => video?.pause())
					previewOpenRef.current = false
					currentIndexRef.current = null
					setActiveIndex(null)
				},
			})
		}, 90)
	}, [])

	const follow = useCallback((event: Pick<PointerEvent, "clientX" | "clientY">) => {
		pointerRef.current = { x: event.clientX, y: event.clientY }
		const preview = previewRef.current
		if (!preview || activeIndex === null) return
		const halfWidth = preview.offsetWidth / 2
		const halfHeight = preview.offsetHeight / 2
		const x = gsap.utils.clamp(halfWidth + 16, window.innerWidth - halfWidth - 16, event.clientX)
		const y = gsap.utils.clamp(halfHeight + 16, window.innerHeight - halfHeight - 16, event.clientY)
		gsap.to(preview, { x, y, duration: 0.58, ease: "power3.out", overwrite: "auto" })
	}, [activeIndex])

	useEffect(() => {
		if (activeIndex === null) return
		const onPointerMove = (event: PointerEvent) => follow(event)
		window.addEventListener("pointermove", onPointerMove, { passive: true })
		return () => window.removeEventListener("pointermove", onPointerMove)
	}, [activeIndex, follow])

	const navigate = (url: string) => {
		setLocked(true)
		gsap.to(previewRef.current, { scale: 1.08, filter: "blur(12px)", autoAlpha: 0, duration: 0.38, ease: "power2.inOut" })
		transitionTo(`/project${url}`)
	}

	return (
		<section className={styles.section} id='work' data-aurora-state data-aurora-presence='0.58' data-aurora-color='#7fbc98'>
			<div className={styles.projectsWrapper}>
				<header className={styles.sectionHeading}>
					<HeadingAnimation level={3} className={styles.featureLabel}>
						<span>{t.projectsTitle}</span>
						<span>{locale === "nb" ? "og eksperimenter" : "and experiments"}</span>
					</HeadingAnimation>
					<a href='#project-list'>{locale === "nb" ? "Se alle prosjekter" : "View all projects"}</a>
				</header>

				<ul id='project-list' ref={listRef} className={`${styles.projectsList} ${locked ? styles.locked : ""}`}>
					{projects.map((project, index) => (
						<li key={project.url}>
							<button
								type='button'
								className={styles.projectRow}
								onClick={() => navigate(project.url)}
								onMouseEnter={(event) => reveal(index, event.clientX, event.clientY)}
								onMouseLeave={conceal}
								onFocus={() => reveal(index)}
								onBlur={conceal}
								data-cursor='view'
								data-project-index={index}
								aria-label={`${project.name}: ${project.work}`}
							>
								<span className={styles.number}><span className={styles.numberText}>( {String(index + 1).padStart(2, "0")} )</span></span>
								<span className={styles.titleMask}><strong>{project.name}</strong></span>
							</button>
							<span className={styles.projectRule} data-project-rule aria-hidden='true' />
							<div className={styles.mobileMedia}>
								<video src={project.image} poster={project.poster} autoPlay muted loop playsInline preload='metadata' aria-hidden='true' />
							</div>
						</li>
					))}
				</ul>
			</div>

			{portalRoot ? createPortal(<div ref={previewRef} className={styles.hoverPreview} aria-hidden='true'>
				<div ref={previewRevealRef} className={styles.previewReveal}>
				<div ref={previewMediaRef} className={styles.previewMedia}>
					{projects.map((project, index) => (
						<video
							key={project.image}
							ref={(node) => { videoRefs.current[index] = node }}
							src={project.image}
							poster={project.poster}
							muted
							loop
							playsInline
							preload='metadata'
						/>
					))}
				</div>
				{activeIndex !== null ? <span>{String(activeIndex + 1).padStart(2, "0")} / {projects[activeIndex].name}</span> : null}
				</div>
			</div>, portalRoot) : null}
		</section>
	)
}

export default Projects
