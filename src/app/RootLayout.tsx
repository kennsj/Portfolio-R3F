import { lazy, Suspense } from "react"
import { Outlet, useLocation } from "@tanstack/react-router"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { setLightColor } from "./components/Experiences/lightStore"
import { useEffect } from "react"
import { PointerProvider } from "./components/Experiences/PointerContext"
import { KpProvider } from "./hooks/KpContext"
import { HeroIntroProvider } from "./hooks/HeroIntroContext"
import { SimpleAnalytics } from "@simpleanalytics/react"
import PermissionProvider from "./components/Experiences/PermissionProvider"
import Background from "./components/Experiences/Background"
const Nav = lazy(() => import("./components/Layout/Nav/Nav"))
const Footer = lazy(() => import("./components/Layout/Footer/Footer"))
const SupportUkraine = lazy(
	() => import("./components/UI/SupportUkraine/SupportUkraine"),
)

export default function RootLayout() {
	const { pathname } = useLocation()
	const isHome = pathname === "/"

	useEffect(() => {
		if (isHome) {
			setLightColor("#a6d59e") // this is enough — just set the target
		}
	}, [pathname])

	useGSAP(
		() => {
			gsap.fromTo(
				"main",
				{ opacity: 0, filter: "blur(25px)" },
				{ opacity: 1, filter: "blur(0px)", duration: 0.6, ease: "power2.out" },
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
					<Suspense fallback={null}>
						<Footer />
						<SupportUkraine />
					</Suspense>
					{/* <Cursor /> */}
				</HeroIntroProvider>
			</KpProvider>
		</PointerProvider>
	)
}
