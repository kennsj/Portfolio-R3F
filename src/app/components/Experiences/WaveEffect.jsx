"use client";

import { Effect } from "postprocessing";
import { Uniform } from "three";
import { linkInteraction } from "./linkInteractionStore";
import {
  targetAuroraSpeedMultiplier,
  targetScrollSpeedMultiplier,
} from "./lightStore";

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
`;

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
    });
    this.baseAmplitude = uAmplitude;
    this.interactionStrength = 0;
    this.speedMultiplier = 1;
  }

  update(renderer, inputBuffer, deltaTime) {
    const speed = this.uniforms.get("uSpeed").value;
    const interactionRate =
      linkInteraction.strength > this.interactionStrength ? 2.6 : 1.35;
    const damping = 1 - Math.exp(-deltaTime * interactionRate);
    this.interactionStrength +=
      (linkInteraction.strength - this.interactionStrength) * damping;
    const calm = this.interactionStrength;
    const targetSpeedMultiplier =
      targetAuroraSpeedMultiplier * targetScrollSpeedMultiplier;
    const speedRate = targetSpeedMultiplier > this.speedMultiplier ? 12 : 2;
    const speedDamping = 1 - Math.exp(-deltaTime * speedRate);
    this.speedMultiplier +=
      (targetSpeedMultiplier - this.speedMultiplier) * speedDamping;

    this.uniforms.get("uAmplitude").value =
      this.baseAmplitude * (1 - calm * 0.9);
    this.uniforms.get("uOffset").value +=
      deltaTime * speed * this.speedMultiplier * (1 - calm * 0.94);
  }
}
