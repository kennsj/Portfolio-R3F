import { useEffect, useRef } from "react"
import styles from "./Aurora.module.scss"
import { setLightColor } from "../../Experiences/lightStore"
import { useKpIndex, getKpColor, getKpLabel } from "../../../hooks/useKpIndex"
import { useManualKp } from "../../../hooks/KpContext"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const Aurora = () => {
	const { data, isLoading } = useKpIndex()
	const { manualKp, setManualKp } = useManualKp()

	const displayKp = manualKp ?? data?.latest ?? 0
	const displayKpRef = useRef(displayKp)
	displayKpRef.current = displayKp

	const wrapRef = useRef<HTMLDivElement>(null)
	const kpNumRef = useRef<HTMLSpanElement>(null)
	const locationRef = useRef<HTMLDivElement>(null)
	const hasCountPlayedRef = useRef(false)

	useEffect(() => {
		setLightColor(getKpColor(displayKp))
	}, [displayKp])

	useEffect(() => {
		if (!hasCountPlayedRef.current || !kpNumRef.current) return
		kpNumRef.current.textContent = displayKp.toFixed(1)
	}, [displayKp])

	const hasKpEntries = Boolean(data?.entries.length)

	useGSAP(
		() => {
			if (isLoading || !hasKpEntries) return

			const wrap = wrapRef.current
			const kpEl = kpNumRef.current
			const loc = locationRef.current
			if (!wrap || !kpEl || !loc) return

			let cancelled = false
			let timeline: gsap.core.Timeline | null = null

			document.fonts.ready.then(() => {
				if (cancelled || !wrap.isConnected) return

				requestAnimationFrame(() => {
					if (cancelled || !wrap.isConnected) return
					ScrollTrigger.refresh()
				})

				const bars = wrap.querySelectorAll<HTMLElement>("[data-aurora-bar]")

				kpEl.textContent = "0.0"

				bars.forEach((bar) => {
					gsap.set(bar, {
						transformOrigin: "bottom center",
						scaleY: 0,
						opacity: 0,
					})
				})

				const counter = { val: 0 }

				timeline = gsap.timeline({
					scrollTrigger: {
						trigger: wrap,
						start: "top bottom",
						toggleActions: "play none none none",
						invalidateOnRefresh: true,
						fastScrollEnd: true,
						once: true,
					},
				})

				timeline.from(loc, {
					opacity: 0,
					filter: "blur(25px)",
					yPercent: 35,
					duration: 0.9,
					ease: "power2.out",
				})

				timeline.to(
					bars,
					{
						scaleY: 1,
						opacity: 1,
						stagger: 0.04,
						duration: 0.6,
						ease: "power2.out",
					},
					0,
				)

				timeline.to(
					counter,
					{
						val: displayKpRef.current,
						duration: 1.2,
						ease: "power2.out",
						onUpdate: () => {
							kpEl.textContent = counter.val.toFixed(1)
						},
						onComplete: () => {
							hasCountPlayedRef.current = true
						},
					},
					0,
				)

				if (cancelled) {
					timeline.scrollTrigger?.kill()
					timeline.kill()
					timeline = null
				}
			})

			return () => {
				cancelled = true
				timeline?.scrollTrigger?.kill()
				timeline?.kill()
				timeline = null
			}
		},
		{ dependencies: [isLoading, hasKpEntries], scope: wrapRef },
	)

	const ready = !isLoading && !!data?.entries.length
	const { label, visible } = getKpLabel(displayKp)

	return (
		<div
			ref={wrapRef}
			className={styles["aurora-wrapper"]}
			data-aurora-ready={ready ? "true" : "false"}
		>
			{!ready ? (
				<div className={styles["aurora-loading"]} aria-busy='true' />
			) : (
				<>
					<div className={styles.topLabel}>Aurora forecast</div>

					<div className={styles["main-row"]}>
						<div ref={locationRef} className={styles["location-label"]}>
							Bodø,
							<br />
							<span className={styles.dim}>Norway</span>
						</div>
						<div className={styles["kp-block"]}>
							<div className={styles["kp-meta"]}>KP Index</div>
							<span ref={kpNumRef} className={styles["kp-num"]} />
							<div className={styles["status-line"]}>
								<div className={styles["status-dot-wrap"]}>
									<span
										className={styles["status-dot"]}
										style={{ background: getKpColor(displayKp) }}
									/>
									<span>{label}</span>
								</div>
								{visible && (
									<span className={styles["visible-label"]}>
										— visible from Bodø tonight
									</span>
								)}
							</div>
						</div>
					</div>

					<div className={styles.bars}>
						{data.entries.map((entry, i) => (
							<div key={i} className={styles["bar-wrap"]}>
								<div
									data-aurora-bar
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
								value={manualKp ?? data.latest ?? 0}
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
							interpretation. Colours, speed, and behaviour may not reflect
							actual conditions above Bodø — if you're ever lucky enough to
							experience a cloudless day here in this city. The best chances are
							between September and April, if the clouds cooperate.
						</p>
					</div>
				</>
			)}
		</div>
	)
}

export default Aurora
