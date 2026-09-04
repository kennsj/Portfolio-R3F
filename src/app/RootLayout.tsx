import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from "react"
import Footer from "./components/Layout/Footer/Footer"
import SupportUkraine from "./components/UI/SupportUkraine/SupportUkraine"
import { Outlet, useLocation } from "@tanstack/react-router"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import ScrollSmoother from "gsap/ScrollSmoother"
import { setLightColor } from "./components/Experiences/lightStore"
import { lightColorForPathname } from "./pageLightColors"
import {
	gsapScrollToHashIdWhenReady,
	gsapScrollToTop,
} from "./utils/gsapScroll"
import { PointerProvider } from "./components/Experiences/PointerContext"
import { KpProvider } from "./hooks/KpContext"
import { HeroIntroProvider } from "./hooks/HeroIntroContext"
import { SimpleAnalytics } from "@simpleanalytics/react"
import PermissionProvider from "./components/Experiences/PermissionProvider"
import ProgressiveBackground from "./components/Experiences/ProgressiveBackground"
import {
	getSeoForPath,
	SEO_DEFAULT_OG_IMAGE_PATH,
	useI18n,
} from "./hooks/useI18n"
import { buildSeoJsonLd } from "./utils/seoJsonLd"
import "./utils/motion"
import { localizePath, stripLocalePrefix } from "./utils/locale-path"
const Nav = lazy(() => import("./components/Layout/Nav/Nav"))
const Cursor = lazy(() => import("./components/UI/Cursor/Cursor"))

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

export default function RootLayout() {
	const { pathname, hash: locationHash } = useLocation()
	const { locale, t } = useI18n()
	const logicalPathname = stripLocalePrefix(pathname)
	const isHome = logicalPathname === "/"
	const prevPathRef = useRef<string | null>(null)

	useEffect(() => {
		const { title: pageTitle, description: pageDescription } = getSeoForPath(
			logicalPathname,
			t,
		)
		const origin = window.location.origin
		const canonicalUrl = `${origin}${localizePath(logicalPathname, locale)}`
		const ogImageUrl = `${origin}${SEO_DEFAULT_OG_IMAGE_PATH}`

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
		ensureMeta("property", "og:title").content = pageTitle
		ensureMeta("property", "og:site_name").content = t.seoSiteName
		ensureMeta("property", "og:description").content = pageDescription
		const ogLocale = locale === "nb" ? "nb_NO" : "en_US"
		const ogLocaleAlternate = locale === "nb" ? "en_US" : "nb_NO"
		ensureMeta("property", "og:locale").content = ogLocale
		document.head
			.querySelectorAll('meta[property="og:locale:alternate"]')
			.forEach((el) => el.remove())
		const ogLocaleAlt = document.createElement("meta")
		ogLocaleAlt.setAttribute("property", "og:locale:alternate")
		ogLocaleAlt.content = ogLocaleAlternate
		document.head.appendChild(ogLocaleAlt)

		ensureMeta("property", "og:type").content = "website"
		ensureMeta("property", "og:url").content = canonicalUrl
		ensureMeta("property", "og:image").content = ogImageUrl
		ensureMeta("name", "twitter:card").content = "summary_large_image"
		ensureMeta("name", "twitter:title").content = pageTitle
		ensureMeta("name", "twitter:description").content = pageDescription
		ensureMeta("name", "twitter:image").content = ogImageUrl

		let canonical = document.head.querySelector<HTMLLinkElement>(
			'link[rel="canonical"]',
		)
		if (!canonical) {
			canonical = document.createElement("link")
			canonical.setAttribute("rel", "canonical")
			document.head.appendChild(canonical)
		}
		canonical.href = canonicalUrl

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

		setAlternate("en", `${origin}${localizePath(logicalPathname, "en")}`)
		setAlternate("nb", `${origin}${localizePath(logicalPathname, "nb")}`)

		let xDefault = document.head.querySelector<HTMLLinkElement>(
			'link[rel="alternate"][hreflang="x-default"]',
		)
		if (!xDefault) {
			xDefault = document.createElement("link")
			xDefault.setAttribute("rel", "alternate")
			xDefault.setAttribute("hreflang", "x-default")
			document.head.appendChild(xDefault)
		}
		xDefault.href = `${origin}${localizePath(logicalPathname, "nb")}`

		const id = "seo-jsonld"
		let schemaScript = document.getElementById(id) as HTMLScriptElement | null
		if (!schemaScript) {
			schemaScript = document.createElement("script")
			schemaScript.id = id
			schemaScript.type = "application/ld+json"
			document.head.appendChild(schemaScript)
		}

		schemaScript.text = JSON.stringify(
			buildSeoJsonLd({
				origin,
				pathname: logicalPathname,
				locale,
				canonicalUrl,
				ogImageUrl,
				pageTitle,
				pageDescription,
				t,
			}),
		)
	}, [locale, logicalPathname, t])

	useLayoutEffect(() => {
		setLightColor(lightColorForPathname(logicalPathname))
	}, [logicalPathname])

	useLayoutEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

		const smoother = ScrollSmoother.create({
			wrapper: "#smooth-wrapper",
			content: "#smooth-content",
			smooth: 0.9,
			smoothTouch: 0,
			effects: false,
			normalizeScroll: true,
			onUpdate: (instance) => {
				window.dispatchEvent(
					new CustomEvent("smoothscroll", {
						detail: instance.scrollTop(),
					}),
				)
			},
		})

		requestAnimationFrame(() => ScrollTrigger.refresh())

		return () => smoother.kill()
	}, [])

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

		if (logicalPathname !== "/") return

		const raw = (locationHash || "").replace(/^#/, "")
		const isLocaleOnlyChange =
			prev !== null &&
			stripLocalePrefix(prev) === logicalPathname &&
			prev !== pathname

		const run = () => {
			if (raw && !isLocaleOnlyChange) {
				gsapScrollToHashIdWhenReady(raw, () => ScrollTrigger.refresh())
			} else if (prev !== null && stripLocalePrefix(prev) !== "/") {
				gsapScrollToTop()
				requestAnimationFrame(() => ScrollTrigger.refresh())
			}
		}

		requestAnimationFrame(() => {
			requestAnimationFrame(run)
		})
	}, [pathname, logicalPathname, locationHash])

	return (
		<PointerProvider>
			<PermissionProvider />
			<KpProvider>
				<HeroIntroProvider>
					<SimpleAnalytics collectDnt />

					<ProgressiveBackground />
					<a className='skip-link' href='#main-content'>
						{locale === "nb" ? "Hopp til innhold" : "Skip to content"}
					</a>
					<Suspense fallback={null}>
						<Nav />
					</Suspense>

					<div id='smooth-wrapper'>
						<div id='smooth-content'>
							<main id='main-content' tabIndex={-1}>
								<Outlet />
							</main>
							<Footer />
						</div>
					</div>
					<SupportUkraine />
					<Suspense fallback={null}>
						<Cursor />
					</Suspense>
				</HeroIntroProvider>
			</KpProvider>
		</PointerProvider>
	)
}
