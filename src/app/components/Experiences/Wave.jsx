"use client"

import { forwardRef, useEffect, useMemo } from "react"
import WaveEffect from "./WaveEffect"

export default forwardRef(function Wave(
	{ kpSpeedMultiplier = 1, ...effectProps },
	ref,
) {
	const effect = useMemo(() => new WaveEffect(effectProps), [])
	useEffect(() => {
		effect.uniforms.get("uSpeed").value = kpSpeedMultiplier
	}, [effect, kpSpeedMultiplier])
	return <primitive ref={ref} object={effect} />
})
