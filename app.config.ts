import { defineConfig } from "vite"
import viteReact from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import { tanstackRouter } from "@tanstack/router-plugin/vite"

export default defineConfig({
	server: {
		port: 3000,
		host: true,
		watch: {
			// Prevent full reload when route tree is regenerated (e.g. after CSS/component changes)
			usePolling: true,
			ignored: ["**/routeTree.gen.ts", "**/components/Experiences/**"],
		},
	},
	plugins: [
		// Must come before React plugin
		tanstackRouter({
			target: "react",
			routesDirectory: "./src/app",
			generatedRouteTree: "./src/routeTree.gen.ts",
			routeFileIgnorePattern: "components|styles|hooks",
		}),
		viteReact(),
		tsconfigPaths(),
	],
})
