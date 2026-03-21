import { lazy, Suspense } from "react"
import { createRootRoute } from "@tanstack/react-router"

const RootLayout = lazy(() => import("./RootLayout"))

function RootRoute() {
	return (
		<Suspense fallback={null}>
			<RootLayout />
		</Suspense>
	)
}

export const Route = createRootRoute({
	component: RootRoute,
})
