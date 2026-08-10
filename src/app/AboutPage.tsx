import { useLayoutEffect } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useI18n } from "./hooks/useI18n"
import HeadingAnimation from "./components/UI/HeadingAnimation/HeadingAnimation"
import styles from "./styles/AboutPage.module.scss"

gsap.registerPlugin(ScrollTrigger)

const content = {
	nb: {
		label: "Om / 01",
		intro: "Designer og frontendutvikler fra Bodø. Jeg arbeider i skjæringspunktet mellom visuell retning, interaksjon og kode.",
		portrait: "Jeg følger arbeidet fra tidlig retning og struktur til komponenter, interaksjon og ferdig frontend.",
		practice: [
			"Fra Bodø jobber jeg med design og frontend som ett sammenhengende fag. Det gjør det lettere å holde idé, hierarki og tekniske valg i samme retning gjennom hele prosjektet.",
			"Jeg samarbeider direkte med virksomheter og som ekstra kapasitet for kreative studioer — fra tidlig konsept og Figma til implementasjon, testing og detaljering i kode.",
		],
		experience: "Omtrent ett år med design og frontend for nettsider til kinoer og kulturarenaer, kombinert med selvstendig arbeid og egne konsepter innen reiseliv, tjenester og lokale virksomheter.",
		process: [
			["Forstå", "Avklare kontekst, målgruppe og hvilket problem som faktisk bør løses."],
			["Forme", "Utvikle retning, hierarki, interaksjon og et visuelt språk som tåler bruk."],
			["Bygge og foredle", "Oversette idéen til komponenter og frontend, og raffinere detaljene gjennom testing."],
		],
		capabilities: ["Visuell retning", "Webdesign", "Produktdesign", "UX/UI", "Interaksjonsdesign", "Designsystemer", "Prototyping", "Frontendutvikling", "Motion og kreativ utvikling"],
		tools: "Figma, React, TypeScript, CSS, GSAP, Three.js og React Three Fiber.",
		availability: "Tilgjengelig for utvalgte prosjekter, studiosamarbeid og relevante faste roller.",
	},
	en: {
		label: "About / 01",
		intro: "Designer and front-end developer based in Bodø, working where visual direction, interaction, and code meet.",
		portrait: "I follow the work from early direction and structure through components, interaction, and finished front-end.",
		practice: [
			"From Bodø, I work across design and front-end as one connected practice. That keeps the idea, hierarchy, and technical decisions moving in the same direction throughout a project.",
			"I collaborate directly with businesses and as additional capacity for creative studios — from early concepts and Figma through implementation, testing, and refinement in code.",
		],
		experience: "Around one year of design and front-end work for cinema and cultural-venue websites, alongside independent work and self-initiated concepts across travel, services, and local businesses.",
		process: [
			["Understand", "Clarify the context, audience, and the problem that actually needs solving."],
			["Shape", "Develop direction, hierarchy, interaction, and a visual language built for use."],
			["Build and refine", "Translate the idea into components and front-end, then refine the details through testing."],
		],
		capabilities: ["Visual direction", "Web design", "Product design", "UX/UI", "Interaction design", "Design systems", "Prototyping", "Front-end development", "Motion and creative development"],
		tools: "Figma, React, TypeScript, CSS, GSAP, Three.js, and React Three Fiber.",
		availability: "Available for selected projects, studio collaborations, and relevant permanent roles.",
	},
} as const

export default function AboutPage() {
	const { locale, t } = useI18n()
	const copy = content[locale]

	useLayoutEffect(() => {
		window.scrollTo(0, 0)
	}, [])
	useGSAP(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
		gsap.utils.toArray<HTMLElement>("[data-about-reveal]").forEach((element) => {
			gsap.from(element, {
				y: 48,
				autoAlpha: 0,
				immediateRender: false,
				duration: .85,
				ease: "shiftReveal",
				scrollTrigger: { trigger: element, start: "top 88%", once: true },
			})
		})
	})

	return (
		<article className={styles.page}>
			<header className={styles.hero}>
				<div className={styles.coordinates}><span>{copy.label}</span><span>Bodø / 67°17′N</span></div>
				<h1>Kenneth <span>Jørgensen</span></h1>
				<p>{copy.intro}</p>
			</header>

			<section className={styles.portrait} data-about-reveal>
				<figure><img src="/images/kenneth-aurora.jpg" alt={t.aboutPortraitAlt} /></figure>
				<p>{copy.portrait}</p>
			</section>

			<section className={styles.story} data-about-reveal>
				<span>02 / {locale === "nb" ? "Praksis" : "Practice"}</span>
				<div>{copy.practice.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
			</section>

			<section className={styles.experience} data-about-reveal>
				<span>03 / {locale === "nb" ? "Erfaring" : "Experience"}</span>
				<HeadingAnimation level={2}>{locale === "nb" ? "Erfaring i korte trekk." : "Experience, briefly."}</HeadingAnimation>
				<p>{copy.experience}</p>
			</section>

			<section className={styles.process} data-about-reveal>
				<div className={styles.sectionHead}><span>04 / {locale === "nb" ? "Arbeidsmåte" : "Approach"}</span><HeadingAnimation level={2}>{locale === "nb" ? "Fra retning til ferdig grensesnitt." : "From direction to finished interface."}</HeadingAnimation></div>
				<ol>{copy.process.map(([title, description], index) => <li key={title}><small>{String(index + 1).padStart(2, "0")}</small><h3>{title}</h3><p>{description}</p></li>)}</ol>
			</section>

			<section className={styles.capabilities} data-about-reveal>
				<div className={styles.sectionHead}><span>05 / {locale === "nb" ? "Fagfelt" : "Capabilities"}</span><HeadingAnimation level={2}>{locale === "nb" ? "Det jeg kan ta fra idé til grensesnitt." : "What I can take from idea to interface."}</HeadingAnimation></div>
				<ul>{copy.capabilities.map((item, index) => <li key={item}><small>{String(index + 1).padStart(2, "0")}</small><span>{item}</span></li>)}</ul>
			</section>

			<section className={styles.tools} data-about-reveal>
				<span>06 / {locale === "nb" ? "Verktøy og teknologi" : "Tools and technology"}</span>
				<p>{copy.tools}</p>
			</section>

			<p className={styles.availability} data-about-reveal>{copy.availability}</p>
		</article>
	)
}
