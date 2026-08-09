import { useEffect, useRef } from "react"
import gsap from "gsap"
import styles from "./Cursor.module.scss"

const Cursor = () => {
	const lensRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const lens = lensRef.current
		if (!lens) return
		if (window.matchMedia("(hover: none), (pointer: coarse), (prefers-reduced-motion: reduce)").matches) return

		const xTo = gsap.quickTo(lens, "x", { duration: 0.42, ease: "power3.out" })
		const yTo = gsap.quickTo(lens, "y", { duration: 0.42, ease: "power3.out" })
		let activeTarget: HTMLElement | null = null

		const onMove = (event: PointerEvent) => {
			xTo(event.clientX)
			yTo(event.clientY)
			if (lens.dataset.visible !== "true") {
				lens.dataset.visible = "true"
				gsap.to(lens, { autoAlpha: 1, duration: 0.22 })
			}
		}

		const onOver = (event: PointerEvent) => {
			// The lens is atmospheric by default, then contracts over interactive targets.
			const target = (event.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button, summary")
			if (!target || target === activeTarget) return
			activeTarget = target
			lens.dataset.active = "true"
			gsap.to(lens, { scale: 0.18, duration: 0.42, ease: "expo.out" })
		}

		const onOut = (event: PointerEvent) => {
			if (!activeTarget) return
			const next = event.relatedTarget as Node | null
			if (next && activeTarget.contains(next)) return
			activeTarget = null
			lens.dataset.active = "false"
			gsap.to(lens, { scale: 1, duration: 0.42, ease: "expo.out" })
		}

		const onLeave = () => gsap.to(lens, { autoAlpha: 0, duration: 0.18 })
		window.addEventListener("pointermove", onMove, { passive: true })
		document.addEventListener("pointerover", onOver)
		document.addEventListener("pointerout", onOut)
		document.addEventListener("mouseleave", onLeave)

		return () => {
			window.removeEventListener("pointermove", onMove)
			document.removeEventListener("pointerover", onOver)
			document.removeEventListener("pointerout", onOut)
			document.removeEventListener("mouseleave", onLeave)
		}
	}, [])

	return <div ref={lensRef} className={styles.lens} aria-hidden='true' data-visible='false' data-active='false' />
}

export default Cursor
