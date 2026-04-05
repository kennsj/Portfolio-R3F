import {
	useState,
	useRef,
	useEffect,
	useCallback,
	type MouseEvent as ReactMouseEvent,
} from "react"
import gsap from "gsap"

export type PreviewItem = { name: string; image: string }

const LERP = 0.03
const FADE_IN = 1.35
const FADE_OUT = 0.42
const LEAVE_DELAY_MS = 50

function isVideoSrc(url: string) {
	return /\.(webm|mp4)(\?|$)/i.test(url)
}

type UseProjectHoverPreviewOptions = {
	/** When true, ignore hover/scroll preview updates (e.g. during page transition out). */
	interactionDisabled?: boolean
}

export function useProjectHoverPreview<T extends PreviewItem>(
	items: readonly T[],
	options: UseProjectHoverPreviewOptions = {},
) {
	const { interactionDisabled = false } = options
	const [current, setCurrent] = useState<T>(items[0])

	const shellRef = useRef<HTMLDivElement>(null)
	const imgRef = useRef<HTMLImageElement>(null)
	const videoRef = useRef<HTMLVideoElement>(null)
	/** Which layer is logically active after the last preview update (img | video). */
	const activeMediumRef = useRef<"img" | "video" | null>(null)
	const targetPos = useRef({ x: 0, y: 0 })
	const currentPos = useRef({ x: 0, y: 0 })
	const lastPointer = useRef<{ x: number; y: number } | null>(null)

	const visibleRef = useRef(false)
	/** True while opacity is tweening to 0 — blocks scroll-sync from re-opening the preview mid-fade. */
	const isFadingOutRef = useRef(false)
	const activeIndexRef = useRef(-1)
	const hideTimeoutRef = useRef<number | null>(null)
	const scrollSyncRafRef = useRef<number | null>(null)

	useEffect(() => {
		if (!interactionDisabled) return
		if (hideTimeoutRef.current) {
			clearTimeout(hideTimeoutRef.current)
			hideTimeoutRef.current = null
		}
	}, [interactionDisabled])

	useEffect(() => {
		let rafId: number
		const tick = () => {
			if (shellRef.current && visibleRef.current) {
				currentPos.current.x +=
					(targetPos.current.x - currentPos.current.x) * LERP
				currentPos.current.y +=
					(targetPos.current.y - currentPos.current.y) * LERP
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

	const fadeOutElements = useCallback(
		(elements: (HTMLElement | null | undefined)[], duration = FADE_OUT) => {
			const els = elements.filter(Boolean) as HTMLElement[]
			if (els.length === 0) return
			isFadingOutRef.current = true
			let remaining = els.length
			const onOneDone = () => {
				remaining--
				if (remaining <= 0) isFadingOutRef.current = false
			}
			for (const el of els) {
				gsap.killTweensOf(el)
				gsap.to(el, {
					opacity: 0,
					duration,
					ease: "power2.out",
					onComplete: () => {
						if (el instanceof HTMLVideoElement) el.pause()
						onOneDone()
					},
				})
			}
		},
		[],
	)

	const applyPreviewMedia = useCallback((project: T) => {
		const img = imgRef.current
		const video = videoRef.current
		const useVideo = isVideoSrc(project.image)
		const medium: "img" | "video" = useVideo ? "video" : "img"
		const prev = activeMediumRef.current

		if (prev === medium) {
			if (medium === "img" && img) {
				gsap.killTweensOf(img)
				img.src = project.image
				img.alt = project.name
				gsap.set(img, { opacity: 1 })
			}
			if (medium === "video" && video) {
				gsap.killTweensOf(video)
				video.src = project.image
				video.muted = true
				video.playsInline = true
				video.loop = true
				gsap.set(video, { opacity: 1 })
				void video.play().catch(() => {})
			}
			return
		}

		activeMediumRef.current = medium

		if (useVideo) {
			if (img) {
				gsap.killTweensOf(img)
				gsap.to(img, {
					opacity: 0,
					duration: FADE_OUT,
					ease: "power2.out",
				})
			}
			if (video) {
				gsap.killTweensOf(video)
				video.src = project.image
				video.muted = true
				video.playsInline = true
				video.loop = true
				gsap.set(video, { opacity: 0 })
				void video.play().catch(() => {})
				gsap.to(video, {
					opacity: 1,
					duration: FADE_IN,
					ease: "power2.out",
				})
			}
		} else {
			if (video) {
				gsap.killTweensOf(video)
				gsap.to(video, {
					opacity: 0,
					duration: FADE_OUT,
					ease: "power2.out",
					onComplete: () => {
						video.pause()
					},
				})
			}
			if (img) {
				gsap.killTweensOf(img)
				img.src = project.image
				img.alt = project.name
				gsap.set(img, { opacity: 0 })
				gsap.to(img, {
					opacity: 1,
					duration: FADE_IN,
					ease: "power2.out",
				})
			}
		}
	}, [])

	const showAt = useCallback(
		(project: T, index: number, x: number, y: number) => {
			isFadingOutRef.current = false
			targetPos.current = { x, y }
			currentPos.current = { x, y }
			if (shellRef.current) gsap.set(shellRef.current, { left: x, top: y })

			activeIndexRef.current = index
			visibleRef.current = true
			setCurrent(project)

			applyPreviewMedia(project)
		},
		[applyPreviewMedia],
	)

	/** Hide preview (fade out). No scroll recheck — use real mouse leave / sync. */
	const hidePreview = useCallback(() => {
		if (hideTimeoutRef.current) {
			clearTimeout(hideTimeoutRef.current)
			hideTimeoutRef.current = null
		}

		activeIndexRef.current = -1
		visibleRef.current = false
		activeMediumRef.current = null

		fadeOutElements([imgRef.current, videoRef.current])
	}, [fadeOutElements])

	/**
	 * While scrolling, the DOM under the cursor changes without mousemove/enter.
	 * Keep the preview visible when still over the same row; update image if a different row;
	 * hide only if the pointer is no longer over a project item. No fade out/in for “still hovering”.
	 */
	const syncUnderCursorAfterScroll = useCallback(() => {
		if (interactionDisabled) return
		if (!lastPointer.current) return
		const { x, y } = lastPointer.current
		const el = document.elementFromPoint(x, y) as HTMLElement | null
		if (!el) {
			if (visibleRef.current) hidePreview()
			return
		}
		const closest = el.closest("[data-project-index]") as HTMLElement | null
		if (!closest) {
			if (visibleRef.current) hidePreview()
			return
		}

		const idxRaw = closest.getAttribute("data-project-index")
		const idx = idxRaw ? Number(idxRaw) : NaN
		if (!Number.isFinite(idx) || idx < 0 || idx >= items.length) {
			if (visibleRef.current) hidePreview()
			return
		}

		targetPos.current = { x, y }

		if (!visibleRef.current) {
			if (isFadingOutRef.current) return
			showAt(items[idx], idx, x, y)
			return
		}

		if (idx === activeIndexRef.current) return

		activeIndexRef.current = idx
		setCurrent(items[idx])
		applyPreviewMedia(items[idx])
	}, [applyPreviewMedia, hidePreview, interactionDisabled, items, showAt])

	useEffect(() => {
		const scheduleSync = () => {
			if (scrollSyncRafRef.current != null) return
			scrollSyncRafRef.current = requestAnimationFrame(() => {
				scrollSyncRafRef.current = null
				syncUnderCursorAfterScroll()
			})
		}

		window.addEventListener("wheel", scheduleSync, { passive: true })
		window.addEventListener("scroll", scheduleSync, {
			capture: true,
			passive: true,
		})

		return () => {
			window.removeEventListener("wheel", scheduleSync)
			window.removeEventListener("scroll", scheduleSync, true)
			if (scrollSyncRafRef.current != null)
				cancelAnimationFrame(scrollSyncRafRef.current)
		}
	}, [syncUnderCursorAfterScroll])

	const onMouseMove = useCallback((e: ReactMouseEvent) => {
		targetPos.current = { x: e.clientX, y: e.clientY }
		lastPointer.current = { x: e.clientX, y: e.clientY }
	}, [])

	const onEnter = useCallback(
		(project: T, index: number, e: ReactMouseEvent) => {
			if (interactionDisabled) return
			if (hideTimeoutRef.current) {
				clearTimeout(hideTimeoutRef.current)
				hideTimeoutRef.current = null
			}

			if (!visibleRef.current) {
				showAt(project, index, e.clientX, e.clientY)
				return
			}

			targetPos.current = { x: e.clientX, y: e.clientY }
			if (activeIndexRef.current === index) return

			activeIndexRef.current = index
			setCurrent(project)
			applyPreviewMedia(project)
		},
		[applyPreviewMedia, interactionDisabled, showAt],
	)

	const onLeave = useCallback(
		(index: number, e: ReactMouseEvent) => {
			if (interactionDisabled) return
			const { clientX, clientY } = e
			const el = document.elementFromPoint(
				clientX,
				clientY,
			) as HTMLElement | null
			const closest = el?.closest("[data-project-index]") as HTMLElement | null
			const overProject = Boolean(closest)

			if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)

			if (!overProject) {
				lastPointer.current = null
				activeIndexRef.current = -1
				visibleRef.current = false
				activeMediumRef.current = null
				fadeOutElements([imgRef.current, videoRef.current])
				return
			}

			hideTimeoutRef.current = window.setTimeout(() => {
				if (activeIndexRef.current !== index) return
				activeIndexRef.current = -1
				if (!overProject) lastPointer.current = null
				visibleRef.current = false
				activeMediumRef.current = null
				fadeOutElements([imgRef.current, videoRef.current])
			}, LEAVE_DELAY_MS)
		},
		[fadeOutElements, interactionDisabled],
	)

	const onSectionLeave = useCallback(() => {
		if (interactionDisabled) return
		lastPointer.current = null
		if (hideTimeoutRef.current) {
			clearTimeout(hideTimeoutRef.current)
			hideTimeoutRef.current = null
		}
		hidePreview()
	}, [hidePreview, interactionDisabled])

	return {
		shellRef,
		imgRef,
		videoRef,
		currentProject: current,
		onMouseMove,
		onEnter,
		onLeave,
		onSectionLeave,
	}
}
