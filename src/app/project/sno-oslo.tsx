import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/project/sno-oslo")({
	component: RouteComponent,
})

function RouteComponent() {
	return <div>Hello "/project/sno"!</div>
}
