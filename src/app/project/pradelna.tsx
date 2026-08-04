import { createFileRoute } from "@tanstack/react-router"
import ProjectCase from "../components/Layout/ProjectPage/ProjectCase"

export const Route = createFileRoute("/project/pradelna")({
	component: RouteComponent,
})

function RouteComponent() {
	return <ProjectCase slug="pradelna" />
}
