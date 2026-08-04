import { createFileRoute } from "@tanstack/react-router"
import ProjectCase from "../components/Layout/ProjectPage/ProjectCase"

export const Route = createFileRoute("/project/verchia")({
	component: RouteComponent,
})

function RouteComponent() {
	return <ProjectCase slug="verchia" />
}
