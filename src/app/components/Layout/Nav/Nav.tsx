import { useEffect, useRef, useState, type MouseEvent } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useKpIndex, getKpColor } from "../../../hooks/useKpIndex"
import { useManualKp } from "../../../hooks/KpContext"
import { usePageTransition } from "../../../hooks/usePageTransition"
import { useHeroIntro } from "../../../hooks/HeroIntroContext"
import { useI18n } from "../../../hooks/useI18n"
import styles from "./Nav.module.scss"

const Nav = () => {
	const navRef = useRef<HTMLElement>(null)
	const panelRef = useRef<HTMLDivElement>(null)
	const [open, setOpen] = useState(false)
	const [kpOpen, setKpOpen] = useState(false)
	const [scrolled, setScrolled] = useState(false)
	const { data } = useKpIndex()
	const { manualKp } = useManualKp()
	const { locale, t } = useI18n()
	const { transitionTo } = usePageTransition()
	const { homeHeroIntroReady } = useHeroIntro()
	const kp = manualKp ?? data?.latest ?? 0
	const kpDescription = locale === "nb"
		? "KP måler global geomagnetisk aktivitet fra 0–9. Høyere tall betyr sterkere nordlys og større sjanse for synlighet lenger sør."
		: "KP measures global geomagnetic activity from 0–9. A higher reading means a stronger aurora with a better chance of visibility farther south."

	useEffect(() => {
		let frame = 0
		const update = () => {
			frame = 0
			setScrolled(window.scrollY > 72)
		}
		const onScroll = () => {
			if (!frame) frame = window.requestAnimationFrame(update)
		}
		update()
		window.addEventListener("scroll", onScroll, { passive: true })
		return () => {
			window.removeEventListener("scroll", onScroll)
			if (frame) window.cancelAnimationFrame(frame)
		}
	}, [])

	useEffect(() => {
		if (!scrolled && open) setOpen(false)
	}, [scrolled, open])

	useEffect(() => {
		if (!open) return
		const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false)
		document.addEventListener("keydown", onKey)
		document.body.style.overflow = "hidden"
		return () => {
			document.removeEventListener("keydown", onKey)
			document.body.style.overflow = ""
		}
	}, [open])

	useGSAP(() => {
		if (!navRef.current || !homeHeroIntroReady) return
		gsap.fromTo(navRef.current, { autoAlpha: 0, yPercent: -24, rotationX: -20 }, { autoAlpha: 1, yPercent: 0, rotationX: 0, duration: 0.8, ease: "shiftReveal" })
	}, { dependencies: [homeHeroIntroReady], scope: navRef })

	useGSAP(() => {
		const panel = panelRef.current
		if (!panel) return
		const links = panel.querySelectorAll<HTMLElement>(`.${styles.menuLinks} a`)
		if (open) {
			gsap.set(panel, { pointerEvents: "auto" })
			gsap.fromTo(panel, { autoAlpha: 0, clipPath: "inset(0 0 100% 0)" }, { autoAlpha: 1, clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "shiftReveal" })
			gsap.fromTo(
				links,
				{ autoAlpha: 1, yPercent: 110, rotationX: -72, skewY: 3, clipPath: "inset(0 0 100% 0)", transformPerspective: 1100, transformOrigin: "50% 100%" },
				{ autoAlpha: 1, yPercent: 0, rotationX: 0, skewY: 0, clipPath: "inset(0 0 0% 0)", transformPerspective: 1100, transformOrigin: "50% 100%", duration: 1.2, stagger: 0.1, ease: "shiftTitle", delay: 0.08 },
			)
		} else {
			gsap.timeline({ onComplete: () => gsap.set(panel, { pointerEvents: "none" }) })
				.to(links, { autoAlpha: 0, yPercent: 110, rotationX: -72, skewY: 3, clipPath: "inset(0 0 100% 0)", transformPerspective: 1100, transformOrigin: "50% 100%", duration: 0.52, ease: "shiftTitle" })
				.to(panel, { autoAlpha: 0, clipPath: "inset(0 0 100% 0)", duration: 0.52, ease: "shiftReveal" }, "-=.12")
		}
	}, { dependencies: [open], scope: panelRef })

	const go = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
		event.preventDefault()
		setOpen(false)
		window.setTimeout(() => transitionTo(href), 180)
	}

	return (
		<>
			<nav ref={navRef} className={`${styles.nav} ${scrolled ? styles.scrolled : styles.atTop}`} aria-label='Main'>
				<a href='/' onClick={(event) => go(event, "/")} className={styles.identity}>
					<img src='/kj-logo.svg' alt='Kenneth Jørgensen' />
				</a>
				<div className={styles.topLinks} aria-hidden={scrolled}>
					<a href='/#work' onClick={(event) => go(event, "/#work")}>{t.navWork}</a>
					<a href='/about' onClick={(event) => go(event, "/about")}>{t.navAbout}</a>
					<a href='/#contact' onClick={(event) => go(event, "/#contact")}>{t.navContact}</a>
				</div>
				<div className={styles.navMeta} aria-hidden={!scrolled && !open}>
					<div
						className={styles.kpWrap}
						onMouseEnter={() => setKpOpen(true)}
						onMouseLeave={() => setKpOpen(false)}
						onFocusCapture={() => setKpOpen(true)}
						onBlurCapture={(event) => !event.currentTarget.contains(event.relatedTarget) && setKpOpen(false)}
					>
						<button
							type='button'
							className={styles.kp}
							onClick={() => setKpOpen((value) => !value)}
							onKeyDown={(event) => event.key === "Escape" && setKpOpen(false)}
							aria-expanded={kpOpen}
							aria-describedby='kp-explainer'
							tabIndex={scrolled || open ? 0 : -1}
						>
							<i style={{ background: getKpColor(kp) }} />KP {kp.toFixed(1)}
						</button>
						<div id='kp-explainer' role='tooltip' className={`${styles.kpPopover} ${kpOpen ? styles.kpPopoverOpen : ""}`}>
							<span>{manualKp !== null ? (locale === "nb" ? "Simulert verdi" : "Simulated reading") : (locale === "nb" ? "Direkte avlesning" : "Live reading")}</span>
							<strong>KP {kp.toFixed(1)}</strong>
							<p>{kpDescription}</p>
							<small>{locale === "nb" ? "Skydekke og mørke avgjør lokal synlighet." : "Cloud cover and darkness still determine local visibility."}</small>
						</div>
					</div>
					<button type='button' onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls='site-menu' tabIndex={scrolled || open ? 0 : -1}>
						{open ? (locale === "nb" ? "Lukk" : "Close") : "Menu"}
					</button>
				</div>
			</nav>

			<div ref={panelRef} id='site-menu' className={styles.menuPanel} aria-hidden={!open}>
				<div className={styles.menuInner}>
					<div className={styles.menuLinks}>
						<a href='/#work' onClick={(event) => go(event, "/#work")}><span>( 01 )</span>{t.navWork}</a>
						<a href='/about' onClick={(event) => go(event, "/about")}><span>( 02 )</span>{t.navAbout}</a>
						<a href='/#contact' onClick={(event) => go(event, "/#contact")}><span>( 03 )</span>{t.navContact}</a>
					</div>
					<div className={styles.menuFooter}>
						<span>Bodø / 67°17′N</span>
						<a href='mailto:hei@kennethjorgensen.no'>hei@kennethjorgensen.no</a>
					</div>
				</div>
			</div>
		</>
	)
}

export default Nav
