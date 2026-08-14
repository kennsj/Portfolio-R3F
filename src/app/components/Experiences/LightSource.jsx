import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { isMobile } from "react-device-detect";
import { pointer } from "./pointerStore";
import { orientation } from "./orientationStore";
import {
  targetAmbientIntensity as sceneAmbientIntensity,
  targetDirectionalIntensity as sceneDirectionalIntensity,
  targetLightColor,
  targetTransitionLightSurge,
} from "./lightStore";
import { linkInteraction } from "./linkInteractionStore";
import { Color } from "three";

export default function LightSource() {
  const light = useRef();
  const ambient = useRef();
  const cursorLight = useRef();
  const transitionLight = useRef();
  const currentColor = useRef(new Color("#a6d59e"));
  const targetColor = useRef(new Color("#a6d59e"));
  const lastTargetColor = useRef(targetLightColor);
  const interactionStrength = useRef(0);
  const transitionSurge = useRef(1);

  useFrame((state, delta) => {
    if (lastTargetColor.current !== targetLightColor) {
      targetColor.current.set(targetLightColor);
      lastTargetColor.current = targetLightColor;
    }
    easing.dampC(currentColor.current, targetColor.current, 0.15, delta);
    light.current.color.copy(currentColor.current);
    cursorLight.current.color.copy(currentColor.current);

    const interactionRate =
      linkInteraction.strength > interactionStrength.current ? 2.4 : 8;
    const interactionDamping = 1 - Math.exp(-delta * interactionRate);
    interactionStrength.current +=
      (linkInteraction.strength - interactionStrength.current) *
      interactionDamping;
    const strength = interactionStrength.current;
    const surgeRate =
      targetTransitionLightSurge > transitionSurge.current ? 8 : 1.8;
    const surgeDamping = 1 - Math.exp(-delta * surgeRate);
    transitionSurge.current +=
      (targetTransitionLightSurge - transitionSurge.current) * surgeDamping;
    const surge = transitionSurge.current;
    const targetDirectionalIntensity =
      sceneDirectionalIntensity * surge * (1 - strength * 0.985);
    light.current.intensity +=
      (targetDirectionalIntensity - light.current.intensity) *
      interactionDamping;
    const baseAmbientIntensity = isMobile
      ? sceneAmbientIntensity * 1.8
      : sceneAmbientIntensity;
    const targetAmbientIntensity =
      baseAmbientIntensity * surge * (1 - strength * 0.985);
    ambient.current.intensity +=
      (targetAmbientIntensity - ambient.current.intensity) * interactionDamping;
    const targetCursorIntensity = strength * 48;
    cursorLight.current.intensity +=
      (targetCursorIntensity - cursorLight.current.intensity) *
      interactionDamping;
    const surgeProgress = (surge - 1) / 1.6;
    const targetTransitionIntensity = surgeProgress * (isMobile ? 34 : 55);
    transitionLight.current.intensity +=
      (targetTransitionIntensity - transitionLight.current.intensity) *
      surgeDamping;
    transitionLight.current.distance +=
      (4.5 + surgeProgress * 13.5 - transitionLight.current.distance) *
      surgeDamping;
    easing.damp3(
      cursorLight.current.position,
      [
        pointer.x * state.viewport.width * 0.5,
        pointer.y * state.viewport.height * 0.5,
        1.35,
      ],
      0.12,
      delta,
    );

    if (isMobile) {
      const targetX = (orientation.gamma / 90) * 3;
      const targetY = ((orientation.beta - 45) / 90) * 2;
      easing.damp3(light.current.position, [targetX, targetY, 3], 0.4, delta);
    } else {
      const linkX = linkInteraction.x * 2 - 1;
      const linkY = linkInteraction.y * 2 - 1;
      const targetX = pointer.x * (1 - strength) + linkX * strength;
      const targetY = pointer.y * (1 - strength) + linkY * strength;
      const horizontalReach = state.viewport.width * (0.125 + strength * 0.19);
      const verticalReach = state.viewport.height * (0.125 + strength * 0.19);
      easing.damp3(
        light.current.position,
        [
          targetX * horizontalReach,
          targetY * verticalReach,
          1 + strength * 1.6,
        ],
        0.3 - strength * 0.16,
        delta,
      );
    }
  });

  return (
    <>
      <directionalLight ref={light} intensity={9.2} />
      <ambientLight
        ref={ambient}
        color="#a6d59e"
        intensity={isMobile ? 4.5 : 2.5}
      />
      <pointLight ref={cursorLight} intensity={0} distance={3.8} decay={2} />
      <pointLight
        ref={transitionLight}
        color="#b9ffd0"
        position={[0, 0, 2.2]}
        intensity={0}
        distance={4.5}
        decay={2}
      />
    </>
  );
}
