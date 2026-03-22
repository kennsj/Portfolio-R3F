import { createRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"

export const router = createRouter({
	routeTree,
	scrollRestoration: true,
	// Let GSAP ScrollToPlugin handle in-page sections (offset for fixed nav, smooth ease).
	defaultHashScrollIntoView: false,
})
