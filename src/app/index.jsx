import { lazy, Suspense } from "react"
import { createFileRoute } from "@tanstack/react-router"

const HomePage = lazy(() => import("./HomePage"))

function IndexRoute() {
	return (
		<Suspense fallback={null}>
			<HomePage />
		</Suspense>
	)
}

export const Route = createFileRoute("/")({
	component: IndexRoute,
})
