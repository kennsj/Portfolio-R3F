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
import { useI18n } from "./useI18n"

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
	const { locale } = useI18n()

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
					search: { lang: locale },
					replace: true,
					resetScroll: false,
					hashScrollIntoView: false,
				})
				// Smooth scroll + ScrollTrigger.refresh: RootLayout `useLayoutEffect`
			} else {
				void navigate({ to: targetPath, search: { lang: locale }, replace: true })
				gsapScrollToTop()
				requestAnimationFrame(() => ScrollTrigger.refresh())
			}
			return
		}

		gsap.timeline()
			.set("#page-transition", { autoAlpha: 1, yPercent: 0 })
			.set("#page-transition-reveal", { yPercent: 100 })
			.fromTo("#page-transition-title", { autoAlpha: 0, y: 24, filter: "blur(12px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.65, ease: "power3.out" }, 0.35)
			.to("#page-transition-cover", {
				yPercent: 0,
				duration: 0.65,
				ease: "power3.inOut",
				onStart: () => {
					const title = document.querySelector<HTMLElement>("#page-transition-title")
					if (title) title.textContent = targetPath === "/" ? "Home" : targetPath.slice(1).replaceAll("/", " / ")
				},
				onComplete: () => {
					void navigate({
						to,
						search: { lang: locale },
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
