import { useQuery } from "@tanstack/react-query"

type KpEntry = [string, string]

export const getKpColor = (kp: number) => {
	if (kp <= 2) return "#a6d59e"
	if (kp <= 3) return "#a6d59e"
	if (kp <= 4) return "#b8e8a8"
	if (kp <= 5) return "#c8f0b0"
	if (kp <= 6) return "#d4f5b8"
	if (kp <= 7) return "#dff7c0"
	return "#e8fac8"
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

const fetchKpData = async () => {
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

export const useKpIndex = () =>
	useQuery({
		queryKey: ["kp-index"],
		queryFn: fetchKpData,
		staleTime: 1000 * 60 * 15,
		refetchInterval: 1000 * 60 * 15,
	})
