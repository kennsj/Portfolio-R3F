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
const Nav = lazy(() => import("./components/Layout/Nav/Nav"))
const SupportUkraine = lazy(
	() => import("./components/UI/SupportUkraine/SupportUkraine"),
)

gsap.registerPlugin(ScrollTrigger)

export default function RootLayout() {
	const { pathname, hash: locationHash } = useLocation()
	const isHome = pathname === "/"
	const prevPathRef = useRef<string | null>(null)

	useEffect(() => {
		if (isHome) {
			setLightColor("#a6d59e") // this is enough — just set the target
		}
	}, [pathname])

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
