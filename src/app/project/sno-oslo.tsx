import { lazy, Suspense } from "react"
import { createFileRoute } from "@tanstack/react-router"

const SnoOsloPage = lazy(() => import("./SnoOsloPage"))

function ProjectSnoOsloRoute() {
	return (
		<Suspense fallback={null}>
			<SnoOsloPage />
		</Suspense>
	)
}

export const Route = createFileRoute("/project/sno-oslo")({
	component: ProjectSnoOsloRoute,
})
