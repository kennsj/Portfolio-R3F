import { createFileRoute } from "@tanstack/react-router"
import { useLayoutEffect } from "react"
import Header from "../components/Layout/ProjectPage/Header/Header"
export const Route = createFileRoute("/project/sno-oslo")({
	component: RouteComponent,
})

function RouteComponent() {
	useLayoutEffect(() => {
		window.scrollTo(0, 0)
	}, [])
	return (
		<>
			<Header />
		</>
	)
}
