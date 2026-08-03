"use client"

import { EffectComposer, Noise, Vignette } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
const Effects = () => {
	return (
		<EffectComposer disableNormalPass multisampling={false}>
			<Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.08} />
			<Vignette offset={0.28} darkness={0.48} eskil={true} />
		</EffectComposer>
	)
}

export default Effects
