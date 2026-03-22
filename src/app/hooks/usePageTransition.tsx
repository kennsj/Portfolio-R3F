// hooks/usePageTransition.ts
import { useNavigate } from "@tanstack/react-router"
import gsap from "gsap"
import { setLightColor } from "../components/Experiences/lightStore"

const PAGE_COLORS: Record<string, string> = {
	"/": "#a6d59e",
	"/project/verchia": "#E4DCCB",
	"/project/pradelna": "#E4DCCB",
	"/project/dialog-exe": "#E4DCCB",
	"/project/sno-oslo": "#E4DCCB",
}

const DEFAULT_COLOR = "#a6d59e"

/** Path + optional hash for TanStack Router (hash without leading #). */
function splitInternalHref(href: string): { to: string; hash?: string } {
	if (href.startsWith("#")) {
		const h = href.slice(1)
		return h ? { to: "/", hash: h } : { to: "/" }
	}
	const hashIdx = href.indexOf("#")
	if (hashIdx === -1) {
		return { to: href || "/" }
	}
	const to = href.slice(0, hashIdx) || "/"
	const hash = href.slice(hashIdx + 1)
	return hash ? { to, hash } : { to }
}

export function usePageTransition() {
	const navigate = useNavigate()

	function transitionTo(href: string) {
		const { to, hash } = splitInternalHref(href)
		setLightColor(PAGE_COLORS[to] ?? DEFAULT_COLOR)

		gsap.to("main", {
			opacity: 0,
			filter: "blur(25px)",
			duration: 0.7,
			ease: "power2.inOut",
		})

		setTimeout(() => {
			navigate({
				to,
				...(hash ? { hash } : {}),
			})
		}, 500)
	}

	return { transitionTo }
}
