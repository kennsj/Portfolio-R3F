import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from "react"
import Footer from "./components/Layout/Footer/Footer"
import { Outlet, useLocation } from "@tanstack/react-router"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { setLightColor } from "./components/Experiences/lightStore"
import {
	GSAP_PAGE_CONTENT_SELECTOR,
	gsapScrollToHashIdWhenReady,
	gsapScrollToTop,
} from "./utils/gsapScroll"
import { PointerProvider } from "./components/Experiences/PointerContext"
import { KpProvider } from "./hooks/KpContext"
import { HeroIntroProvider } from "./hooks/HeroIntroContext"
import { SimpleAnalytics } from "@simpleanalytics/react"
import PermissionProvider from "./components/Experiences/PermissionProvider"
import Background from "./components/Experiences/Background"
import { useI18n } from "./hooks/useI18n"
const Nav = lazy(() => import("./components/Layout/Nav/Nav"))
const SupportUkraine = lazy(
	() => import("./components/UI/SupportUkraine/SupportUkraine"),
)

gsap.registerPlugin(ScrollTrigger)

export default function RootLayout() {
	const { pathname, hash: locationHash } = useLocation()
	const { locale, t } = useI18n()
	const isHome = pathname === "/"
	const isAbout = pathname === "/about"
	const prevPathRef = useRef<string | null>(null)

	useEffect(() => {
		const pageTitle = isAbout ? t.seoAboutTitle : t.seoTitle
		const pageDescription = isAbout ? t.seoAboutDescription : t.seoDescription

		document.title = pageTitle

		const ensureMeta = (key: "name" | "property", value: string) => {
			let meta = document.head.querySelector<HTMLMetaElement>(
				`meta[${key}="${value}"]`,
			)
			if (!meta) {
				meta = document.createElement("meta")
				meta.setAttribute(key, value)
				document.head.appendChild(meta)
			}
			return meta
		}

		ensureMeta("name", "description").content = pageDescription
		ensureMeta("name", "keywords").content = t.seoKeywords
		ensureMeta("property", "og:title").content = pageTitle
		ensureMeta("property", "og:site_name").content = t.seoSiteName
		ensureMeta("property", "og:description").content = pageDescription
		ensureMeta("property", "og:locale").content =
			locale === "nb" ? "nb_NO" : "en_US"
		ensureMeta("property", "og:type").content = "website"
		ensureMeta("property", "og:url").content =
			`${window.location.origin}${pathname}`
		ensureMeta("name", "twitter:card").content = "summary_large_image"
		ensureMeta("name", "twitter:title").content = pageTitle
		ensureMeta("name", "twitter:description").content = pageDescription

		let canonical = document.head.querySelector<HTMLLinkElement>(
			'link[rel="canonical"]',
		)
		if (!canonical) {
			canonical = document.createElement("link")
			canonical.setAttribute("rel", "canonical")
			document.head.appendChild(canonical)
		}
		canonical.href = `${window.location.origin}${pathname}`

		const setAlternate = (lang: "en" | "nb", href: string) => {
			let link = document.head.querySelector<HTMLLinkElement>(
				`link[rel="alternate"][hreflang="${lang}"]`,
			)
			if (!link) {
				link = document.createElement("link")
				link.setAttribute("rel", "alternate")
				link.setAttribute("hreflang", lang)
				document.head.appendChild(link)
			}
			link.href = href
		}

		const basePath = `${window.location.origin}${pathname}`
		setAlternate("en", `${basePath}?lang=en`)
		setAlternate("nb", `${basePath}?lang=nb`)

		let xDefault = document.head.querySelector<HTMLLinkElement>(
			'link[rel="alternate"][hreflang="x-default"]',
		)
		if (!xDefault) {
			xDefault = document.createElement("link")
			xDefault.setAttribute("rel", "alternate")
			xDefault.setAttribute("hreflang", "x-default")
			document.head.appendChild(xDefault)
		}
		xDefault.href = `${basePath}?lang=en`

		const id = "schema-local-business"
		let schemaScript = document.getElementById(id) as HTMLScriptElement | null
		if (!schemaScript) {
			schemaScript = document.createElement("script")
			schemaScript.id = id
			schemaScript.type = "application/ld+json"
			document.head.appendChild(schemaScript)
		}

		schemaScript.text = JSON.stringify({
			"@context": "https://schema.org",
			"@type": "ProfessionalService",
			name: "Kenneth Jorgensen",
			url: window.location.origin,
			description: pageDescription,
			areaServed: "Bodo, Norway",
			address: {
				"@type": "PostalAddress",
				addressLocality: "Bodo",
				addressCountry: "NO",
			},
			email: "hei@kennethjorgensen.no",
			sameAs: [
				"https://www.linkedin.com/in/kennethstrandjorgensen/",
				"https://github.com/kennsj",
			],
		})
	}, [
		isAbout,
		locale,
		pathname,
		t.seoAboutDescription,
		t.seoAboutTitle,
		t.seoDescription,
		t.seoKeywords,
		t.seoSiteName,
		t.seoTitle,
	])

	useEffect(() => {
		if (isHome || isAbout) {
			setLightColor("#a6d59e") // this is enough — just set the target
		}
	}, [isAbout, isHome, pathname])

	// One refresh after images/fonts/layout settle — avoids short-page ScrollTrigger
	// math on first paint (same class of bug as footer/heading flashes).
	useEffect(() => {
		const onLoad = () => ScrollTrigger.refresh()
		if (document.readyState === "complete") {
			requestAnimationFrame(() => ScrollTrigger.refresh())
		} else {
			window.addEventListener("load", onLoad, { once: true })
		}
		return () => window.removeEventListener("load", onLoad)
	}, [])

	useLayoutEffect(() => {
		const prev = prevPathRef.current
		prevPathRef.current = pathname

		if (pathname !== "/") return

		const raw = (locationHash || "").replace(/^#/, "")

		const run = () => {
			if (raw) {
				gsapScrollToHashIdWhenReady(raw, () => ScrollTrigger.refresh())
			} else if (prev !== null && prev !== "/") {
				gsapScrollToTop()
				requestAnimationFrame(() => ScrollTrigger.refresh())
			}
		}

		requestAnimationFrame(() => {
			requestAnimationFrame(run)
		})
	}, [pathname, locationHash])

	useGSAP(
		() => {
			gsap.fromTo(
				GSAP_PAGE_CONTENT_SELECTOR,
				{ opacity: 0, filter: "blur(25px)" },
				{
					opacity: 1,
					filter: "blur(0px)",
					duration: 0.6,
					ease: "power2.out",
					onComplete: () => ScrollTrigger.refresh(),
				},
			)
		},
		{ dependencies: [pathname] },
	)

	return (
		<PointerProvider>
			<PermissionProvider />
			<KpProvider>
				<HeroIntroProvider>
					<SimpleAnalytics />

					<Background />
					<Suspense fallback={null}>
						<Nav />
					</Suspense>

					<main>
						<Outlet />
					</main>
					<Footer />
					<Suspense fallback={null}>
						<SupportUkraine />
					</Suspense>
					{/* <Cursor /> */}
				</HeroIntroProvider>
			</KpProvider>
		</PointerProvider>
	)
}
