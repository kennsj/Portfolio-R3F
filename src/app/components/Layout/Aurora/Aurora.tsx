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
					<div className={styles.intro}>
						<span>03 / {t.auroraEyebrow}</span>
						<div><h3>{t.auroraTitleLineOne}<br /><em>{t.auroraTitleLineTwo}</em></h3><p>{t.auroraExplanation}</p></div>
					</div>
					<div className={styles.signal}>
						<div ref={locationRef} className={styles.location}>{t.auroraLocationCity}<span>{t.auroraLocationRegion} / 67°N</span></div>
						<div className={styles.kp}><span>{t.auroraKpIndex}</span><strong ref={kpNumRef} /><small><i style={{ background: getKpColor(displayKp) }} />{label}{visible ? ` / ${t.auroraVisibleTonight}` : ""}</small></div>
					</div>
					<div className={styles.index}>
						<div className={styles.scale}><span>00 / {t.auroraCalm}</span><span>09 / {t.auroraActive}</span></div>
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
						<div className={styles.indexMeta}><p>{t.auroraDisclaimer}</p>{manualKp !== null && <button onClick={() => setManualKp(null)} aria-label={t.auroraResetAria}>{t.auroraReset}</button>}</div>
					</div>
				</>
			)}
		</div>
	)
}

export default Aurora
