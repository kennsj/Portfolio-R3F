import { useEffect, useRef } from "react"
import styles from "./Aurora.module.scss"
import { setLightColor } from "../../Experiences/lightStore"
import { useKpIndex, getKpColor, getKpLabel } from "../../../hooks/useKpIndex"
import { useManualKp } from "../../../hooks/KpContext"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useI18n } from "../../../hooks/useI18n"

gsap.registerPlugin(ScrollTrigger)

const Aurora = () => {
	const { data, isLoading } = useKpIndex()
	const { manualKp, setManualKp } = useManualKp()
	const { locale, t } = useI18n()

	const rawDisplayKp = manualKp ?? data?.latest
	const displayKp = Number.isFinite(rawDisplayKp as number)
		? (rawDisplayKp as number)
		: 0
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

				const setup = () => {
					if (cancelled || !wrap.isConnected) return

					ScrollTrigger.refresh()

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
						immediateRender: false,
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

					ScrollTrigger.refresh()

					if (cancelled) {
						timeline.scrollTrigger?.kill()
						timeline.kill()
						timeline = null
					}
				}

				requestAnimationFrame(() => {
					if (cancelled || !wrap.isConnected) return
					requestAnimationFrame(setup)
				})
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
	const { label, visible } = getKpLabel(displayKp, locale)
	const explanation = locale === "nb"
		? "KP-indeksen måler global geomagnetisk aktivitet fra 0 til 9. Høyere verdi betyr sterkere nordlys og bedre mulighet for å se det lenger sør. Dra i måleren for å simulere hvordan aktiviteten endrer lyset på siden."
		: "The KP index measures global geomagnetic activity from 0 to 9. A higher reading means a stronger aurora with a better chance of seeing it farther south. Move the control to simulate how that activity changes the light across this site."

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
					<div className={styles["forecast-intro"]}>
						<span>{locale === "nb" ? "Levende signal / Bodø" : "Live signal / Bodø"}</span>
						<h3>{locale === "nb" ? <>Nordlyset<br />som grensesnitt</> : <>Aurora as<br />interface</>}</h3>
						<p>{explanation}</p>
					</div>

					<div className={styles["main-row"]}>
						<div ref={locationRef} className={styles["location-label"]}>
							{t.auroraLocationCity}
							<br />
							<span className={styles.dim}>{t.auroraLocationRegion}</span>
						</div>
						<div className={styles["kp-block"]}>
							<div className={styles["kp-meta"]}>{t.auroraKpIndex}</div>
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
										{t.auroraVisibleTonight}
									</span>
								)}
							</div>
						</div>
					</div>

					<div className={styles.bars}>
						{data.entries.map((entry, i) => (
							(() => {
								const kp = Number.isFinite(entry.kp) ? entry.kp : 0
								return (
							<div key={i} className={styles["bar-wrap"]}>
								<div
									data-aurora-bar
									className={styles.bar}
									style={{
										height: `${Math.max(2, (kp / 9) * 32)}px`,
										background: getKpColor(kp),
									}}
								/>
								<span className={styles["bar-time"]}>
									{new Date(entry.time).toLocaleTimeString(
										locale === "nb" ? "nb-NO" : "en-GB",
										{
										hour: "2-digit",
										minute: "2-digit",
										timeZone: "Europe/Oslo",
										},
									)}
								</span>
							</div>
								)
							})()
						))}
					</div>

					<div className={styles["slider-wrapper"]}>
						<div className={styles["slider-control"]}>
							<div className={styles["slider-heading"]}>
								<span>{locale === "nb" ? "Simuler aktivitet" : "Simulate activity"}</span>
								<strong>{displayKp.toFixed(1)}</strong>
							</div>
							<input
								type='range'
								min={0}
								max={9}
								step={0.1}
								value={displayKp}
								style={{ "--range-progress": `${(displayKp / 9) * 100}%` } as React.CSSProperties}
								onChange={(e) => {
									const next = Number(e.target.value)
									setManualKp(Number.isFinite(next) ? next : 0)
								}}
								aria-label={t.auroraSliderLabel}
								aria-valuetext={`KP ${displayKp.toFixed(1)}, ${label}`}
							/>
							<div className={styles["slider-scale"]} aria-hidden='true'><span>0</span><span>3</span><span>6</span><span>9</span></div>
							<div className={styles["slider-mode"]}>
								<span aria-label={t.auroraModeAria}>
									<i style={{ background: getKpColor(displayKp) }} />
									{manualKp !== null ? t.auroraModeManual : t.auroraModeLive}
								</span>
								{manualKp !== null && (
								<button
									onClick={() => setManualKp(null)}
									aria-label={t.auroraResetAria}
								>
									{t.auroraReset}
								</button>
								)}
							</div>
						</div>
						<p>{t.auroraDisclaimer}</p>
					</div>
				</>
			)}
		</div>
	)
}

export default Aurora
