"use client"

import { useEffect } from "react"
import { setPointer } from "./pointerStore"
import {
	activateLinkInteraction,
	clearLinkInteraction,
} from "./linkInteractionStore"

const interactiveSelector = "a[href], button"

export function PointerProvider({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		function handleMove(e: MouseEvent) {
			setPointer(e.clientX, e.clientY)
		}

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			return
		}

		let activeElement: HTMLElement | null = null
		const findInteractive = (target: EventTarget | null) =>
			target instanceof Element
				? target.closest<HTMLElement>(interactiveSelector)
				: null

		const activate = (target: EventTarget | null) => {
			const element = findInteractive(target)
			if (!element || element === activeElement) return
			activeElement = element
			activateLinkInteraction(element)
		}

		const deactivate = (relatedTarget: EventTarget | null) => {
			if (findInteractive(relatedTarget) === activeElement) return
			activeElement = null
			clearLinkInteraction()
		}

		const handlePointerOver = (event: PointerEvent) => activate(event.target)
		const handlePointerOut = (event: PointerEvent) => deactivate(event.relatedTarget)
		const handleFocusIn = (event: FocusEvent) => activate(event.target)
		const handleFocusOut = (event: FocusEvent) => deactivate(event.relatedTarget)

		window.addEventListener("pointermove", handleMove)
		document.addEventListener("pointerover", handlePointerOver)
		document.addEventListener("pointerout", handlePointerOut)
		document.addEventListener("focusin", handleFocusIn)
		document.addEventListener("focusout", handleFocusOut)

		return () => {
			window.removeEventListener("pointermove", handleMove)
			document.removeEventListener("pointerover", handlePointerOver)
			document.removeEventListener("pointerout", handlePointerOut)
			document.removeEventListener("focusin", handleFocusIn)
			document.removeEventListener("focusout", handleFocusOut)
			clearLinkInteraction()
		}
	}, [])

	return <>{children}</>
}
