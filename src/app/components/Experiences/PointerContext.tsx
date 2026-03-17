"use client"

import { useEffect } from "react"
import { setPointer } from "./pointerStore"

export function PointerProvider({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		function handleMove(e: MouseEvent) {
			setPointer(e.clientX, e.clientY)
		}
		window.addEventListener("pointermove", handleMove)
		return () => window.removeEventListener("pointermove", handleMove)
	}, [])

	return <>{children}</>
}
