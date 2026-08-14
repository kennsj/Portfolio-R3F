import { createFileRoute } from "@tanstack/react-router"
import ProjectCase from "../components/Layout/ProjectPage/ProjectCase"

export const Route = createFileRoute("/project/torrfesken")({
	component: RouteComponent,
})

function RouteComponent() {
	return <ProjectCase slug="torrfesken" />
}
