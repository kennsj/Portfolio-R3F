import { createFileRoute } from "@tanstack/react-router"
import HeadingAnimation from "./components/UI/HeadingAnimation/HeadingAnimation"
import TextBlock from "./components/UI/TextBlock/TextBlock"
import Projects from "./components/Layout/Project/Projects"
import ExperienceTools from "./components/Layout/ExperienceTools/ExperienceTools"
import AuroraForecast from "./components/Layout/Aurora/Aurora"

export const Route = createFileRoute("/")({
	component: HomePage,
})

function HomePage() {
	return (
		<>
			<section>
				<HeadingAnimation level={3}>About me</HeadingAnimation>
				<TextBlock>
					I design and build digital products, from concept to code, with a
					focus on the moments that make people stop and pay attention.
				</TextBlock>
			</section>

			<Projects />
			<ExperienceTools />
			<AuroraForecast />
		</>
	)
}
