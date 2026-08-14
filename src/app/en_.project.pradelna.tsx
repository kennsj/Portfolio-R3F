import { createFileRoute } from "@tanstack/react-router";
import ProjectCase from "./components/Layout/ProjectPage/ProjectCase";

export const Route = createFileRoute("/en_/project/pradelna")({
  component: () => <ProjectCase slug="pradelna" />,
});
