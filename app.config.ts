import { defineConfig } from "@tanstack/react-start/config"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
	tsr: {
		routesDirectory: "./src/app",
		generatedRouteTree: "./routeTree.gen.ts", // moved to root
		routeFileIgnorePattern: "components|styles",
	},
	vite: {
		plugins: [tsconfigPaths()],
		server: {
			port: 3000,
			watch: {
				ignored: ["**/routeTree.gen.ts"],
			},
		},
	},
})
