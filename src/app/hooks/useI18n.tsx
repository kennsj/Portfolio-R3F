import {
	Fragment,
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react"

export type AppLocale = "en" | "nb"

/** Slugs under `/project/:slug` with dedicated SEO copy. */
export type ProjectSlug = "verchia" | "pradelna" | "dialog-exe" | "manshausen"

type ProjectSeoEntry = { title: string; description: string }

function detectLocale(): AppLocale {
	if (typeof window === "undefined") return "nb"
	const urlLang = new URLSearchParams(window.location.search).get("lang")
	if (urlLang === "en") return "en"
	if (urlLang === "nb") return "nb"
	// Norwegian first: default for all visitors unless ?lang=en is present.
	return "nb"
}

export type Translations = {
	aboutText: string
	navAbout: string
	navWork: string
	navContact: string
	kpLocation: string
	headerTagline: string
	headerTitleDesignedPrefix: string
	headerTitleBuiltPrefix: string
	headerDarkWord: string
	headerLightWord: string
	headerLocation: string
	headerExplore: string
	projectsTitle: string
	projectCaseStudy: string
	expertiseTitle: string
	expertiseWebDesignTitle: string
	expertiseWebDesignDescription: string
	expertiseWebDevTitle: string
	expertiseWebDevDescription: string
	expertiseGraphicTitle: string
	expertiseGraphicDescription: string
	expertiseToolsTitle: string
	contactTitle: string
	contactIntro: string
	contactAvailability: string
	contactEmailNote: string
	contactPortraitText: string
	footerTagline: string
	footerNavTitle: string
	footerHome: string
	footerAbout: string
	footerWork: string
	footerContact: string
	footerContactTitle: string
	footerResume: string
	projectHeaderTitle: string
	projectHeaderComingSoon: string
	projectHeaderButton: string
	errorTitle: string
	errorPrefix: string
	auroraLocationCity: string
	auroraLocationRegion: string
	auroraKpIndex: string
	auroraVisibleTonight: string
	auroraSliderLabel: string
	auroraModeManual: string
	auroraModeLive: string
	auroraReset: string
	auroraResetAria: string
	auroraModeAria: string
	auroraDisclaimer: string
	seoTitle: string
	seoDescription: string
	seoAboutTitle: string
	seoAboutDescription: string
	seoProjectIndexTitle: string
	seoProjectIndexDescription: string
	projectSeoBySlug: Record<ProjectSlug, ProjectSeoEntry>
	seoSiteName: string
	seoKeywords: string
}

const translations: Record<AppLocale, Translations> = {
	en: {
		aboutText:
			"I design and build digital experiences from Bodø, Norway. With a focus on detail, performance, and usability, I enjoy being part of the entire process, from the first sketch to the final line of code.",
		navAbout: "About",
		navWork: "Works",
		navContact: "Contact",
		kpLocation: "Bodø, Norway",
		headerTagline: "Designer. Developer. Occasional gamer.",
		headerTitleDesignedPrefix: "Designed in the ",
		headerTitleBuiltPrefix: "Built for the ",
		headerDarkWord: "dark",
		headerLightWord: "light",
		headerLocation: "LOCATION 67.2829° N, 14.4151° E",
		headerExplore: "Go exploring",
		projectsTitle: "Selected work",
		projectCaseStudy: "Case study",
		expertiseTitle: "Expertise",
		expertiseWebDesignTitle: "Web design",
		expertiseWebDesignDescription:
			"I obsess over the details most people will not notice but will feel. The spacing, the timing, the way a page guides you without you realizing it. I cannot help it.",
		expertiseWebDevTitle: "Web development",
		expertiseWebDevDescription:
			"I write the code myself, because I have never found a shortcut that does not show up somewhere. React and custom development primarily. Webflow and Framer when it genuinely serves the project better.",
		expertiseGraphicTitle: "Graphic design",
		expertiseGraphicDescription:
			"I approach visual identity the same way I approach code; I cannot let it go until it feels exactly right. It shows.",
		expertiseToolsTitle: "Tools",
		contactTitle: "Let's make something worth looking at",
		contactIntro:
			"Now you know where the background comes from. And where I come from.",
		contactAvailability: "Available for hire - anywhere.",
		contactEmailNote:
			"Share a bit about your project, timeline and what a good outcome looks like. I'll get back to you quickly. Or we can skip the email and go aurora hunting!",
		contactPortraitText: "My serious face, let's have a chat",
		footerTagline: "Designer. Developer. <br /> Occasional gamer.",
		footerNavTitle: "Navigation",
		footerHome: "Home",
		footerAbout: "About",
		footerWork: "Work",
		footerContact: "Contact",
		footerContactTitle: "Contact",
		footerResume: "CV / Resume",
		projectHeaderTitle: "Case Study",
		projectHeaderComingSoon: "coming soon",
		projectHeaderButton: "Explore case",
		errorTitle: "Something went wrong",
		errorPrefix: "Error",
		auroraLocationCity: "Bodø,",
		auroraLocationRegion: "Norway - 67°N",
		auroraKpIndex: "KP Index",
		auroraVisibleTonight: "- visible from Bodø tonight",
		auroraSliderLabel: "Adjust the Aurora forecast",
		auroraModeManual: "Manual",
		auroraModeLive: "Live",
		auroraReset: "Reset",
		auroraResetAria: "Reset the Aurora forecast",
		auroraModeAria: "Manual or Live",
		auroraDisclaimer:
			"Disclaimer: The aurora depicted in the background is an artistic interpretation. Colours, speed, and behaviour may not reflect actual conditions above Bodo. The best chances are between September and April, if the clouds cooperate, which is rarely.",
		seoTitle:
			"Designer & Developer in Bodø, Nordland | Northern Norway — Kenneth Jørgensen",
		seoDescription:
			"Kenneth Jørgensen is a designer and web developer in Bodø, Nordland, northern Norway — available for projects across Nord-Norge and internationally.",
		seoAboutTitle:
			"About Kenneth Jørgensen — Designer & developer in Bodø, Nordland",
		seoAboutDescription:
			"How I work across design and code, why the small details matter, and what shapes my projects — from Bodø, Nordland, northern Norway.",
		seoProjectIndexTitle:
			"Selected work — portfolio projects | Kenneth Jørgensen",
		seoProjectIndexDescription:
			"Case studies in web design, UI, and front-end development by Kenneth Jørgensen — designer and developer in Bodø, Nordland, northern Norway.",
		projectSeoBySlug: {
			manshausen: {
				title: "Manshausen — case study | Kenneth Jørgensen",
				description:
					"Design and front-end build for Manshausen: visual direction, interaction, and a React-led implementation.",
			},
			verchia: {
				title: "Verchia — case study | Kenneth Jørgensen",
				description:
					"Design and front-end build for Verchia: visual direction, interaction, and a React-led implementation.",
			},
			pradelna: {
				title: "Pradelna — case study | Kenneth Jørgensen",
				description:
					"Front-end development for Pradelna — structure, performance, and craft.",
			},
			"dialog-exe": {
				title: "Dialog eXe — UX/UI case study | Kenneth Jørgensen",
				description:
					"UX and UI for Dialog eXe: flows, visual language, and interface design.",
			},
		},
		seoSiteName: "Kenneth Jørgensen Portfolio",
		seoKeywords:
			"designer bodø, developer bodø, designer nordland, developer nordland, designer northern norway, developer northern norway, nord-norge, web designer bodø, web developer bodø, web design bodø, web design nordland, webside bodø, nettside bodø, grafisk design bodø, grafisk design nordland, graphic design nordland, shopify bodø",
	},
	nb: {
		aboutText:
			"En designer og utvikler fra Bodø som bygger digitale opplevelser med fokus på detaljer, ytelse og brukervennlighet. Jeg trives best når jeg får være med hele veien, fra første skisse til siste linje med kode.",
		navAbout: "Om",
		navWork: "Arbeid",
		navContact: "Kontakt",
		kpLocation: "Bodø, Norge",
		headerTagline: "Designer. Utvikler. Sporadisk gamer.",
		headerTitleDesignedPrefix: "Designet i ",
		headerTitleBuiltPrefix: "Bygget for ",
		headerDarkWord: "mørket",
		headerLightWord: "lyset",
		headerLocation: "LOKASJON 67.2829° N, 14.4151° E",
		headerExplore: "Utforsk",
		projectsTitle: "Utvalgte prosjekter",
		projectCaseStudy: "Case",
		expertiseTitle: "Ekspertise",
		expertiseWebDesignTitle: "Webdesign",
		expertiseWebDesignDescription:
			"Jeg henger meg opp i detaljer de fleste ikke legger merke til, men som de likevel kjenner på. Avstandene, timingen, hvordan en side leder deg uten at du tenker over det. Jeg kan ikke la være med å jobbe med det.",
		expertiseWebDevTitle: "Webutvikling",
		expertiseWebDevDescription:
			"Jeg skriver koden selv, fordi jeg aldri har funnet en snarvei som ikke dukker opp et eller annet sted. Hovedsakelig React og tilpasset utvikling. Webflow og Framer når det virkelig tjener prosjektet bedre.",
		expertiseGraphicTitle: "Grafisk design",
		expertiseGraphicDescription:
			"Jeg har samme tilnærming til visuell utforming som til koding; jeg kan ikke gi slipp på det før det føles helt riktig. Det merkes.",
		expertiseToolsTitle: "Verktøy",
		contactTitle: "La oss lage noe verdt å se på",
		contactIntro:
			"Nå vet du hvor bakgrunnen kommer fra. Og hvor jeg kommer fra.",
		contactAvailability: "Tilgjengelig for oppdrag - hvor som helst.",
		contactEmailNote:
			"Fortell litt om prosjektet ditt, tidsplanen og hva et godt utfall vil se ut for deg. Jeg svarer så raskt som mulig. Eller så kan vi hoppe over e-posten og dra på nordlysjakt!",
		contactPortraitText: "Det alvorlige trynet mitt, la oss ta en prat!",
		footerTagline: "Designer. Utvikler. <br /> Sporadisk gamer.",
		footerNavTitle: "Navigasjon",
		footerHome: "Hjem",
		footerAbout: "Om",
		footerWork: "Arbeid",
		footerContact: "Kontakt",
		footerContactTitle: "Kontakt",
		footerResume: "CV",
		projectHeaderTitle: "Case",
		projectHeaderComingSoon: "kommer snart",
		projectHeaderButton: "Utforsk case",
		errorTitle: "Noe gikk galt",
		errorPrefix: "Feil",
		auroraLocationCity: "Bodø,",
		auroraLocationRegion: "Norge - 67°N",
		auroraKpIndex: "KP-indeks",
		auroraVisibleTonight: "- synlig fra Bodø i kveld",
		auroraSliderLabel: "Juster nordlysvarselet",
		auroraModeManual: "Manuell",
		auroraModeLive: "Live",
		auroraReset: "Nullstill",
		auroraResetAria: "Nullstill nordlysvarselet",
		auroraModeAria: "Manuell eller Live",
		auroraDisclaimer:
			"Forbehold: Nordlyset i bakgrunnen er en kunstnerisk tolkning. Farger, hastighet og bevegelse speiler ikke alltid faktiske forhold over Bodø. De beste sjansene er mellom september og april, hvis skyene samarbeider, noe de sjelden gjør.",
		seoTitle:
			"Designer og utvikler i Bodø, Nordland | Nord-Norge — Kenneth Jørgensen",
		seoDescription:
			"Kenneth Jørgensen er designer og webutvikler i Bodø, Nordland, Nord-Norge — tilgjengelig for lokale prosjekter og internasjonale samarbeid.",
		seoAboutTitle:
			"Om Kenneth Jørgensen — Designer og utvikler i Bodø, Nordland",
		seoAboutDescription:
			"Om hvordan jeg jobber på tvers av design og kode, hvorfor detaljer betyr noe, og hva som driver prosjektene mine — fra Bodø, Nordland, i Nord-Norge.",
		seoProjectIndexTitle: "Utvalgte prosjekter — Kenneth Jørgensen",
		seoProjectIndexDescription:
			"Case og arbeid innen webdesign, UI og frontend av Kenneth Jørgensen — designer og utvikler i Bodø, Nordland, Nord-Norge.",
		projectSeoBySlug: {
			manshausen: {
				title: "Manshausen — case | Kenneth Jørgensen",
				description:
					"Design and front-end build for Manshausen: visual direction, interaction, and a React-led implementation.",
			},
			verchia: {
				title: "Verchia — case | Kenneth Jørgensen",
				description:
					"Design og frontend for Verchia — visuell retning, interaksjon og React-basert utførelse.",
			},
			pradelna: {
				title: "Pradelna — case | Kenneth Jørgensen",
				description:
					"Frontendutvikling for Pradelna — struktur, ytelse og finish.",
			},
			"dialog-exe": {
				title: "Dialog eXe — UX/UI-case | Kenneth Jørgensen",
				description:
					"UX og UI for Dialog eXe — flyt, visuelt språk og grensesnitt.",
			},
		},
		seoSiteName: "Kenneth Jørgensen Portfolio",
		seoKeywords:
			"designer bodø, utvikler bodø, designer nordland, utvikler nordland, designer nord-norge, utvikler nord-norge, web designer bodø, webutvikler bodø, webdesign bodø, webdesign nordland, nettside bodø, nettside nordland, grafisk design bodø, grafisk design nordland, webside bodø, shopify bodø",
	},
}

/** Default Open Graph / Twitter image (absolute URL built in RootLayout). */
export const SEO_DEFAULT_OG_IMAGE_PATH = "/images/og.jpg"

export function getSeoForPath(
	pathname: string,
	isAbout: boolean,
	t: Translations,
): { title: string; description: string } {
	if (isAbout) {
		return { title: t.seoAboutTitle, description: t.seoAboutDescription }
	}
	const path = pathname.replace(/\/$/, "") || "/"
	if (path === "/project") {
		return {
			title: t.seoProjectIndexTitle,
			description: t.seoProjectIndexDescription,
		}
	}
	const match = /^\/project\/([^/]+)$/.exec(path)
	if (match) {
		const slug = match[1] as ProjectSlug
		const entry = t.projectSeoBySlug[slug]
		if (entry) return { title: entry.title, description: entry.description }
	}
	return { title: t.seoTitle, description: t.seoDescription }
}

type I18nContextValue = {
	locale: AppLocale
	t: Translations
	renderText: (value: string) => ReactNode
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
	const [locale, setLocale] = useState<AppLocale>("nb")

	useEffect(() => {
		setLocale(detectLocale())
	}, [])

	useEffect(() => {
		document.documentElement.lang = locale === "nb" ? "nb-NO" : "en"
	}, [locale])

	const value = useMemo(
		() => ({
			locale,
			t: translations[locale],
			renderText: (value: string) => {
				const parts = value.split(/<br\s*\/?>/gi)
				if (parts.length === 1) return value
				return parts.map((part, index) => (
					<Fragment key={`${part}-${index}`}>
						{part}
						{index < parts.length - 1 ? <br /> : null}
					</Fragment>
				))
			},
		}),
		[locale],
	)

	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
	const ctx = useContext(I18nContext)
	if (!ctx) {
		throw new Error("useI18n must be used inside I18nProvider")
	}
	return ctx
}
