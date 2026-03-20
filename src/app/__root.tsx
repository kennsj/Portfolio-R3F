import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import {
	setLightColor,
	currentColor,
} from "./components/Experiences/lightStore"
import { useEffect } from "react"
import { PointerProvider } from "./components/Experiences/PointerContext"
import Nav from "./components/Layout/Nav/Nav"
import Header from "./components/Layout/Header/Header"
import Background from "./components/Experiences/Background"
import Footer from "./components/Layout/Footer/Footer"
import SupportUkraine from "./components/UI/SupportUkraine/SupportUkraine"
import Cursor from "./components/UI/Cursor/Cursor"
import { KpProvider } from "./hooks/KpContext"
import { SimpleAnalytics } from "@simpleanalytics/react"

import "./styles/_variables.scss"
import "./Globals.scss"
import { log } from "console"

export const Route = createRootRoute({
	component: RootLayout,
})

function RootLayout() {
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
			<KpProvider>
				<SimpleAnalytics />
				<Background />
				<Nav />
				<Header />
				<main>
					<Outlet />
				</main>
				<Footer />
				<SupportUkraine />
				{/* <Cursor /> */}
			</KpProvider>
		</PointerProvider>
	)
}
