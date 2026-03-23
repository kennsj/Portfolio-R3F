import { createRootRoute } from "@tanstack/react-router"
import RootLayout from "./RootLayout"

export const Route = createRootRoute({
	component: RootLayout,
	errorComponent: ({ error }) => (
		<div>
			<p>Something went wrong</p>
			<p>{error.message}</p>
		</div>
	),
})
