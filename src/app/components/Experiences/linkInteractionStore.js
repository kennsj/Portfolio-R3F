/**
 * Transient DOM-to-WebGL interaction state.
 * Values are read directly by the post-processing effect each frame so link
 * hover never causes React renders inside or outside the Canvas.
 */
export const linkInteraction = {
	x: 0.5,
	y: 0.5,
	strength: 0,
}

export function activateLinkInteraction(element) {
	const rect = element.getBoundingClientRect()
	linkInteraction.x = (rect.left + rect.width / 2) / window.innerWidth
	linkInteraction.y = 1 - (rect.top + rect.height / 2) / window.innerHeight
	linkInteraction.strength = 1
}

export function clearLinkInteraction() {
	linkInteraction.strength = 0
}
