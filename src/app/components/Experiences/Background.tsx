// import Experience from "./Experiences/Experience"
import Experience from "./Experience"
import { Canvas } from "@react-three/fiber"
import LightSource from "./LightSource"
import { useEffect, useState } from "react"
import { setScrollSpeedMultiplier } from "./lightStore"

const Background = ({ onReady }: { onReady: () => void }) => {
	const [visible, setVisible] = useState(() => document.visibilityState === "visible")
	const [sceneReady, setSceneReady] = useState(false)

	useEffect(() => {
		const onVisibilityChange = () => setVisible(document.visibilityState === "visible")
		document.addEventListener("visibilitychange", onVisibilityChange)
		return () => document.removeEventListener("visibilitychange", onVisibilityChange)
	}, [])

	useEffect(() => {
		let previousScrollY = window.scrollY
		let previousTime = performance.now()
		let resetTimer: number | undefined

		const onScroll = () => {
			const currentTime = performance.now()
			const elapsed = Math.max(currentTime - previousTime, 16)
			const velocity = Math.abs(window.scrollY - previousScrollY) / elapsed

			setScrollSpeedMultiplier(1 + Math.min(0.8, velocity * 0.22))
			previousScrollY = window.scrollY
			previousTime = currentTime

			window.clearTimeout(resetTimer)
			resetTimer = window.setTimeout(() => setScrollSpeedMultiplier(1), 90)
		}

		window.addEventListener("scroll", onScroll, { passive: true })

		return () => {
			window.removeEventListener("scroll", onScroll)
			window.clearTimeout(resetTimer)
			setScrollSpeedMultiplier(1)
		}
	}, [])

	const handleReady = () => {
		setSceneReady(true)
		onReady()
	}

	return (
		<div>
			<div id='canvas' style={{ opacity: sceneReady ? 1 : 0, transition: "opacity 1.5s ease" }}>
				<Canvas
					frameloop={visible ? "always" : "never"}
					dpr={[1, 1.5]}
					gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}
					performance={{ min: 0.55, max: 1, debounce: 240 }}
					style={{ width: "100%", height: "100%", display: "block" }}
				>
					<LightSource />
					<Experience onReady={handleReady} />
					{/* <Preload all /> */}
				</Canvas>
			</div>
		</div>
	)
}

export default Background

// const Background = memo(() => {
//   return (
//     <Canvas>
//       {/* your scene */}
//     </Canvas>
//   )
// })

// export default Background
