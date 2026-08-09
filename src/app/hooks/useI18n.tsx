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
	const storedLang = window.localStorage.getItem("portfolio-locale")
	if (storedLang === "en" || storedLang === "nb") return storedLang
	// Norwegian first: default for all visitors unless ?lang=en is present.
	return "nb"
}

export type Translations = {
	languageName: string
	languageSwitchLabel: string
	menuOpen: string
	menuClose: string
	homeAboutLabel: string
	homeAboutTitle: string
	homeAboutBody: string
	homeAboutCta: string
	aboutLocation: string
	aboutHero: string
	aboutPortraitAlt: string
	aboutPortraitStatement: string
	aboutPracticeLabel: string
	aboutPracticeBody: [string, string]
	aboutCapabilitiesTitle: string
	aboutCapabilities: string[]
	aboutNowLabel: string
	aboutNowBody: string
	aboutWorkCta: string
	aboutWorkTitle: string
	expertiseEyebrow: string
	expertiseTitleLineOne: string
	expertiseTitleLineTwo: string
	expertiseAboutCta: string
	expertiseIntro: string
	expertiseCapabilitiesLabel: string
	expertiseFieldsLabel: string
	expertiseModes: Array<{ title: string; description: string; meta: string }>
	expertiseContexts: string[]
	auroraEyebrow: string
	auroraTitleLineOne: string
	auroraTitleLineTwo: string
	auroraExplanation: string
	auroraCalm: string
	auroraActive: string
	footerStatement: string
	footerAvailability: string
	footerNavigationLabel: string
	footerBackToTop: string
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
	headerHeroTitle: string
	headerHeroDescription: string
	headerProjectsCta: string
	headerLocation: string
	headerExplore: string
	headerOffer: string
	headerWorkCta: string
	headerContactCta: string
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
	contactBased: string
	contactWorldwide: string
	contactPrompt: string
	contactTitleLineOne: string
	contactTitleLineTwo: string
	contactAvailableLabel: string
	contactAvailableCopy: string
	contactFindLabel: string
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
		languageName: "English",
		languageSwitchLabel: "Change language",
		menuOpen: "Menu",
		menuClose: "Close",
		homeAboutLabel: "About me ",
		homeAboutTitle: "One line of thought. From direction to code.",
		homeAboutBody:
			"I design and build digital identities, websites and products for businesses and creative teams. Keeping design and development together means the original idea survives all the way to the screen.",
		homeAboutCta: "See how I work",
		aboutLocation: "Bodø, Norway",
		aboutHero:
			"Independent designer and developer. I shape the visual direction, interaction and front-end as one connected piece of work.",
		aboutPortraitAlt: "Kenneth Jørgensen under the northern lights in Bodø",
		aboutPortraitStatement:
			"I stay with an idea from its first outline to the moment someone uses it.",
		aboutPracticeLabel: "About",
		aboutPracticeBody: [
			"Based in Bodø, I work across visual direction, digital design, interaction and front-end development. Working across the boundary keeps the concept, details and technical decisions moving in the same direction.",
			"I work directly with businesses that need a distinct digital presence, and alongside studios that need an extra pair of eyes and hands from concept through production.",
		],
		aboutCapabilitiesTitle: "What I can take from idea to interface",
		aboutCapabilities: ["Visual direction", "Digital design", "Product design", "UX / UI", "Interaction", "Front-end", "Creative development", "WebGL"],
		aboutNowLabel: "Available",
		aboutNowBody:
			"For selected freelance projects, studio collaborations and the right permanent role—locally or internationally.",
		aboutWorkCta: "View selected work",
		aboutWorkTitle: "Work",
		expertiseEyebrow: "How I work / Where this work lives",
		expertiseTitleLineOne: "Fields",
		expertiseTitleLineTwo: "and contexts",
		expertiseAboutCta: "About me ",
		expertiseIntro: "A small set of decisions I bring to every project.",
		expertiseCapabilitiesLabel: "Ways of working",
			expertiseFieldsLabel: "",
		expertiseModes: [
			{ title: "Direction", description: "Find the idea worth keeping, then give it a visual point of view.", meta: "01 / make it distinct" },
			{ title: "Systems", description: "Turn that point of view into a clear, flexible language people can use.", meta: "02 / make it useful" },
			{ title: "Motion", description: "Let timing, feedback and atmosphere explain what the interface can do.", meta: "03 / make it felt" },
			{ title: "Build", description: "Carry the decisions into production so the finished thing still feels intentional.", meta: "04 / make it real" },
		],
		expertiseContexts: ["Digital identities", "Websites", "Products", "Experiments"],
		auroraEyebrow: "Live signal",
		auroraTitleLineOne: "Aurora as",
		auroraTitleLineTwo: "interface",
		auroraExplanation:
			"The live KP index drives the colour, intensity and movement of the aurora across this site. Move the signal to simulate the sky and see the interface respond.",
		auroraCalm: "Quiet sky",
		auroraActive: "Active sky",
		footerStatement: "Independent design and development from 67°N.",
		footerAvailability: "Available for selected projects and collaborations",
		footerNavigationLabel: "Footer navigation",
		footerBackToTop: "Back to top",
		aboutText:
			"I turn ideas into digital experiences — shaping the visual direction, interaction and code as one connected process. From the first sketch to the final line of code.",
		navAbout: "About",
		navWork: "Works",
		navContact: "Contact",
		kpLocation: "Bodø, Norway",
		headerTagline: "Designer. Developer. Occasional gamer.",
		headerTitleDesignedPrefix: "Designed in the ",
		headerTitleBuiltPrefix: "Built for the ",
		headerDarkWord: "dark",
		headerLightWord: "light",
		headerHeroTitle: "Digital direction, design and front-end.",
		headerHeroDescription: "I shape the idea and build the experience—for businesses and creative teams.",
		headerProjectsCta: "View projects",
		headerLocation: "LOCATION 67.2829° N, 14.4151° E",
		headerExplore: "Go exploring",
		headerOffer:
			"I design and build fast, distinctive websites and digital products — from visual direction to production-ready React.",
		headerWorkCta: "View selected work",
		headerContactCta: "Discuss a project",
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
		contactTitle: "A project. A studio. Let's talk.",
		contactIntro:
			"If you need someone who can shape the design and build the result, send me a note.",
		contactAvailability: "Available for hire - anywhere.",
		contactEmailNote:
			"Share a bit about your project, timeline and what a good outcome looks like. I'll get back to you quickly. Or we can skip the email and go aurora hunting!",
		contactPortraitText: "My serious face, let's have a chat",
		contactBased: "Based in Bodø",
		contactWorldwide: "Working across borders",
		contactPrompt: "A project, a collaboration or the right role?",
		contactTitleLineOne: "Let's",
		contactTitleLineTwo: "talk",
		contactAvailableLabel: "Available for",
		contactAvailableCopy: "Selected projects / studio collaborations / permanent roles",
		contactFindLabel: "Find me",
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
		languageName: "Norsk",
		languageSwitchLabel: "Bytt språk",
		menuOpen: "Meny",
		menuClose: "Lukk",
		homeAboutLabel: "Om meg ",
		homeAboutTitle: "Én tanke. Fra retning til kode.",
		homeAboutBody:
			"Jeg designer og bygger digitale identiteter, nettsider og produkter for virksomheter og kreative team. Når design og utvikling skjer samlet, overlever den opprinnelige idéen helt frem til skjermen.",
		homeAboutCta: "Se hvordan jeg jobber",
		aboutLocation: "Bodø, Norge",
		aboutHero:
			"Selvstendig designer og utvikler. Jeg former visuell retning, interaksjon og frontend som ett sammenhengende arbeid.",
		aboutPortraitAlt: "Kenneth Jørgensen under nordlyset i Bodø",
		aboutPortraitStatement:
			"Jeg følger en idé fra første omriss til øyeblikket noen tar den i bruk.",
		aboutPracticeLabel: "Om meg",
		aboutPracticeBody: [
			"Fra Bodø jobber jeg med visuell retning, digital design, interaksjon og frontend. Ved å arbeide på tvers holder jeg konseptet, detaljene og de tekniske valgene i samme retning.",
			"Jeg jobber direkte med virksomheter som trenger et tydelig digitalt uttrykk, og sammen med studioer som trenger ekstra kapasitet fra konsept til produksjon.",
		],
		aboutCapabilitiesTitle: "Det jeg kan ta fra idé til grensesnitt",
		aboutCapabilities: ["Visuell retning", "Digital design", "Produktdesign", "UX / UI", "Interaksjon", "Frontend", "Kreativ utvikling", "WebGL"],
		aboutNowLabel: "Tilgjengelig",
		aboutNowBody:
			"For utvalgte oppdrag, studiosamarbeid og den rette faste rollen—lokalt eller internasjonalt.",
		aboutWorkCta: "Se utvalgte prosjekter",
		aboutWorkTitle: "Arbeid",
		expertiseEyebrow: "Hvordan jeg jobber",
		expertiseTitleLineOne: "Fagfelt",
		expertiseTitleLineTwo: "og områder",
		expertiseAboutCta: "Om meg ",
		expertiseIntro: "Et lite sett med valg jeg tar med inn i hvert prosjekt.",
		expertiseCapabilitiesLabel: "Arbeidsmåter",
		expertiseFieldsLabel: "",
		expertiseModes: [
			{ title: "Retning", description: "Jeg finner idéen det er verdt å holde fast i, og gir den et tydelig visuelt ståsted.", meta: "01 / gjør det særpreget" },
			{ title: "System", description: "Jeg gjør ståstedet om til et klart og fleksibelt språk folk faktisk kan bruke.", meta: "02 / gjør det nyttig" },
			{ title: "Bevegelse", description: "Timing, respons og atmosfære får forklare hva grensesnittet kan gjøre.", meta: "03 / gjør det merkbart" },
			{ title: "Gjennomføring", description: "Jeg tar valgene med inn i produksjon, så det ferdige fortsatt føles gjennomtenkt.", meta: "04 / gjør det virkelig" },
		],
		expertiseContexts: ["Digitale identiteter", "Nettsider", "Produkter", "Eksperimenter"],
		auroraEyebrow: "Levende signal",
		auroraTitleLineOne: "Nordlyset som",
		auroraTitleLineTwo: "grensesnitt",
		auroraExplanation:
			"Den levende KP-indeksen styrer fargen, intensiteten og bevegelsen i nordlyset på siden. Flytt signalet for å simulere himmelen og se grensesnittet svare.",
		auroraCalm: "Stille himmel",
		auroraActive: "Aktiv himmel",
		footerStatement: "Selvstendig design og utvikling fra 67°N.",
		footerAvailability: "Tilgjengelig for utvalgte prosjekter og samarbeid",
		footerNavigationLabel: "Bunnavigasjon",
		footerBackToTop: "Til toppen",
		aboutText:
			"Jeg gjør ideer om til digitale opplevelser — og former visuell retning, interaksjon og kode som én sammenhengende prosess. Fra første skisse til siste linje med kode.",
		navAbout: "Om",
		navWork: "Prosjekter",
		navContact: "Kontakt",
		kpLocation: "Bodø, Norge",
		headerTagline: "Designer. Utvikler. Sporadisk gamer.",
		headerTitleDesignedPrefix: "Designet i ",
		headerTitleBuiltPrefix: "Bygget for ",
		headerDarkWord: "mørket",
		headerLightWord: "lyset",
		headerHeroTitle: "Digital retning, design og frontend.",
		headerHeroDescription: "Jeg former idéer og bygger opplevelser",
		headerProjectsCta: "Se prosjekter",
		headerLocation: "LOKASJON 67.2829° N, 14.4151° E",
		headerExplore: "Utforsk",
		headerOffer:
			"Jeg designer og utvikler raske, særpregede nettsider og digitale produkter — fra visuell retning til ferdig React-løsning.",
		headerWorkCta: "Se utvalgte prosjekter",
		headerContactCta: "Diskuter et prosjekt",
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
		contactTitle: "Et prosjekt. Et studio. La oss snakke.",
		contactIntro:
			"Trenger du noen som kan forme designet og bygge resultatet, send meg en melding.",
		contactAvailability: "Tilgjengelig for nye oppdrag — lokalt og internasjonalt.",
		contactEmailNote:
			"Fortell litt om prosjektet, tidsplanen og hva du ønsker å oppnå. Jeg svarer så raskt som mulig. Eller så kan vi hoppe over e-posten og dra på nordlysjakt!",
		contactPortraitText: "Det alvorlige trynet mitt, la oss ta en prat!",
		contactBased: "Basert i Bodø",
		contactWorldwide: "Jobber på tvers av grenser",
		contactPrompt: "Et prosjekt, et samarbeid eller riktig rolle?",
		contactTitleLineOne: "La oss",
		contactTitleLineTwo: "snakke",
		contactAvailableLabel: "Tilgjengelig for",
		contactAvailableCopy: "Utvalgte prosjekter / studiosamarbeid / faste roller",
		contactFindLabel: "Finn meg",
		footerTagline: "Designer. Utvikler. <br /> Sporadisk gamer.",
		footerNavTitle: "Navigasjon",
		footerHome: "Hjem",
		footerAbout: "Om",
		footerWork: "Prosjekter",
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
	setLocale: (locale: AppLocale) => void
	toggleLocale: () => void
	renderText: (value: string) => ReactNode
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
	const [locale, setLocale] = useState<AppLocale>(detectLocale)

	useEffect(() => {
		setLocale(detectLocale())
		const onPopState = () => setLocale(detectLocale())
		window.addEventListener("popstate", onPopState)
		return () => window.removeEventListener("popstate", onPopState)
	}, [])

	useEffect(() => {
		document.documentElement.lang = locale === "nb" ? "nb-NO" : "en"
		window.localStorage.setItem("portfolio-locale", locale)
		const url = new URL(window.location.href)
		if (url.searchParams.get("lang") !== locale) {
			url.searchParams.set("lang", locale)
			window.history.replaceState(window.history.state, "", url)
		}
	}, [locale])

	const value = useMemo(
		() => ({
			locale,
			t: translations[locale],
			setLocale,
			toggleLocale: () => setLocale((current) => current === "nb" ? "en" : "nb"),
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
