import { createFileRoute } from "@tanstack/react-router"

import styles from "./styles/Homepage.module.scss"

export const Route = createFileRoute("/")({
	component: Home,
})

function Home() {
	return <></>
}
