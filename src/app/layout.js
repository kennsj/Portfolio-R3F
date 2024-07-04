import { Inter } from "next/font/google"
import "./globals.scss"
import styles from "./globals.scss"
import Nav from "./_components/Nav"
import Background from "./_components/Background"
import Footer from "./_components/Footer"
import SupportUkraine from "./_components/SupportUkraine"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
	title: "Kenneth Jørgensen - Portfolio",
	description:
		"Portfolio of Kenneth Jørgensen, a web developer based in Bodø, Norway",
}

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<Nav />
				{children}
				{/* <Background /> */}
				<Footer />
				<SupportUkraine />
			</body>
		</html>
	)
}
