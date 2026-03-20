"use client"

import { useEffect, useState } from "react"
import { orientation } from "./orientationStore"

const STORAGE_KEY = "device-orientation-permission"

export default function PermissionProvider() {
	const [needed, setNeeded] = useState(false)

	useEffect(() => {
		if (
			typeof (DeviceOrientationEvent as any).requestPermission !== "function"
		) {
			// Android / older iOS — no permission needed, add listener directly
			addListener()
			return
		}

		const cached = localStorage.getItem(STORAGE_KEY)

		if (cached === "granted") {
			// iOS caches permission per-session only, must re-request on each reload
			// This runs on mount (no user gesture needed when already granted)
			;(DeviceOrientationEvent as any)
				.requestPermission()
				.then((res: string) => {
					if (res === "granted") addListener()
				})
				.catch(console.error)
			return
		}

		if (cached === "denied") return

		// First visit — show the button
		setNeeded(true)
	}, [])

	function addListener() {
		window.addEventListener(
			"deviceorientation",
			(e: DeviceOrientationEvent) => {
				orientation.gamma = e.gamma ?? 0
				orientation.beta = e.beta ?? 0
			},
		)
	}

	async function handleTap() {
		try {
			const res = await (DeviceOrientationEvent as any).requestPermission()
			localStorage.setItem(STORAGE_KEY, res)
			if (res === "granted") addListener()
		} catch (e) {
			localStorage.setItem(STORAGE_KEY, "denied")
			console.error(e)
		} finally {
			setNeeded(false)
		}
	}

	if (!needed) return null

	return (
		<button
			onClick={handleTap}
			style={{
				position: "fixed",
				bottom: 24,
				width: "75%",
				left: "50%",
				transform: "translateX(-50%)",
				zIndex: 9999,
				background: "transparent",
				border: "1px solid rgba(255,255,255,0.2)",
				color: "rgba(255,255,255,0.5)",
				fontFamily: "var(--font-mono)",
				fontSize: 11,
				letterSpacing: "0.1em",
				padding: "6px 14px",
				borderRadius: 2,
				cursor: "pointer",
			}}
		>
			Tap to enable tilt <br />
			Allows to tilt the phone to control the light
		</button>
	)
}
