import { useEffect } from "react"
import styles from "./Aurora.module.scss"
import { setLightColor } from "../../Experiences/lightStore"
import { useKpIndex, getKpColor, getKpLabel } from "../../../hooks/useKpIndex"
import { useManualKp } from "../../../hooks/KpContext"

const Aurora = () => {
	const { data, isLoading } = useKpIndex()
	const { manualKp, setManualKp } = useManualKp()

	const displayKp = manualKp ?? data?.latest ?? 0

	useEffect(() => {
		setLightColor(getKpColor(displayKp))
	}, [displayKp])

	if (isLoading) return null

	const { label, visible } = getKpLabel(displayKp)

	return (
		<div className={styles["aurora-wrapper"]}>
			<div className={styles.topLabel}>Aurora forecast</div>

			<div className={styles["main-row"]}>
				<div className={styles["location-label"]}>
					Bodø,
					<br />
					<span className={styles.dim}>Norway</span>
				</div>
				<div className={styles["kp-block"]}>
					<div className={styles["kp-meta"]}>KP Index</div>
					<span className={styles["kp-num"]}>{displayKp.toFixed(1)}</span>
					<div className={styles["status-line"]}>
						<span
							className={styles["status-dot"]}
							style={{ background: getKpColor(displayKp) }}
						/>
						<span>{label}</span>
						{visible && (
							<span className={styles["visible-label"]}>
								— visible from Bodø tonight
							</span>
						)}
					</div>
				</div>
			</div>

			<div className={styles.bars}>
				{data?.entries.map((entry, i) => (
					<div key={i} className={styles["bar-wrap"]}>
						<div
							className={styles.bar}
							style={{
								height: `${Math.max(2, (entry.kp / 9) * 32)}px`,
								background: getKpColor(entry.kp),
							}}
						/>
						<span className={styles["bar-time"]}>
							{new Date(entry.time).toLocaleTimeString("no-NO", {
								hour: "2-digit",
								minute: "2-digit",
								timeZone: "Europe/Oslo",
							})}
						</span>
					</div>
				))}
			</div>

			<div className={styles["slider-wrapper"]}>
				<div className={styles["slider-row"]}>
					<input
						type='range'
						min={0}
						max={9}
						step={0.1}
						value={manualKp ?? data?.latest ?? 0}
						onChange={(e) => setManualKp(parseFloat(e.target.value))}
						aria-label='Adjust the Aurora forecast'
					/>
					<span aria-label='Manual or Live'>
						{manualKp !== null ? "Manual" : "Live"}
					</span>
					{manualKp !== null && (
						<button
							onClick={() => setManualKp(null)}
							aria-label='Reset the Aurora forecast'
						>
							Reset
						</button>
					)}
				</div>
				<p>
					Disclaimer: The aurora depicted in the background is an artistic
					interpretation. Colours, speed, and behaviour may not reflect actual
					conditions above Bodø — if you're ever lucky enough to experience a
					cloudless day here in this city. The best chances are between
					September and April, if the clouds cooperate.
				</p>
			</div>
		</div>
	)
}

export default Aurora
