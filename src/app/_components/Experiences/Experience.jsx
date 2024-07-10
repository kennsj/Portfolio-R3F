"use client"

import { Plane, useTexture } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import Effects from "./Effects"
// import { useControls } from "leva"

function Experience() {
	const viewport = useThree((state) => state.viewport)

	const displacementMap = useTexture("./textures/displacement2.png")
	const normalMap = useTexture("./textures/normal2.png")

	// const colors = useControls({
	// 	value: "green",
	// })

	return (
		<>
			<mesh>
				<Effects />
				<Plane scale={[viewport.width, viewport.height, 1]} args={[1, 1, 1, 1]}>
					<meshPhysicalMaterial
						toneMapped={false}
						// color='#333'
						color='#191919'
						roughness={0.5}
						metalness={0.25}
						displacementMap={displacementMap}
						displacementScale={0.51}
						normalMap={normalMap}
						normalScale={0.1}
					/>
				</Plane>
			</mesh>
		</>
	)
}

export default Experience
