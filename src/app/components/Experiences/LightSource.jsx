import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { easing } from "maath"
import { isMobile } from "react-device-detect"
import { pointer } from "./pointerStore"
import { orientation } from "./orientationStore"
import { targetLightColor } from "./lightStore"
import { linkInteraction } from "./linkInteractionStore"
import { Color } from "three"

export default function LightSource() {
	const light = useRef()
	const ambient = useRef()
	const cursorLight = useRef()
	const currentColor = useRef(new Color("#a6d59e"))
	const targetColor = useRef(new Color("#a6d59e"))
	const lastTargetColor = useRef(targetLightColor)
	const interactionStrength = useRef(0)

	useFrame((state, delta) => {
		if (lastTargetColor.current !== targetLightColor) {
			targetColor.current.set(targetLightColor)
			lastTargetColor.current = targetLightColor
		}
		easing.dampC(currentColor.current, targetColor.current, 0.15, delta)
		light.current.color.copy(currentColor.current)
		cursorLight.current.color.copy(currentColor.current)

		const interactionRate =
			linkInteraction.strength > interactionStrength.current ? 2.4 : 8
		const interactionDamping = 1 - Math.exp(-delta * interactionRate)
		interactionStrength.current +=
			(linkInteraction.strength - interactionStrength.current)
			* interactionDamping
		const strength = interactionStrength.current
		const targetDirectionalIntensity = 9.2 * (1 - strength * 0.985)
		light.current.intensity +=
			(targetDirectionalIntensity - light.current.intensity) * interactionDamping
		const baseAmbientIntensity = isMobile ? 4.5 : 2.5
		const targetAmbientIntensity =
			baseAmbientIntensity * (1 - strength * 0.985)
		ambient.current.intensity +=
			(targetAmbientIntensity - ambient.current.intensity) * interactionDamping
		const targetCursorIntensity = strength * 48
		cursorLight.current.intensity +=
			(targetCursorIntensity - cursorLight.current.intensity) * interactionDamping
		easing.damp3(
			cursorLight.current.position,
			[
				pointer.x * state.viewport.width * 0.5,
				pointer.y * state.viewport.height * 0.5,
				1.35,
			],
			0.12,
			delta,
		)

		if (isMobile) {
			const targetX = (orientation.gamma / 90) * 3
			const targetY = ((orientation.beta - 45) / 90) * 2
			easing.damp3(light.current.position, [targetX, targetY, 3], 0.4, delta)
		} else {
			const linkX = linkInteraction.x * 2 - 1
			const linkY = linkInteraction.y * 2 - 1
			const targetX = pointer.x * (1 - strength) + linkX * strength
			const targetY = pointer.y * (1 - strength) + linkY * strength
			const horizontalReach = state.viewport.width * (0.125 + strength * 0.19)
			const verticalReach = state.viewport.height * (0.125 + strength * 0.19)
			easing.damp3(
				light.current.position,
				[
					targetX * horizontalReach,
					targetY * verticalReach,
					1 + strength * 1.6,
				],
				0.3 - strength * 0.16,
				delta,
			)
		}
	})

	return (
		<>
			<directionalLight ref={light} intensity={9.2} />
			<ambientLight ref={ambient} color='#a6d59e' intensity={isMobile ? 4.5 : 2.5} />
			<pointLight ref={cursorLight} intensity={0} distance={3.8} decay={2} />
		</>
	)
}
