export let targetLightColor = "#a6d59e";
export let targetDirectionalIntensity = 8.2;
export let targetAmbientIntensity = 2.2;
export let targetAuroraSpeedMultiplier = 1;
export let targetTransitionLightSurge = 1;

export function setLightColor(color) {
  targetLightColor = color;
}

export function setAuroraPresence(presence = 1) {
  const safePresence = Math.max(0.45, Math.min(1.2, presence));
  targetDirectionalIntensity = 8.2 * safePresence;
  targetAmbientIntensity = 2.2 * safePresence;
}

export function setAuroraSpeedMultiplier(multiplier = 1) {
  targetAuroraSpeedMultiplier = Math.max(0.5, Math.min(6, multiplier));
}

export function setTransitionLightSurge(surge = 1) {
  targetTransitionLightSurge = Math.max(1, Math.min(1.65, surge));
}
