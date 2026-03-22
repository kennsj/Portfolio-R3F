import { lazy, Suspense } from "react"
import Header from "./components/Layout/Header/Header"
import Contact from "./components/Layout/Contact/Contact"

// Lazy per block so SCSS/TSX stay off the main route graph where possible.
// Contact is eager so ScrollTrigger measures while the section is still below
// the fold (lazy chunk + late mount was skipping reveals when scrolling in).
const HeadingAnimation = lazy(
	() => import("./components/UI/HeadingAnimation/HeadingAnimation"),
)
const TextBlock = lazy(() => import("./components/UI/TextBlock/TextBlock"))
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
					<Suspense fallback={null}>
						<HeadingAnimation level={3}>About me</HeadingAnimation>
					</Suspense>
					<Suspense fallback={null}>
						<TextBlock>
							I find it hard to let go of a project until both the design and
							the code feel right. Which is probably why I ended up doing both.
						</TextBlock>
					</Suspense>
				</div>
			</section>

			<Suspense fallback={null}>
				<Projects />
			</Suspense>
			<Suspense fallback={null}>
				<ExperienceTools />
			</Suspense>
			<Contact showForecast />
		</>
	)
}
