import { lazy, Suspense } from "react"
import { Outlet, useLocation } from "@tanstack/react-router"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { setLightColor } from "./components/Experiences/lightStore"
import { useEffect } from "react"
import { PointerProvider } from "./components/Experiences/PointerContext"
import { KpProvider } from "./hooks/KpContext"
import { SimpleAnalytics } from "@simpleanalytics/react"
import PermissionProvider from "./components/Experiences/PermissionProvider"

// Lazy per section so edits to Nav/Footer/etc. do not invalidate this module (and
// therefore do not bubble to __root → routeTree → router → main).
const Background = lazy(() => import("./components/Experiences/Background"))
const Nav = lazy(() => import("./components/Layout/Nav/Nav"))
const Header = lazy(() => import("./components/Layout/Header/Header"))
const Footer = lazy(() => import("./components/Layout/Footer/Footer"))
const SupportUkraine = lazy(() => import("./components/UI/SupportUkraine/SupportUkraine"))

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
			gsap.from("main > *", {
				opacity: 0,
				duration: 0.6,
				ease: "power2.out",
			})
		},
		{ dependencies: [pathname] },
	)

	return (
		<PointerProvider>
			<PermissionProvider />
			<KpProvider>
				<SimpleAnalytics />
				<Suspense fallback={null}>
					<Background />
					<Nav />
					<Header />
				</Suspense>
				<main>
					<Outlet />
				</main>
				<Suspense fallback={null}>
					<Footer />
					<SupportUkraine />
				</Suspense>
				{/* <Cursor /> */}
			</KpProvider>
		</PointerProvider>
	)
}
