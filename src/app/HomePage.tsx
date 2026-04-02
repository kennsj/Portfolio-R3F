import { lazy, Suspense } from "react"
import Header from "./components/Layout/Header/Header"
import Contact from "./components/Layout/Contact/Contact"
import TextBlock from "./components/UI/TextBlock/TextBlock"
import Expertise from "./components/Layout/Expertise/Expertise"
import Projects from "./components/Layout/Project/Projects"
import { useI18n } from "./hooks/useI18n"

export default function HomePage() {
	const { t } = useI18n()

	return (
		<>
			<Header signalNavIntroAfterHero />
			<section id='about'>
				<div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
					<TextBlock>
						{t.aboutText}
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
