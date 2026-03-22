import { useQuery } from "@tanstack/react-query"

type KpEntry = [string, string]

export const getKpColor = (kp: number) => {
	if (kp <= 2) return "#74a36d"
	if (kp <= 3) return "#86b87e"
	if (kp <= 4) return "#9acc8f"
	if (kp <= 5) return "#aedfa0"
	if (kp <= 6) return "#c2f0b2"
	if (kp <= 7) return "#d4f7c4"
	return "#e6ffd6"
}

/** Wave scroll speed: Kp 5 matches current site default (1×); lower Kp slower, higher faster. */
export const getKpWaveSpeedMultiplier = (kp: number) => {
	if (!Number.isFinite(kp)) return 1
	const k = Math.min(9, Math.max(1, kp))
	if (k <= 5) {
		return 0.35 + (0.65 * (k - 1)) / 4
	}
	return 1 + (0.85 * (k - 5)) / 4
}

export const getKpLabel = (kp: number) => {
	if (kp <= 1) return { label: "Quiet", visible: false }
	if (kp <= 2) return { label: "Quiet", visible: false }
	if (kp <= 3) return { label: "Low activity", visible: false }
	if (kp <= 4) return { label: "Moderate", visible: true }
	if (kp <= 5) return { label: "Active", visible: true }
	if (kp <= 6) return { label: "Minor storm", visible: true }
	if (kp <= 7) return { label: "Strong storm", visible: true }
	return { label: "Severe storm", visible: true }
}

export const kpIndexQueryKey = ["kp-index"] as const

export const fetchKpData = async () => {
	const res = await fetch(
		"https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json",
	)
	if (!res.ok) throw new Error("Failed to fetch Kp data")
	const data: KpEntry[] = await res.json()
	const readings = data
		.slice(1)
		.slice(-8)
		.map((entry) => ({
			time: entry[0],
			kp: parseFloat(entry[1]),
		}))
	return {
		entries: readings,
		latest: readings[readings.length - 1].kp,
	}
}

export const kpIndexQueryOptions = {
	queryKey: kpIndexQueryKey,
	queryFn: fetchKpData,
	staleTime: 1000 * 60 * 15,
} as const

export const useKpIndex = () =>
	useQuery({
		...kpIndexQueryOptions,
		refetchInterval: 1000 * 60 * 15,
	})
