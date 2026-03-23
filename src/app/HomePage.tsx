import { lazy, Suspense } from "react"
import Header from "./components/Layout/Header/Header"
import Contact from "./components/Layout/Contact/Contact"
import HeadingAnimation from "./components/UI/HeadingAnimation/HeadingAnimation"
import TextBlock from "./components/UI/TextBlock/TextBlock"

const Projects = lazy(() => import("./components/Layout/Project/Projects"))
const ExperienceTools = lazy(
	() => import("./components/Layout/Expertise/Expertise"),
)

export default function HomePage() {
	return (
		<>
			<Header signalNavIntroAfterHero />
			<section id='about'>
				<div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
					<HeadingAnimation level={3}>About me</HeadingAnimation>
					<TextBlock>
						I find it hard to let go of a project until both the design and
						the code feel right. Which is probably why I ended up doing both.
					</TextBlock>
				</div>
			</section>

			<Suspense
				fallback={
					<div
						style={{ minHeight: "clamp(28rem, 55vh, 52rem)" }}
						aria-hidden
					/>
				}
			>
				<Projects />
			</Suspense>
			<Suspense
				fallback={
					<div
						style={{ minHeight: "clamp(22rem, 45vh, 40rem)" }}
						aria-hidden
					/>
				}
			>
				<ExperienceTools />
			</Suspense>
			<Contact showForecast />
		</>
	)
}
