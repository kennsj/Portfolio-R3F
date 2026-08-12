"use client"

import { useEffect, useRef } from "react"
import { Plane, useTexture } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import Effects from "./Effects"
import { linkInteraction } from "./linkInteractionStore"

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
	const surfaceRef = useRef()
	const materialRef = useRef()
	const interactionStrength = useRef(0)

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
	const baseDisplacement = isMobile ? 0.85 : 0.51

	useFrame((_, delta) => {
		const surface = surfaceRef.current
		const material = materialRef.current
		if (!surface || !material) return
		const strengthRate =
			linkInteraction.strength > interactionStrength.current ? 2.4 : 1.5
		const strengthDamping = 1 - Math.exp(-delta * strengthRate)
		interactionStrength.current +=
			(linkInteraction.strength - interactionStrength.current) * strengthDamping
		const strength = interactionStrength.current
		const horizontal = linkInteraction.x * 2 - 1
		const vertical = linkInteraction.y * 2 - 1
		const transformDamping = 1 - Math.exp(-delta * 2.8)
		material.displacementScale = baseDisplacement * (1 - strength * 0.82)
		material.roughness = 0.5 + strength * 0.18

		surface.rotation.x +=
			(-vertical * 0.032 * strength - surface.rotation.x) * transformDamping
		surface.rotation.y +=
			(horizontal * 0.045 * strength - surface.rotation.y) * transformDamping
		surface.position.x +=
			(horizontal * viewport.width * 0.018 * strength - surface.position.x)
			* transformDamping
		surface.position.y +=
			(vertical * viewport.height * 0.014 * strength - surface.position.y)
			* transformDamping
		surface.position.z +=
			(0.1 * strength - surface.position.z) * transformDamping
	})

	return (
		<mesh ref={surfaceRef}>
			<SceneReadySignal onReady={onReady} />
			<Effects />
			<Plane
				scale={[viewport.width * 1.12, viewport.height * 1.12, 1]}
				args={[1, 1, 64, 64]}
			>
				<meshPhysicalMaterial
					ref={materialRef}
					toneMapped={false}
					color='#191919'
					roughness={0.5}
					metalness={0.25}
					displacementMap={displacementMap}
					displacementScale={baseDisplacement}
					normalMap={normalMap}
					normalScale={isMobile ? 0.2 : 0.1}
				/>
			</Plane>
		</mesh>
	)
}

export default Experience
