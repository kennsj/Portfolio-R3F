"use client"

import React, { forwardRef } from "react"
import WaveEffect from "./WaveEffect"

export default forwardRef(function (props, ref) {
	const effect = new WaveEffect(props)
	return <primitive ref={ref} object={effect} />
})
