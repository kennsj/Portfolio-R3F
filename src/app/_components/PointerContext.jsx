"use client"

import React, { useEffect } from "react"
import { setPointer } from "./pointerStore"

/**
 * Listens to window pointer move so the background effect follows the cursor
 * even when hovering over text, images, and links (which use pointer-events: all).
 */
export function PointerProvider({ children }) {
	useEffect(() => {
		function handleMove(e) {
			setPointer(e.clientX, e.clientY)
		}
		window.addEventListener("pointermove", handleMove)
		return () => window.removeEventListener("pointermove", handleMove)
	}, [])

	return <>{children}</>
}
