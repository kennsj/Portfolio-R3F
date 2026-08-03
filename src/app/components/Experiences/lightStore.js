export let targetLightColor = "#a6d59e"
export let targetDirectionalIntensity = 8.2
export let targetAmbientIntensity = 2.2

export function setLightColor(color) {
	targetLightColor = color
}

export function setAuroraPresence(presence = 1) {
	const safePresence = Math.max(0.45, Math.min(1.2, presence))
	targetDirectionalIntensity = 8.2 * safePresence
	targetAmbientIntensity = 2.2 * safePresence
}
