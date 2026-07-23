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
			// Disables the separate `tanstack-router:hmr` plugin (injects import.meta.hot.accept
			// into every route file). That injection + Vite 8 often forces full page reloads when
			// unrelated chunks update. The code-splitter path handles route HMR instead.
			// false: avoids lazy route chunks that load on first navigation and flash mid transition.
			autoCodeSplitting: false,
		}),
		viteReact(),
		tsconfigPaths(),
	],
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (!id.includes("node_modules")) return
					if (
						id.includes("/three/") ||
						id.includes("@react-three") ||
						id.includes("postprocessing") ||
						id.includes("three-mesh-bvh") ||
						id.includes("/maath/")
					) {
						return "three"
					}
					if (id.includes("/gsap/") || id.includes("@gsap")) return "motion"
					if (
						id.includes("/react/") ||
						id.includes("/react-dom/") ||
						id.includes("scheduler")
					) {
						return "react"
					}
					if (id.includes("@tanstack")) return "tanstack"
					return "vendor"
				},
			},
		},
	},
})
