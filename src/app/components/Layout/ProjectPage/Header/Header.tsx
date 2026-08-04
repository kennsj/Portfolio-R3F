import { useLocation } from "@tanstack/react-router"
import styles from "./Header.module.scss"
import { useI18n } from "../../../../hooks/useI18n"

type ProjectEntry = {
	title: string
	role: string
	type: string
	image: string
	video?: string
	description: { en: string; nb: string }
	next: { title: string; href: string }
	concept?: boolean
}

const projects: Record<string, ProjectEntry> = {
	manshausen: {
		title: "Manshausen",
		role: "Design / Frontend",
		type: "Hospitality / Personal project",
		image: "/images/kenneth-aurora.jpg",
		video: "/videos/manshausen.webm",
		concept: true,
		description: {
			en: "A self-initiated redesign exploring how a remote northern destination can feel immediate, atmospheric and easy to navigate online.",
			nb: "Et egeninitiert redesign som utforsker hvordan en avsides nordnorsk destinasjon kan føles nær, atmosfærisk og enkel å navigere på nett.",
		},
		next: { title: "Verchia", href: "/project/verchia" },
	},
	verchia: {
		title: "Verchia",
		role: "Visual direction / Design / Frontend",
		type: "Fashion / Digital experience",
		image: "/images/verchia.webp",
		description: {
			en: "Visual direction, interaction and a custom React implementation for an international fashion label.",
			nb: "Visuell retning, interaksjon og en skreddersydd React-implementasjon for et internasjonalt motemerke.",
		},
		next: { title: "Pradelna", href: "/project/pradelna" },
	},
	pradelna: {
		title: "Pradelna",
		role: "Frontend development",
		type: "Services / Website",
		image: "/images/pradelna.webp",
		description: {
			en: "A responsive frontend implementation with a clear information structure for a local service business.",
			nb: "En responsiv frontend med tydelig informasjonsstruktur for en lokal tjenestebedrift.",
		},
		next: { title: "Dialog eXe", href: "/project/dialog-exe" },
	},
	"dialog-exe": {
		title: "Dialog eXe",
		role: "UX / UI",
		type: "Product design / Concept",
		image: "/images/dx-kino.webp",
		concept: true,
		description: {
			en: "A UX and interface concept focused on making complex dialogue flows easier to understand and use.",
			nb: "Et UX- og grensesnittkonsept som gjør komplekse dialogflyter enklere å forstå og bruke.",
		},
		next: { title: "Manshausen", href: "/project/manshausen" },
	},
}

const Header = ({ url, urlText }: { url?: string; urlText?: string }) => {
	const { pathname } = useLocation()
	const { locale } = useI18n()
	const slug = pathname.split("/").filter(Boolean).at(-1) || "manshausen"
	const project = projects[slug] || projects.manshausen

	return (
		<article className={styles.project}>
			<header className={styles.header}>
				<div className={styles.index}>( {String(Object.keys(projects).indexOf(slug) + 1).padStart(2, "0")} )</div>
				<h1>{project.title}</h1>
				<span className={styles.scroll}>({locale === "nb" ? "Rull" : "Scroll"})</span>
			</header>

			<section className={styles.intro}>
				<dl>
					<div><dt>{locale === "nb" ? "Rolle" : "Role"}</dt><dd>{project.role}</dd></div>
					<div><dt>{locale === "nb" ? "Type" : "Type"}</dt><dd>{project.type}</dd></div>
					<div><dt>{locale === "nb" ? "Status" : "Status"}</dt><dd>{project.concept ? (locale === "nb" ? "Konsept" : "Concept") : (locale === "nb" ? "Levert arbeid" : "Delivered work")}</dd></div>
				</dl>
				<p>{project.description[locale]}</p>
				{url ? <a href={url} target='_blank' rel='noreferrer'>{urlText || (locale === "nb" ? "Besøk nettsiden" : "Visit website")} ↗</a> : null}
			</section>

			<figure className={styles.heroMedia}>
				{project.video ? (
					<video
						autoPlay
						loop
						muted
						playsInline
						poster={project.image}
						aria-label={`${project.title} project preview`}
					>
						<source src={project.video} type="video/webm" />
					</video>
				) : (
					<img src={project.image} alt={`${project.title} project preview`} />
				)}
			</figure>

			<section className={styles.statement}>
				<span>{locale === "nb" ? "Tilnærming" : "Approach"}</span>
				<h2>{locale === "nb" ? "Designet og implementasjonen utvikles som én sammenhengende opplevelse." : "The design and implementation develop as one connected experience."}</h2>
			</section>

			<a className={styles.next} href={project.next.href}>
				<span>{locale === "nb" ? "Neste prosjekt" : "Next project"}</span>
				<strong>{project.next.title}</strong>
			</a>
		</article>
	)
}

export default Header
