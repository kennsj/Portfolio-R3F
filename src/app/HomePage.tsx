import { Suspense, useEffect, useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Header from "./components/Layout/Header/Header"
import Contact from "./components/Layout/Contact/Contact"
import TextBlock from "./components/UI/TextBlock/TextBlock"
import Expertise from "./components/Layout/Expertise/Expertise"
import Projects from "./components/Layout/Project/Projects"
import { useI18n } from "./hooks/useI18n"
import { setAuroraPresence, setLightColor } from "./components/Experiences/lightStore"
import styles from "./styles/Homepage.module.scss"
import HeadingAnimation from "./components/UI/HeadingAnimation/HeadingAnimation"
import { usePageTransition } from "./hooks/usePageTransition"

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
	const { locale, t } = useI18n()
	const { transitionTo } = usePageTransition()
	const aboutRef = useRef<HTMLElement>(null)

	useGSAP(() => {
		const section = aboutRef.current
		if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
		const pathways = section.querySelectorAll<HTMLElement>("[data-pathway]")
		gsap.from(pathways, {
			yPercent: 55,
			rotationX: -28,
			autoAlpha: 0,
			transformPerspective: 900,
			transformOrigin: "50% 100%",
			duration: 0.8,
			stagger: 0.1,
			ease: "shiftReveal",
			scrollTrigger: { trigger: pathways[0], start: "top 88%", once: true },
		})
	}, { scope: aboutRef })

	useEffect(() => {
		const sections = Array.from(
			document.querySelectorAll<HTMLElement>("[data-aurora-state]"),
		)
		const observer = new IntersectionObserver(
			(entries) => {
				const active = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
				if (!active) return
				const el = active.target as HTMLElement
				setAuroraPresence(Number(el.dataset.auroraPresence || 1))
				if (el.dataset.auroraColor) setLightColor(el.dataset.auroraColor)
			},
			{ rootMargin: "-28% 0px -28%", threshold: [0, 0.25, 0.5, 0.75] },
		)
		sections.forEach((section) => observer.observe(section))
		return () => {
			observer.disconnect()
			setAuroraPresence(1)
		}
	}, [])

	return (
		<>
			{/*
				Direction: Northern Signal Studio.
				World: an arctic creative practice documented with the precision of a field station.
				First viewport: oversized editorial type cuts through a live aurora atmosphere.
				Path: positioning → work → capabilities → direct contact and live aurora forecast.
				Signature: the aurora is both environmental material and a living data signal.
			*/}
			<div data-aurora-state data-aurora-presence='0.92' data-aurora-color='#9df5bf'>
				<Header signalNavIntroAfterHero />
			</div>

			<section ref={aboutRef} id='about' data-aurora-state data-aurora-presence='0.72' data-aurora-color='#86cfa3'>
				<div className={styles.about}>
					<HeadingAnimation level={2} className={styles.sectionIndex}><span>{locale === "nb" ? "Om Kenneth" : "About Kenneth"}</span><span>Bodø / 67°17′N</span></HeadingAnimation>
					<div className={styles.aboutStatement}>
						<TextBlock>{locale === "nb" ? "Jeg designer og bygger digitale opplevelser fra Bodø. Arbeidet mitt ligger mellom visuell retning, produktdesign og frontend — slik at ideen holder helt frem til det som møter brukeren." : "I design and build digital experiences from Bodø. My work sits between visual direction, product design and front-end development—so the idea survives all the way into what people use."}</TextBlock>
						<div className={styles.pathways}>
							<p data-pathway><span>{locale === "nb" ? "Én sammenhengende prosess" : "One connected process"}</span>{locale === "nb" ? "Fra tidlig retning og grensesnitt til bevegelse, kode og den ferdige opplevelsen." : "From early direction and interface design to motion, code and the finished experience."}</p>
							<p data-pathway><span>{locale === "nb" ? "To måter å samarbeide" : "Two ways to collaborate"}</span>{locale === "nb" ? "Direkte med virksomheter eller som en del av kreative produkt- og designteam." : "Directly with businesses or embedded in creative product and design teams."}</p>
						</div>
						<a className={styles.aboutLink} href='/about' onClick={(event) => { event.preventDefault(); transitionTo('/about') }}><span>{locale === "nb" ? "Mer om meg" : "More about me"}</span><i>↗</i></a>
					</div>
				</div>
			</section>

			<Suspense>
				<Projects />
			</Suspense>
			<Suspense>
				<Expertise />
			</Suspense>
			<Contact showForecast />
		</>
	)
}
