import { createFileRoute } from "@tanstack/react-router"
import HeadingAnimation from "./components/UI/HeadingAnimation/HeadingAnimation"
import TextBlock from "./components/UI/TextBlock/TextBlock"
import Projects from "./components/Layout/Project/Projects"
import ExperienceTools from "./components/Layout/Expertise/Expertise"
import AuroraForecast from "./components/Layout/Aurora/Aurora"
import Contact from "./components/Layout/Contact/Contact"

export const Route = createFileRoute("/")({
	component: HomePage,
})

function HomePage() {
	return (
		<>
			<section>
				<div
					// className={styles["about-me-wrapper"]}
					style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}
				>
					<HeadingAnimation level={3}>About me</HeadingAnimation>
					<TextBlock>
						I find it hard to let go of a project until both the design and the
						code feel right. Which is probably why I ended up doing both.
					</TextBlock>
				</div>
			</section>

			<Projects />
			<ExperienceTools />
			<Contact />
		</>
	)
}
