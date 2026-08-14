import { createFileRoute } from "@tanstack/react-router";
import ProjectCase from "./components/Layout/ProjectPage/ProjectCase";

export const Route = createFileRoute("/en_/project/verchia")({
  component: () => <ProjectCase slug="verchia" />,
});
