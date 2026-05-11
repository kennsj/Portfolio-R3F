import { useLayoutEffect } from "react"
import { createFileRoute } from "@tanstack/react-router"
import Header from "../components/Layout/ProjectPage/Header/Header"

export const Route = createFileRoute("/project/pradelna")({
	component: RouteComponent,
})

function RouteComponent() {
	useLayoutEffect(() => {
		window.scrollTo(0, 0)
	}, [])
	return (
		<>
			<Header url='https://www.pradelnakrkonose.cz/' urlText='Live' />
		</>
	)
}
