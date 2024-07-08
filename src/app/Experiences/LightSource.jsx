"use client"

import React, { useRef, useEffect, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { easing } from "maath"
import { isMobile } from "react-device-detect"

export default function LightSource() {
	const [colors, setColors] = useState([
		"black",
		"red",
		"red",
		"hotpink",
		"#a6d59e",
		"#a6d59e",
		"blue",
		"blue",
	])
	const light = useRef()
	const light5 = useRef()

	useFrame((state, delta) => {
		easing.dampC(light.current.color, colors[4], 0.05, delta)

		easing.dampC(light5.current.color, colors[0], 0.05, delta)

		if (isMobile) {
			light.current.position.set(-2, Math.sin(state.clock.elapsedTime), 1)
		} else {
			easing.damp3(
				light.current.position,
				[
					((state.pointer.x / 2) * state.viewport.width) / 4,
					((state.pointer.y / 2) * state.viewport.height) / 4,
					1,
				],
				0.3,
				delta
			)
		}
	})

	return (
		<>
			<directionalLight ref={light} intensity={9.2} />

			<ambientLight color={"#a6d59e"} ref={light5} intensity={2.5} />
		</>
	)
}
