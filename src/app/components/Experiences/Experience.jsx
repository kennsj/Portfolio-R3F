"use client"

import { useEffect } from "react"
import { Plane, useTexture } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import * as THREE from "three"
import Effects from "./Effects"

const REF_ASPECT = 16 / 9

function Experience() {
	const viewport = useThree((state) => state.viewport)
	const displacementMap = useTexture("/textures/displacement2.png")
	const normalMap = useTexture("/textures/normal.png")

	useEffect(() => {
		const aspect = viewport.width / viewport.height
		;[displacementMap, normalMap].forEach((texture) => {
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping
			if (aspect < REF_ASPECT) {
				const uScale = aspect / REF_ASPECT
				texture.repeat.set(uScale, 1)
				texture.offset.set((1 - uScale) / 2, 0)
			} else {
				texture.repeat.set(1, 1)
				texture.offset.set(0, 0)
			}
			texture.needsUpdate = true
		})
	}, [viewport.width, viewport.height, displacementMap, normalMap])

	const isMobile = viewport.width / viewport.height < 0.75

	return (
		<mesh>
			<Effects />
			<Plane
				scale={[viewport.width, viewport.height, 1]}
				args={[1, 1, 128, 128]}
			>
				<meshPhysicalMaterial
					toneMapped={false}
					color='#191919'
					roughness={0.5}
					metalness={0.25}
					displacementMap={displacementMap}
					displacementScale={isMobile ? 0.85 : 0.51}
					normalMap={normalMap}
					normalScale={isMobile ? 0.2 : 0.1}
				/>
			</Plane>
		</mesh>
	)
}

export default Experience
