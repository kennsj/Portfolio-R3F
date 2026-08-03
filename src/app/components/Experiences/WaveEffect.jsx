"use client"

import { Effect } from "postprocessing"
import { Uniform } from "three"

const fragmentShader = /* glsl */ `
	uniform float uTime;
	uniform float uSpeed;
	uniform float uKp;
	uniform float uAspect;

	float hash21(vec2 p) {
		p = fract(p * vec2(123.34, 456.21));
		p += dot(p, p + 45.32);
		return fract(p.x * p.y);
	}

	float noise21(vec2 p) {
		vec2 i = floor(p);
		vec2 f = fract(p);
		f = f * f * (3.0 - 2.0 * f);
		return mix(
			mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
			mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0)), f.x),
			f.y
		);
	}

	float fbm(vec2 p) {
		float value = 0.0;
		float amplitude = 0.5;
		mat2 rotation = mat2(0.80, 0.60, -0.60, 0.80);
		for (int i = 0; i < 5; i++) {
			value += amplitude * noise21(p);
			p = rotation * p * 2.03 + 17.17;
			amplitude *= 0.5;
		}
		return value;
	}

	float curtain(vec2 p, float seed, float level, float activity, out float edgeGlow) {
		float drift = uTime * (0.022 + seed * 0.004);
		float broad = fbm(vec2(p.x * 1.25 + seed * 7.1 + drift, seed + uTime * 0.009));
		float detail = fbm(vec2(p.x * 3.4 - drift * 1.7, seed * 11.0 + uTime * 0.018));
		float arc = level + (broad - 0.5) * (0.24 + activity * 0.07) + sin(p.x * 2.2 + seed * 5.0 + uTime * 0.015) * 0.035;
		float distanceToArc = p.y - arc;

		// A crisp lower edge with translucent light trailing upward.
		edgeGlow = exp(-abs(distanceToArc) * (48.0 - activity * 8.0));
		float upwardVeil = exp(-max(distanceToArc, 0.0) * (5.4 - activity * 1.3));
		float lowerFade = exp(-max(-distanceToArc, 0.0) * 20.0);

		// Thin vertical rays are broken up with a slower envelope, avoiding a barcode look.
		float rayNoise = noise21(vec2(p.x * (48.0 + activity * 26.0) + detail * 5.0, seed * 31.0 + floor(uTime * 0.18)));
		float rayEnvelope = smoothstep(0.28, 0.82, fbm(vec2(p.x * 8.0 + drift * 2.0, seed * 19.0)));
		float rays = pow(rayNoise, 3.2) * rayEnvelope;
		float verticalStructure = mix(0.32, 1.0, rays);

		float horizontalFade = smoothstep(-0.12, 0.12, p.x + 0.58) * smoothstep(-0.12, 0.12, 0.68 - p.x);
		return (edgeGlow * 0.72 + upwardVeil * lowerFade * verticalStructure) * horizontalFade;
	}

	void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
		vec2 p = uv - 0.5;
		p.x *= uAspect;
		float dataActivity = clamp(uKp / 9.0, 0.0, 1.0);
		// The portfolio always keeps a visible aurora. Live KP modulates the show,
		// but does not reduce the signature background to an imperceptible trace.
		float activity = mix(0.42, 1.0, dataActivity);

		float edgeA;
		float edgeB;
		float edgeC;
		float bandA = curtain(p, 0.17, 0.02, activity, edgeA);
		float bandB = curtain(p, 0.53, 0.14, activity, edgeB);
		float bandC = curtain(p, 0.89, -0.10, activity, edgeC);

		float secondBand = smoothstep(0.38, 0.62, activity);
		float thirdBand = smoothstep(0.66, 0.92, activity);
		float aurora = bandA * 1.25 + bandB * secondBand * 0.92 + bandC * thirdBand * 0.68;

		vec3 green = vec3(0.35, 1.0, 0.61);
		vec3 cyan = vec3(0.28, 0.90, 0.82);
		vec3 violet = vec3(0.60, 0.38, 1.0);
		float spectralShift = clamp((p.y + 0.08) * 1.7, 0.0, 1.0);
		vec3 auroraColor = mix(green, cyan, spectralShift * 0.42);
		auroraColor = mix(auroraColor, violet, smoothstep(0.68, 1.0, activity) * spectralShift * 0.32);

		float brightness = mix(0.46, 1.18, smoothstep(0.42, 1.0, activity));
		float breathing = 0.92 + 0.08 * sin(uTime * 0.16 + fbm(p * 2.0) * 6.2831);
		vec3 light = auroraColor * aurora * brightness * breathing;
		light += green * (edgeA + edgeB * secondBand + edgeC * thirdBand) * brightness * 0.28;

		// Screen-like compositing retains shadow detail without flattening the black field.
		vec3 composited = 1.0 - (1.0 - inputColor.rgb) * (1.0 - clamp(light, 0.0, 0.92));
		outputColor = vec4(composited, inputColor.a);
	}
`

export default class WaveEffect extends Effect {
	constructor({
		uSpeed = 1,
		uKp = 5,
		blendFunction,
	}) {
		super("WaveEffect", fragmentShader, {
			blendFunction,
			uniforms: new Map([
				["uTime", new Uniform(0)],
				["uSpeed", new Uniform(uSpeed)],
				["uKp", new Uniform(uKp)],
				["uAspect", new Uniform(1)],
			]),
		})
	}

	update(renderer, inputBuffer, deltaTime) {
		const speed = this.uniforms.get("uSpeed").value
		this.uniforms.get("uTime").value += deltaTime * speed
		const width = inputBuffer?.width || renderer.domElement.width || 1
		const height = inputBuffer?.height || renderer.domElement.height || 1
		this.uniforms.get("uAspect").value = width / height
	}
}
