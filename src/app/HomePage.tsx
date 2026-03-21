import { lazy, Suspense } from "react"

// Lazy per block so Contact/Projects/etc. SCSS and TSX changes stay off the
// HomePage module graph path back to index.jsx → routeTree → router → main.
const HeadingAnimation = lazy(
	() => import("./components/UI/HeadingAnimation/HeadingAnimation"),
)
const TextBlock = lazy(() => import("./components/UI/TextBlock/TextBlock"))
const Projects = lazy(() => import("./components/Layout/Project/Projects"))
const ExperienceTools = lazy(
	() => import("./components/Layout/Expertise/Expertise"),
)
const Contact = lazy(() => import("./components/Layout/Contact/Contact"))

export default function HomePage() {
	return (
		<>
			<section>
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
			<Suspense fallback={null}>
				<Contact showForecast />
			</Suspense>
		</>
	)
}
