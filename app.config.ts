import { defineConfig } from "@tanstack/react-start/config"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
	tsr: {
		routesDirectory: "./src/app",
		generatedRouteTree: "./src/routeTree.gen.ts",
		routeFileIgnorePattern: "components|styles",
	},
	vite: {
		plugins: [tsconfigPaths()],
		server: {
			port: 3000,
		},
	},
})
