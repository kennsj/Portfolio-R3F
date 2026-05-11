import { useLayoutEffect } from "react"
import { createFileRoute } from "@tanstack/react-router"

import Header from "../components/Layout/ProjectPage/Header/Header"

export const Route = createFileRoute("/project/manshausen")({
	component: RouteComponent,
})

function RouteComponent() {
	useLayoutEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	return (
		<article>
			<Header />
		</article>
	)
}
