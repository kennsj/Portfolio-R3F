import { Cabin, Inter } from "next/font/google"
import { Quicksand, IBM_Plex_Mono } from "next/font/google"

import "./styles/_variables.scss"
import "./global.scss"
import Nav from "./_components/Nav"
import Background from "./_components/Background"
import Footer from "./_components/Footer"
import SupportUkraine from "./_components/SupportUkraine"
import { SpeedInsights } from "@vercel/speed-insights/next"

const quicksand = Quicksand({ subsets: ["latin"] })
const ibm = IBM_Plex_Mono({ weight: ["100", "400", "700"], subsets: ["latin"] })
const cabin = Cabin({ weight: ["400", "700"], subsets: ["latin"] })

export const metadata = {
	title: "Kenneth Jørgensen - Portfolio",
	description:
		"Portfolio of Kenneth Jørgensen, a web developer based in Bodø, Norway",
}

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body
				className={`${quicksand.className} ${ibm.className} ${cabin.className}`}
			>
				<Nav />
				{children}
				<Background />
				<Footer />
				<SupportUkraine />
			</body>
		</html>
	)
}
