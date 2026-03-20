import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { easing } from "maath"
import { isMobile } from "react-device-detect"
import { pointer } from "./pointerStore"
import { orientation } from "./orientationStore"
import { currentColor, targetColor } from "./lightStore"

export default function LightSource() {
	const light = useRef()
	const ambient = useRef()

	useFrame((state, delta) => {
		easing.dampC(currentColor, targetColor, 0.15, delta)
		light.current.color.copy(currentColor)

		if (isMobile) {
			const targetX = (orientation.gamma / 90) * 3
			const targetY = ((orientation.beta - 45) / 90) * 2

			easing.damp3(light.current.position, [targetX, targetY, 3], 0.4, delta)
		} else {
			easing.damp3(
				light.current.position,
				[
					((pointer.x / 2) * state.viewport.width) / 4,
					((pointer.y / 2) * state.viewport.height) / 4,
					1,
				],
				0.3,
				delta,
			)
		}
	})

	return (
		<>
			<directionalLight ref={light} intensity={9.2} />
			<ambientLight
				ref={ambient}
				color='#a6d59e'
				intensity={isMobile ? 4.5 : 2.5}
			/>
		</>
	)
}
