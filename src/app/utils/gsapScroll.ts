import gsap from "gsap"
import ScrollToPlugin from "gsap/ScrollToPlugin"

gsap.registerPlugin(ScrollToPlugin)

/** Fixed nav height — keeps section headings clear of the bar */
export const SCROLL_NAV_OFFSET_PX = 96

function scrollWindowToElement(el: HTMLElement, onComplete?: () => void) {
	gsap.to(window, {
		duration: 1.25,
		ease: "power2.inOut",
		scrollTo: {
			y: el,
			offsetY: SCROLL_NAV_OFFSET_PX,
			autoKill: true,
		},
		onComplete,
	})
}

export function gsapScrollToHashId(id: string, onComplete?: () => void) {
	const clean = id.replace(/^#/, "")
	if (!clean) return
	const el = document.getElementById(clean)
	if (!el) return
	scrollWindowToElement(el, onComplete)
}

/**
 * Retries until the target exists (e.g. lazy `Projects` mounting for `#work`).
 */
export function gsapScrollToHashIdWhenReady(
	id: string,
	onDone?: () => void,
	maxAttempts = 72,
) {
	const clean = id.replace(/^#/, "")
	if (!clean) {
		onDone?.()
		return
	}

	let attempts = 0
	const tick = () => {
		const el = document.getElementById(clean)
		if (el) {
			scrollWindowToElement(el, onDone)
			return
		}
		if (++attempts >= maxAttempts) {
			onDone?.()
			return
		}
		requestAnimationFrame(tick)
	}

	requestAnimationFrame(tick)
}

export function gsapScrollToTop() {
	gsap.to(window, {
		duration: 1.1,
		ease: "power2.inOut",
		scrollTo: { y: 0, autoKill: true },
	})
}
