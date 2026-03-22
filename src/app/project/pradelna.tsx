import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/project/pradelna')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/project/pradelna"!</div>
}
