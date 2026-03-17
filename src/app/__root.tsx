import {
	Outlet,
	createRootRoute,
	HeadContent,
	Scripts,
} from "@tanstack/react-router"
import Nav from "./components/Layout/Nav/Nav"
import Background from "./components/Experiences/Background"
import Footer from "./components/Layout/Footer/Footer"
import SupportUkraine from "./components/UI/SupportUkraine/SupportUkraine"
import { PointerProvider } from "./components/Experiences/PointerContext"
import Header from "./components/Layout/Header/Header"

import "./styles/_variables.scss"
import "./Globals.scss"

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{ title: "Kenneth Jørgensen - Portfolio" },
			{
				name: "description",
				content:
					"Portfolio of Kenneth Jørgensen, a web developer based in Bodø, Norway",
			},
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com",
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous",
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Syne:wght@400;700&family=IBM+Plex+Mono:wght@100;400;700&family=Inter:wght@400;700",
			},
			{
				rel: "icon",
				type: "image/x-icon",
				href: "/favicon.ico",
			},
		],
	}),
	component: RootLayout,
})

function RootLayout() {
	return (
		<html lang='en'>
			<head>
				<HeadContent />
			</head>
			<body
				className='syne ibm'
				style={{
					fontFamily: "'IBM Plex Mono', 'Syne', sans-serif",
				}}
			>
				<PointerProvider>
					{/* <div className='flashlight-mask' /> */}
					<Background />
					<Nav />
					<Header />
					<main>
						<h3>About me</h3>
						<p style={{ marginBottom: "10rem" }}>
							I design and build digital products, from concept to code, with a
							focus on the moments that make people stop and pay attention.
						</p>
					</main>
					<Outlet />
					<Footer />
					<SupportUkraine />
				</PointerProvider>
				<Scripts />
			</body>
		</html>
	)
}
