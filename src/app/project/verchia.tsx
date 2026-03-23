import { createFileRoute } from "@tanstack/react-router"
import Header from "../components/Layout/Header/Header"

export const Route = createFileRoute("/project/verchia")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<>
			<Header />
		</>
	)
}
