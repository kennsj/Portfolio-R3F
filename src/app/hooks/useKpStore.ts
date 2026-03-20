export const kpOverride = { value: null as number | null }

export function setManualKp(kp: number | null) {
	kpOverride.value = kp
}
