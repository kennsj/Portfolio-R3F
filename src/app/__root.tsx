import {
	Outlet,
	createRootRoute,
} from "@tanstack/react-router"
import Nav from "./components/Layout/Nav/Nav"
import Background from "./components/Experiences/Background"
import Footer from "./components/Layout/Footer/Footer"
import SupportUkraine from "./components/UI/SupportUkraine/SupportUkraine"
import { PointerProvider } from "./components/Experiences/PointerContext"
import Header from "./components/Layout/Header/Header"
import Projects from "./components/Layout/Project/Projects"

import "./styles/_variables.scss"
import "./Globals.scss"

export const Route = createRootRoute({
	component: RootLayout,
})

function RootLayout() {
	return (
		<PointerProvider>
			<Background />
			<Nav />
			<Header />
			<main>
				<h3>About me</h3>
				<p style={{ marginBottom: "10rem" }}>
					I design and build digital products, from concept to code, with a focus
					on the moments that make people stop and pay attention.
				</p>
				<Projects />
			</main>
			<Outlet />
			<Footer />
			<SupportUkraine />
		</PointerProvider>
	)
}
