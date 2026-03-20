import { useEffect, useRef, useState } from "react"
import styles from "./Cursor.module.scss"
import gsap from "gsap"

type CursorLabel = "Visit" | "View" | "Open" | null

const Cursor = () => {
	const dotRef = useRef<HTMLDivElement>(null)
	const ringRef = useRef<HTMLDivElement>(null)
	const labelRef = useRef<HTMLDivElement>(null)
	const pos = useRef({ x: 0, y: 0 })
	const [label, setLabel] = useState<CursorLabel>(null)

	useEffect(() => {
		const onLeaveWindow = () => {
			gsap.to([dotRef.current, ringRef.current], { opacity: 0, duration: 0.2 })
		}
		const onEnterWindow = () => {
			gsap.to([dotRef.current, ringRef.current], { opacity: 1, duration: 0.2 })
		}
		document.addEventListener("mouseleave", onLeaveWindow)
		document.addEventListener("mouseenter", onEnterWindow)
		return () => {
			document.removeEventListener("mouseleave", onLeaveWindow)
			document.removeEventListener("mouseenter", onEnterWindow)
		}
	}, [])

	useEffect(() => {
		const dot = dotRef.current
		const ring = ringRef.current

		// Raw mouse follow
		const onMove = (e: MouseEvent) => {
			pos.current = { x: e.clientX, y: e.clientY }
			gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0 })
			gsap.to(ring, {
				x: e.clientX,
				y: e.clientY,
				duration: 0.15,
				ease: "power2.out",
			})
		}

		// Magnetic pull
		const onEnter = (e: MouseEvent) => {
			const target = e.currentTarget as HTMLElement
			const rect = target.getBoundingClientRect()
			const cx = rect.left + rect.width / 2
			const cy = rect.top + rect.height / 2

			// Determine label
			const dataCursor = target.dataset.cursor
			const isBlank = target.getAttribute("target") === "_blank"
			const isAnchor = target.tagName === "A" || target.closest("a")

			if (dataCursor === "view") setLabel("View")
			else if (isBlank) setLabel("Visit")
			else if (isAnchor) setLabel("Open")
			else setLabel("Open")

			gsap.to(ring, {
				x: cx,
				y: cy,
				width: 80,
				height: 80,
				duration: 0.3,
				ease: "power2.out",
			})
			gsap.to(dot, { opacity: 0, duration: 0.2 })
		}

		const onLeave = () => {
			setLabel(null)
			gsap.to(ring, {
				width: 40,
				height: 40,
				duration: 0.3,
				ease: "power2.out",
			})
			gsap.to(dot, { opacity: 1, duration: 0.2 })
		}

		window.addEventListener("mousemove", onMove)

		const attachListeners = () => {
			const targets = document.querySelectorAll<HTMLElement>(
				"a, button, [data-cursor]",
			)
			targets.forEach((el) => {
				el.addEventListener("mouseenter", onEnter)
				el.addEventListener("mouseleave", onLeave)
			})
		}

		attachListeners()

		// Re-attach on DOM changes (route changes)
		const observer = new MutationObserver(attachListeners)
		observer.observe(document.body, { childList: true, subtree: true })

		return () => {
			window.removeEventListener("mousemove", onMove)
			observer.disconnect()
		}
	}, [])

	return (
		<>
			<div ref={dotRef} className={styles.dot} />
			<div ref={ringRef} className={styles.ring}>
				{label && (
					<div ref={labelRef} className={styles.label}>
						{label}
					</div>
				)}
			</div>
		</>
	)
}

export default Cursor
