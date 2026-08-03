"use client"

import { useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import Effects from "./Effects"
import { useKpIndex } from "../../hooks/useKpIndex"
import { useManualKp } from "../../hooks/KpContext"

const vertexShader = /* glsl */ `
	varying vec2 vUv;
	void main() {
		vUv = uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
`

const fragmentShader = /* glsl */ `
	precision highp float;
	varying vec2 vUv;
	uniform float uTime;
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

	vec3 makeCurtain(vec2 p, float seed, float level, float activity) {
		float drift = uTime * (0.018 + seed * 0.006);
		float broad = fbm(vec2(p.x * 1.5 + seed * 8.0 + drift, seed * 4.0 + uTime * 0.006));
		float folds = fbm(vec2(p.x * 4.0 - drift * 1.8, seed * 13.0 + uTime * 0.012));
		float arc = level + (broad - 0.5) * (0.20 + activity * 0.10);
		arc += sin(p.x * 2.3 + seed * 6.0 + uTime * 0.012) * 0.04;
		float d = p.y - arc;

		float edge = exp(-abs(d) * (42.0 - activity * 7.0));
		float veil = exp(-max(d, 0.0) * (4.6 - activity * 1.0));
		veil *= exp(-max(-d, 0.0) * 18.0);

		float rayFine = noise21(vec2(p.x * (64.0 + activity * 34.0) + folds * 7.0, seed * 29.0));
		float rayWide = smoothstep(0.32, 0.78, fbm(vec2(p.x * 9.0 + drift * 2.0, seed * 21.0)));
		float rays = mix(0.16, 1.0, pow(rayFine, 2.8) * rayWide);
		float sideFade = smoothstep(-0.08, 0.18, p.x + 0.84) * smoothstep(-0.08, 0.18, 0.84 - p.x);

		float spectralHeight = smoothstep(-0.04, 0.42, d);
		vec3 green = vec3(0.22, 1.00, 0.54);
		vec3 cyan = vec3(0.20, 0.82, 0.78);
		vec3 violet = vec3(0.62, 0.34, 1.00);
		vec3 color = mix(green, cyan, spectralHeight * 0.38);
		color = mix(color, violet, spectralHeight * smoothstep(0.66, 1.0, activity) * 0.42);

		float body = veil * rays;
		return color * (body + edge * 0.75) * sideFade;
	}

	void main() {
		vec2 p = vUv - 0.5;
		p.x *= uAspect;
		float dataActivity = clamp(uKp / 9.0, 0.0, 1.0);
		float activity = mix(0.44, 1.0, dataActivity);

		vec3 aurora = makeCurtain(p, 0.12, -0.12, activity) * 0.95;
		aurora += makeCurtain(p, 0.51, 0.04, activity) * mix(0.34, 0.84, activity);
		aurora += makeCurtain(p, 0.86, 0.20, activity) * smoothstep(0.48, 0.92, activity) * 0.62;

		float breathe = 0.92 + 0.08 * sin(uTime * 0.14 + fbm(p * 2.0) * 6.2831);
		aurora *= mix(0.48, 1.12, activity) * breathe;

		float atmosphericNoise = fbm(p * vec2(2.4, 1.5) + vec2(uTime * 0.004, 0.0));
		vec3 sky = vec3(0.0025, 0.007, 0.005);
		sky += vec3(0.006, 0.021, 0.013) * atmosphericNoise;
		vec3 color = sky + aurora;
		color = color / (1.0 + color);
		color = pow(color, vec3(0.84));

		gl_FragColor = vec4(color, 1.0);
	}
`

function Experience() {
	const viewport = useThree((state) => state.viewport)
	const materialRef = useRef()
	const { data } = useKpIndex()
	const { manualKp } = useManualKp()
	const kp = manualKp ?? data?.latest ?? 5
	const uniforms = useMemo(() => ({
		uTime: { value: 0 },
		uKp: { value: kp },
		uAspect: { value: viewport.width / viewport.height },
	}), [])

	useFrame((_, delta) => {
		const material = materialRef.current
		if (!material) return
		material.uniforms.uTime.value += Math.min(delta, 0.05)
		material.uniforms.uKp.value = THREE.MathUtils.damp(material.uniforms.uKp.value, kp, 2.2, delta)
		material.uniforms.uAspect.value = viewport.width / viewport.height
	})

	return (
		<>
			<mesh scale={[viewport.width, viewport.height, 1]}>
				<planeGeometry args={[1, 1]} />
				<shaderMaterial
					ref={materialRef}
					uniforms={uniforms}
					vertexShader={vertexShader}
					fragmentShader={fragmentShader}
					toneMapped={false}
				/>
			</mesh>
			<Effects />
		</>
	)
}

export default Experience
