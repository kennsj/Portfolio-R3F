import { useNavigate, useLocation } from "@tanstack/react-router"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { setLightColor } from "../components/Experiences/lightStore"
import {
	DEFAULT_PAGE_LIGHT_COLOR,
	PAGE_LIGHT_COLORS,
} from "../pageLightColors"
import {
	GSAP_PAGE_CONTENT_SELECTOR,
	gsapScrollToTop,
} from "../utils/gsapScroll"

function normalizePath(p: string) {
	const t = p.replace(/\/$/, "") || "/"
	return t
}

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
	const { pathname } = useLocation()

	function transitionTo(href: string) {
		const { to, hash } = splitInternalHref(href)
		const targetPath = normalizePath(to)
		const currentPath = normalizePath(pathname)

		setLightColor(
			PAGE_LIGHT_COLORS[normalizePath(to)] ?? DEFAULT_PAGE_LIGHT_COLOR,
		)

		// Same route: never fade main out (that left opacity at 0 when pathname did not change).
		if (targetPath === currentPath) {
			if (hash) {
				void navigate({
					to: targetPath,
					hash,
					replace: true,
					resetScroll: false,
					hashScrollIntoView: false,
				})
				// Smooth scroll + ScrollTrigger.refresh: RootLayout `useLayoutEffect`
			} else {
				void navigate({ to: targetPath, replace: true })
				gsapScrollToTop()
				requestAnimationFrame(() => ScrollTrigger.refresh())
			}
			return
		}

		gsap.to(GSAP_PAGE_CONTENT_SELECTOR, {
			opacity: 0,
			filter: "blur(25px)",
			duration: 0.55,
			ease: "power2.inOut",
			onComplete: () => {
				void navigate({
					to,
					...(hash
						? {
								hash,
								resetScroll: false,
								hashScrollIntoView: false,
							}
						: {}),
				})
			},
		})
	}

	return { transitionTo }
}
