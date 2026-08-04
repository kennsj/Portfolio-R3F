import { useLayoutEffect } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useI18n } from "./hooks/useI18n"
import { usePageTransition } from "./hooks/usePageTransition"
import styles from "./styles/AboutPage.module.scss"

gsap.registerPlugin(ScrollTrigger)

export default function AboutPage() {
	const { locale } = useI18n()
	const { transitionTo } = usePageTransition()
	useLayoutEffect(() => window.scrollTo(0, 0), [])
	useGSAP(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
		gsap.utils.toArray<HTMLElement>("[data-about-reveal]").forEach((element) => {
			gsap.from(element, { y: 72, autoAlpha: 0, duration: 1, ease: "shiftReveal", scrollTrigger: { trigger: element, start: "top 88%", once: true } })
		})
	})
	const go = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => { event.preventDefault(); transitionTo(href) }

	return (
		<article className={styles.page}>
			<header className={styles.hero}>
				<div className={styles.coordinates}><span>Bodø, Norway</span><span>67°17′N / 14°23′E</span></div>
				<h1>Kenneth<br /><span>Jørgensen</span></h1>
				<p>{locale === "nb" ? "Designer og utvikler som former visuell retning, interaksjon og kode som én sammenhengende prosess." : "A designer and developer shaping visual direction, interaction and code as one connected process."}</p>
			</header>

			<section className={styles.portrait} data-about-reveal>
				<figure><img src='/images/kenneth-aurora.jpg' alt='Kenneth Jørgensen beneath the northern lights' /></figure>
				<p>{locale === "nb" ? "Jeg jobber i rommet mellom det et digitalt produkt skal føles som og hvordan det faktisk bygges." : "I work in the space between how a digital product should feel and how it is actually built."}</p>
			</section>

			<section className={styles.story} data-about-reveal>
				<span>{locale === "nb" ? "Praksis" : "Practice"}</span>
				<div>
					<p>{locale === "nb" ? "Basert i Bodø arbeider jeg på tvers av visuell design, UX/UI, interaksjon og frontend. Det gjør at retning, detaljer og tekniske valg kan utvikles sammen, i stedet for å bli overlevert mellom separate faser." : "Based in Bodø, I work across visual design, UX/UI, interaction and front-end development. That means direction, detail and technical decisions can develop together instead of being handed between separate phases."}</p>
					<p>{locale === "nb" ? "Jeg samarbeider direkte med virksomheter som trenger en tydelig digital identitet, og med kreative team som trenger noen som kan bevege seg fra konsept til produksjon." : "I collaborate directly with businesses that need a clear digital identity, and with creative teams that need someone who can move from concept into production."}</p>
				</div>
			</section>

			<section className={styles.capabilities} data-about-reveal>
				<h2>{locale === "nb" ? "Det jeg bringer inn i arbeidet" : "What I bring to the work"}</h2>
				<ul>
					{["Visual direction", "Digital design", "Product design", "UX / UI", "Interaction", "Front-end", "Creative development", "WebGL"].map((item) => <li key={item}><span>{item}</span><i>↗</i></li>)}
				</ul>
			</section>

			<section className={styles.now} data-about-reveal>
				<span>{locale === "nb" ? "Nå" : "Now"}</span>
				<p>{locale === "nb" ? "Åpen for freelanceprosjekter, kreative samarbeid og roller der design og utvikling møtes." : "Open to freelance projects, creative collaborations and roles where design and development meet."}</p>
				<a href='mailto:hei@kennethjorgensen.no'>hei@kennethjorgensen.no <i>↗</i></a>
			</section>

			<a className={styles.workLink} href='/#work' onClick={(event) => go(event, '/#work')}><span>{locale === "nb" ? "Se utvalgte arbeider" : "View selected work"}</span><strong>Work</strong><i>↗</i></a>
		</article>
	)
}
