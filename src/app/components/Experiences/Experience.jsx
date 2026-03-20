"use client"

import { useEffect } from "react"
import { Plane, useTexture } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import * as THREE from "three"
import Effects from "./Effects"
// import { useControls } from "leva"

// Reference aspect ratio the textures were designed for (landscape/desktop)
const REF_ASPECT = 16 / 9

function Experience() {
	const viewport = useThree((state) => state.viewport)

	const displacementMap = useTexture("/textures/displacement2.png")
	const normalMap = useTexture("/textures/normal.png")

	// const colors = useControls({
	// 	value: "green",
	// })

	// Fix UV stretching — remap texture repeat to match current viewport aspect
	// vs. the reference aspect the textures were authored for
	useEffect(() => {
		const aspect = viewport.width / viewport.height

		;[displacementMap, normalMap].forEach((tex) => {
			tex.wrapS = tex.wrapT = THREE.RepeatWrapping

			if (aspect < REF_ASPECT) {
				// Portrait / narrow viewport — texture would stretch horizontally.
				// Shrink the U repeat so it stays proportional, offset to center.
				const uScale = aspect / REF_ASPECT
				tex.repeat.set(uScale, 1)
				tex.offset.set((1 - uScale) / 2, 0)
			} else {
				// Landscape / wider than reference — reset to full coverage
				tex.repeat.set(1, 1)
				tex.offset.set(0, 0)
			}

			tex.needsUpdate = true
		})
	}, [viewport.width, viewport.height, displacementMap, normalMap])

	// R3F viewport units: a typical phone in portrait is roughly 3–5 units wide
	// Log viewport.width on your device to dial this threshold in precisely
	const isMobile = viewport.width / viewport.height < 0.75

	return (
		<>
			<mesh>
				<Effects />
				{/*
				 * Segment count bumped from 1×1 → 128×128 so displacement actually
				 * deforms the geometry instead of being a flat normal-map trick.
				 * Drop to 64×64 if you see perf issues on low-end mobile.
				 */}
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
						// More dramatic displacement on portrait so the aurora reads
						// at the narrower slice visible on phone screens
						displacementScale={isMobile ? 0.85 : 0.51}
						normalMap={normalMap}
						// Stronger normal contribution on mobile to compensate for
						// the reduced light-catch area
						normalScale={isMobile ? 0.2 : 0.1}
					/>
				</Plane>
			</mesh>
		</>
	)
}

export default Experience
