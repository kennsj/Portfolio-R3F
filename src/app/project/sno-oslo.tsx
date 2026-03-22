import { createFileRoute } from "@tanstack/react-router"
import Header from "../components/Layout/Header/Header"

export const Route = createFileRoute("/project/sno-oslo")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<>
			<Header />
		</>
	)
}
