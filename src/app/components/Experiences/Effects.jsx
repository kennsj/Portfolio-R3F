"use client"

import { EffectComposer, Noise, Vignette } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import { getKpWaveSpeedMultiplier, useKpIndex } from "../../hooks/useKpIndex"
import { useManualKp } from "../../hooks/KpContext"
import Wave from "./Wave"

const Effects = () => {
	const { data } = useKpIndex()
	const { manualKp } = useManualKp()
	const kp = manualKp ?? data?.latest ?? 5

	return (
		<EffectComposer disableNormalPass multisampling={false}>
			<Noise premultiply blendFunction={BlendFunction.DARKEN} opacity={0.4} />
			<Vignette offset={0.2} darkness={0.8} eskil={true} />
			<Wave
				kpSpeedMultiplier={getKpWaveSpeedMultiplier(kp)}
				uFrequency={4.66}
				uAmplitude={0.15}
				blendFunction={BlendFunction.MULTIPLY}
			/>
		</EffectComposer>
	)
}

export default Effects
