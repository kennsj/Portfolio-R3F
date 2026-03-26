import { lazy, Suspense } from "react"
import Header from "./components/Layout/Header/Header"
import Contact from "./components/Layout/Contact/Contact"
import TextBlock from "./components/UI/TextBlock/TextBlock"
import Expertise from "./components/Layout/Expertise/Expertise"
import Projects from "./components/Layout/Project/Projects"

export default function HomePage() {
	return (
		<>
			<Header signalNavIntroAfterHero />
			<section id='about'>
				<div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
					<TextBlock>
						I find it hard to let go of a project until both the design and the
						code feel right. Which is probably why I ended up doing both.
					</TextBlock>
				</div>
			</section>

			<Suspense>
				<Projects />
			</Suspense>
			<Suspense>
				<Expertise />
			</Suspense>
			<Contact showForecast />
		</>
	)
}
