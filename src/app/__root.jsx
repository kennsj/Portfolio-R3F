import {
	Outlet,
	createRootRoute,
	HeadContent,
	Scripts,
} from "@tanstack/react-router"
import Nav from "./_components/Nav"
import Background from "./_components/Background"
import Footer from "./_components/Footer"
import SupportUkraine from "./_components/SupportUkraine"
import { PointerProvider } from "./_components/PointerContext"

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
				href: "https://fonts.googleapis.com/css2?family=Cabin:wght@400;700&family=IBM+Plex+Mono:wght@100;400;700&family=Inter:wght@400;700&family=Quicksand:wght@400;700&display=swap",
			},
		],
	}),
	component: RootLayout,
})

function RootLayout() {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body
				className="quicksand ibm cabin"
				style={{
					fontFamily: "'Quicksand', 'IBM Plex Mono', 'Cabin', sans-serif",
				}}
			>
				<PointerProvider>
					<Nav />
					<Outlet />
					<Background />
					<Footer />
					<SupportUkraine />
				</PointerProvider>
				<Scripts />
			</body>
		</html>
	)
}
