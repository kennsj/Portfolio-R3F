"use client"

import { useEffect, useRef } from "react"
import { Plane, useTexture } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import Effects from "./Effects"

const REF_ASPECT = 16 / 9

function SceneReadySignal({ onReady }) {
	const hasRendered = useRef(false)
	const { gl } = useThree()

	useFrame((state) => {
		if (!hasRendered.current && gl && state.scene.children.length > 0) {
			hasRendered.current = true
			onReady()
		}
	})

	return null
}

function Experience({ onReady }) {
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
			<SceneReadySignal onReady={onReady} />
			<Effects />
			<Plane
				scale={[viewport.width, viewport.height, 1]}
				args={[1, 1, 64, 64]}
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
