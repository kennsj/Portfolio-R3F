"use client"

import {
	Bloom,
	EffectComposer,
	Noise,
	Vignette,
} from "@react-three/postprocessing"
import { useRef } from "react"
import { BlendFunction } from "postprocessing"
// import { useControls } from "leva"
import { isMobile } from "react-device-detect"
import Wave from "./Wave"

const Effects = (props) => {
	const waveRef = useRef()

	// const { uFrequency, uAmplitude, uMousePos } = useControls({
	// 	uFrequency: { value: 0.92, min: 0, max: 20, step: 0.01 },
	// 	uAmplitude: { value: 0.22, min: 0, max: 1, step: 0.01 },
	// })

	// const { uFrequency, uAmplitude, uMousePos } = useControls({
	// 	uFrequency: { value: 4.66, min: 0, max: 20, step: 0.01 },
	// 	uAmplitude: { value: 0.15, min: 0, max: 1, step: 0.01 },
	// })

	// if (isMobile) {
	// 	const uFrequency = 0.92
	// 	const uAmplitude = 0.22
	// }

	return (
		<EffectComposer disableNormalPass multisampling={false}>
			<Noise premultiply blendFunction={BlendFunction.DARKEN} opacity={0.4} />
			{/* <Bloom mipmapBlur intensity={1.8} luminanceThreshold={0.9} radius={0.1} /> */}
			<Vignette offset={0.5} darkness={0.8} eskil={true} />
			<Wave
				ref={waveRef}
				// uFrequency={uFrequency}
				uFrequency={4.66}
				uAmplitude={0.15}
				uMousePos
				blendFunction={BlendFunction.MULTIPLY}
			/>
		</EffectComposer>
	)
}

export default Effects
