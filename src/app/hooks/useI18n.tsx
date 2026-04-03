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

const NORWEGIAN_PREFIXES = ["nb", "nn", "no"] as const

function isNorwegianLanguageTag(tag: string) {
	const lower = tag.toLowerCase()
	return NORWEGIAN_PREFIXES.some((prefix) => lower.startsWith(prefix))
}

function detectLocale(): AppLocale {
	if (typeof window === "undefined") return "en"
	const urlLang = new URLSearchParams(window.location.search).get("lang")
	if (urlLang === "nb") return "nb"
	if (urlLang === "en") return "en"
	const langs = window.navigator.languages ?? [window.navigator.language]
	return langs.some((lang) => isNorwegianLanguageTag(lang)) ? "nb" : "en"
}

type Translations = {
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
	seoSiteName: string
	seoKeywords: string
	designBodoTitle: string
	designBodoIntro: string
	designBodoServicesTitle: string
	designBodoService1: string
	designBodoService2: string
	designBodoService3: string
	designBodoCta: string
}

const translations: Record<AppLocale, Translations> = {
	en: {
		aboutText:
			"I find it hard to let go of a project until both the design and the code feel right. Which is probably why I ended up doing both.",
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
			"I will get back to you quickly. Or we can skip the email and go aurora hunting!",
		contactPortraitText: "My serious face, let's talk",
		footerTagline: "Designer. Developer. Occasional gamer.",
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
		seoTitle: "Web Developer & Digital Designer from Bodø - Kenneth Jørgensen",
		seoDescription:
			"Kenneth Jørgensen is a web developer and digital designer from Bodø, Norway, available for local projects and international collaborations.",
		seoSiteName: "Kenneth Jørgensen Portfolio",
		seoKeywords:
			"web developer bodø, web designer bodø, digital designer bodø, design bodø, web design norge, international web designer",
		designBodoTitle: "Designed in Bodø",
		designBodoIntro:
			"I help brands and teams in Bodø design and develop websites that look great, perform well, and convert.",
		designBodoServicesTitle: "Services",
		designBodoService1: "Web design and visual guidance",
		designBodoService2: "Frontend development in React and custom stacks",
		designBodoService3:
			"Brand-focused digital experiences for local businesses and teams",
		designBodoCta:
			"Need design in Bodø? Send me an email at hei@kennethjorgensen.no.",
	},
	nb: {
		aboutText:
			"Jeg har vanskelig for å gi slipp på et prosjekt før både designet og koden føles riktig. Det er nok derfor jeg endte opp med å gjøre begge deler.",
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
			"Jeg svarer så raskt som mulig. Eller så kan vi hoppe over e-posten og dra på nordlysjakt!",
		contactPortraitText: "Mitt alvorlige ansikt, la oss snakke sammen",
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
		seoTitle: "Webutvikler og digital designer fra Bodø - Kenneth Jørgensen",
		seoDescription:
			"Kenneth Jørgensen er webutvikler og digital designer fra Bodø, tilgjengelig for både lokale prosjekter og internasjonale samarbeid.",
		seoSiteName: "Kenneth Jørgensen Portfolio",
		seoKeywords:
			"webutvikler bodø, webdesigner bodø, digital designer bodø, design bodø, webdesign norge, internasjonal webdesigner",
		designBodoTitle: "Designet i Bodø",
		designBodoIntro:
			"Jeg hjelper bedrifter og team i Bodø med nettsider som ser bra ut, yter godt og skaper resultater.",
		designBodoServicesTitle: "Tjenester",
		designBodoService1: "Webdesign og visuell retning",
		designBodoService2: "Frontend-utvikling i React og skreddersydde stacker",
		designBodoService3:
			"Merkevarefokuserte digitale opplevelser for lokale virksomheter",
		designBodoCta:
			"Trenger du design eller webutvikling i Bodø? Send meg en e-post på hei@kennethjorgensen.no.",
	},
}

type I18nContextValue = {
	locale: AppLocale
	t: Translations
	renderText: (value: string) => ReactNode
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
	const [locale, setLocale] = useState<AppLocale>("en")

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
