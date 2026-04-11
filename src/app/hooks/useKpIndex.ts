import { useQuery } from "@tanstack/react-query"
import type { AppLocale } from "./useI18n"

type KpEntryLegacy = [string, string]
type KpEntryObject = { time_tag?: unknown; Kp?: unknown }

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

export const getKpLabel = (kp: number, locale: AppLocale = "nb") => {
	const labels =
		locale === "nb"
			? {
					quiet: "Rolig",
					low: "Lav aktivitet",
					moderate: "Moderat",
					active: "Aktiv",
					minor: "Mindre storm",
					strong: "Sterk storm",
					severe: "Kraftig storm",
				}
			: {
					quiet: "Quiet",
					low: "Low activity",
					moderate: "Moderate",
					active: "Active",
					minor: "Minor storm",
					strong: "Strong storm",
					severe: "Severe storm",
				}

	if (kp <= 1) return { label: labels.quiet, visible: false }
	if (kp <= 2) return { label: labels.quiet, visible: false }
	if (kp <= 3) return { label: labels.low, visible: false }
	if (kp <= 4) return { label: labels.moderate, visible: true }
	if (kp <= 5) return { label: labels.active, visible: true }
	if (kp <= 6) return { label: labels.minor, visible: true }
	if (kp <= 7) return { label: labels.strong, visible: true }
	return { label: labels.severe, visible: true }
}

export const kpIndexQueryKey = ["kp-index"] as const

export const fetchKpData = async () => {
	const res = await fetch(
		"https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json",
	)
	if (!res.ok) throw new Error("Failed to fetch Kp data")
	const raw: unknown = await res.json()
	const rows = Array.isArray(raw) ? raw : []

	const readings = (() => {
		// Legacy format: [time, kpString] with a header row at index 0
		if (Array.isArray(rows[0])) {
			return (rows as KpEntryLegacy[])
				.slice(1)
				.slice(-8)
				.map((entry) => ({
					time: String(entry[0] ?? ""),
					kp: (() => {
						const n = Number(entry[1])
						return Number.isFinite(n) ? n : 0
					})(),
				}))
		}

		// Current format: { time_tag: "...", Kp: 2.67, ... }
		return (rows as KpEntryObject[]).slice(-8).map((entry) => ({
			time: typeof entry?.time_tag === "string" ? entry.time_tag : "",
			kp: (() => {
				const n = typeof entry?.Kp === "number" ? entry.Kp : Number(entry?.Kp)
				return Number.isFinite(n) ? n : 0
			})(),
		}))
	})()

	const latest = readings.length ? readings[readings.length - 1].kp : 0
	return {
		entries: readings,
		latest,
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
