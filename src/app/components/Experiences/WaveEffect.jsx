"use client"

import { Effect } from "postprocessing"
import { Uniform } from "three"
import { linkInteraction } from "./linkInteractionStore"

const fragmentShader = /* glsl */ `
	uniform float uFrequency;
	uniform float uAmplitude;
	uniform float uOffset;

	void mainUv(inout vec2 uv) {
		uv.y += sin(uv.x * uFrequency + uOffset) * uAmplitude;
	}

	void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
		outputColor = vec4(inputColor.rgb, inputColor.a);
	}
`

export default class WaveEffect extends Effect {
	constructor({ uFrequency, uAmplitude, uSpeed = 1, blendFunction }) {
		super("WaveEffect", fragmentShader, {
			blendFunction,
			uniforms: new Map([
				["uFrequency", new Uniform(uFrequency)],
				["uAmplitude", new Uniform(uAmplitude)],
				["uOffset", new Uniform(0)],
				["uSpeed", new Uniform(uSpeed)],
			]),
		})
		this.baseAmplitude = uAmplitude
		this.interactionStrength = 0
	}

	update(renderer, inputBuffer, deltaTime) {
		const speed = this.uniforms.get("uSpeed").value
		const interactionRate =
			linkInteraction.strength > this.interactionStrength ? 2.6 : 1.35
		const damping = 1 - Math.exp(-deltaTime * interactionRate)
		this.interactionStrength +=
			(linkInteraction.strength - this.interactionStrength) * damping
		const calm = this.interactionStrength

		this.uniforms.get("uAmplitude").value =
			this.baseAmplitude * (1 - calm * 0.9)
		this.uniforms.get("uOffset").value +=
			deltaTime * speed * (1 - calm * 0.94)
	}
}
