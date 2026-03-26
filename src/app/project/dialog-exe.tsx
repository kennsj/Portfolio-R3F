import { createFileRoute } from "@tanstack/react-router"
import Header from "../components/Layout/ProjectPage/Header/Header"

export const Route = createFileRoute("/project/dialog-exe")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<>
			<Header />
		</>
	)
}
