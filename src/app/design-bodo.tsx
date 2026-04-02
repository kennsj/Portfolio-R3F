import { createFileRoute } from "@tanstack/react-router"
import HeadingAnimation from "./components/UI/HeadingAnimation/HeadingAnimation"
import TextBlock from "./components/UI/TextBlock/TextBlock"
import { useI18n } from "./hooks/useI18n"

export const Route = createFileRoute("/design-bodo")({
	component: DesignBodoPage,
})

function DesignBodoPage() {
	const { t } = useI18n()

	return (
		<section style={{ paddingTop: "10rem", paddingBottom: "6rem" }}>
			<div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
				<HeadingAnimation level={1}>{t.designBodoTitle}</HeadingAnimation>
				<TextBlock>{t.designBodoIntro}</TextBlock>

				<div style={{ marginTop: "2.5rem" }}>
					<HeadingAnimation level={3}>{t.designBodoServicesTitle}</HeadingAnimation>
					<ul style={{ marginTop: "1rem", lineHeight: 1.8 }}>
						<li>{t.designBodoService1}</li>
						<li>{t.designBodoService2}</li>
						<li>{t.designBodoService3}</li>
					</ul>
				</div>

				<TextBlock textSize='sm'>{t.designBodoCta}</TextBlock>
			</div>
		</section>
	)
}
