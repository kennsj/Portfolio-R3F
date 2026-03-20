"use client"

import { forwardRef, useMemo } from "react"
import WaveEffect from "./WaveEffect"

export default forwardRef(function Wave(props, ref) {
	const effect = useMemo(() => new WaveEffect(props), [])
	return <primitive ref={ref} object={effect} />
})
