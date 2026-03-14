/**
 * Shared pointer position (NDC -1 to 1) for the background effect.
 * Updated from window so it works when hovering over text, images, and links.
 */
export const pointer = { x: 0, y: 0 }

export function setPointer(clientX, clientY) {
	pointer.x = (clientX / window.innerWidth) * 2 - 1
	pointer.y = -(clientY / window.innerHeight) * 2 + 1
}
