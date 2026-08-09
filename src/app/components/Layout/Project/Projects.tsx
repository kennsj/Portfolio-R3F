import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import gsap from "gsap"
import styles from "./Projects.module.scss"
import { usePageTransition } from "../../../hooks/usePageTransition"
import { useI18n } from "../../../hooks/useI18n"
import { setLightColor } from "../../Experiences/lightStore"

const projectData = [
	{ name: "Manshausen", work: { nb: "Design / Frontend", en: "Design / Front-end" }, description: { nb: "Digitalt konsept og frontend for et arkitektonisk øyretreat.", en: "Digital concept and front-end for an architectural island retreat." }, video: "/videos/manshausen.webm", poster: undefined, slug: "manshausen", color: "#78c69a" },
	{ name: "Verchia", work: { nb: "Visuell retning / Kode", en: "Visual direction / Code" }, description: { nb: "Visuell retning og digital opplevelse utviklet fra konsept til kode.", en: "Visual direction and a digital experience developed from concept to code." }, video: "/videos/verchia.webm", poster: "/images/verchia.webp", slug: "verchia", color: "#b6a6ee" },
	{ name: "Pradelna", work: { nb: "Frontendutvikling", en: "Front-end development" }, description: { nb: "Frontendimplementasjon med fokus på typografi, rytme og responsivitet.", en: "Front-end implementation focused on type, rhythm, and responsiveness." }, video: "/videos/pradelna.webm", poster: "/images/pradelna.webp", slug: "pradelna", color: "#e2cf9d" },
	{ name: "Dialog eXe", work: { nb: "UX / UI", en: "UX / UI" }, description: { nb: "UX- og UI-arbeid for et tydeligere og mer effektivt digitalt produkt.", en: "UX and UI work for a clearer, more efficient digital product." }, video: "/videos/dx.webm", poster: "/images/dx-kino.webp", slug: "dialog-exe", color: "#8bb8dc" },
] as const

const Projects = () => {
	const { locale } = useI18n()
	const { transitionTo } = usePageTransition()
	const [activeIndex, setActiveIndex] = useState<number | null>(null)
	const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)
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

	const reveal = useCallback((index: number, clientX?: number, clientY?: number) => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
		if (concealTimerRef.current !== null) {
			window.clearTimeout(concealTimerRef.current)
			concealTimerRef.current = null
		}

		setActiveIndex(index)
		setLightColor(projectData[index].color)
		const preview = previewRef.current
		const revealFrame = previewRevealRef.current
		const media = previewMediaRef.current
		if (!preview || !revealFrame || !media) return
		const previousIndex = currentIndexRef.current
		const nextVideo = videoRefs.current[index]
		if (nextVideo) void nextVideo.play().catch(() => undefined)

		const x = clientX ?? window.innerWidth * .64
		const y = clientY ?? window.innerHeight * .52
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
			gsap.timeline({ defaults: { duration: .6, ease: "shiftReveal" } })
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
				{ scaleY: 1, duration: .8, ease: "shiftReveal" },
			)
			.to(media, { scale: 1.2, duration: 1.6, ease: "power2.out" }, 0)
	}, [])

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
				duration: .6,
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
		gsap.to(preview, { x, y, duration: .58, ease: "power3.out", overwrite: "auto" })
	}, [activeIndex])

	useEffect(() => {
		if (activeIndex === null) return
		const onPointerMove = (event: PointerEvent) => follow(event)
		window.addEventListener("pointermove", onPointerMove, { passive: true })
		return () => window.removeEventListener("pointermove", onPointerMove)
	}, [activeIndex, follow])

	return (
		<>
			<section className={styles.section} id='work' data-aurora-state data-aurora-presence='.42' data-aurora-color={activeIndex === null ? '#78c69a' : projectData[activeIndex].color}>
				<div className={styles.heading}><span>{locale === "nb" ? "Utvalgte arbeider" : "Selected work"}</span><span>( 01—04 )</span></div>
				<ol className={styles.index} onPointerLeave={conceal} onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && conceal()}>
					{projectData.map((project, index) => (
						<li key={project.slug}>
							<a
								href={`/project/${project.slug}`}
								onPointerEnter={(event) => event.pointerType !== 'touch' && reveal(index, event.clientX, event.clientY)}
								onFocus={() => reveal(index)}
								onClick={(event) => { event.preventDefault(); transitionTo(`/project/${project.slug}`) }}
								data-cursor='explore'
							>
								<span>{String(index + 1).padStart(2, "0")}</span>
								<strong>{project.name}</strong>
								<div className={styles.details}>
									<i>{project.work[locale]}</i>
									<p>{project.description[locale]}</p>
									<span>{locale === "nb" ? "Se prosjekt" : "View project"} ↗</span>
								</div>
							</a>
						</li>
					))}
				</ol>
			</section>

			{portalRoot ? createPortal(
				<div ref={previewRef} className={styles.hoverPreview} aria-hidden='true'>
					<div ref={previewRevealRef} className={styles.previewReveal}>
						<div ref={previewMediaRef} className={styles.previewMedia}>
							{projectData.map((project, index) => (
								<video
									key={project.video}
									ref={(node) => { videoRefs.current[index] = node }}
									src={project.video}
									poster={project.poster}
									muted
									loop
									playsInline
									preload='auto'
								/>
							))}
						</div>
					</div>
				</div>,
				portalRoot,
			) : null}
		</>
	)
}

export default Projects
