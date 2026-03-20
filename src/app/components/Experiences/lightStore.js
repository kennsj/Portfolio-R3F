import { Color } from "three"

export const currentColor = new Color("#a6d59e")
export const targetColor = new Color("#a6d59e")

export function setLightColor(color) {
	targetColor.set(color)
}
