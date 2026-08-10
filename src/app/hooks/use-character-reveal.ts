import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import SplitText from "gsap/SplitText"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { RefObject } from "react"

gsap.registerPlugin(SplitText, ScrollTrigger)

type CharacterRevealOptions = {
	immediate?: boolean
	enabled?: boolean
	delay?: number
}

export function deterministicCharacterOrder(length: number) {
	return Array.from({ length }, (_, index) => index).sort((a, b) => {
		const hashA = ((a + 1) * 2654435761) >>> 0
		const hashB = ((b + 1) * 2654435761) >>> 0
		return hashA - hashB
	})
}

export function useCharacterReveal(
	ref: RefObject<HTMLElement>,
	{ immediate = false, enabled = true, delay = 0 }: CharacterRevealOptions = {},
) {
	useGSAP(
		() => {
			const heading = ref.current
			if (!heading || !enabled) return

			let cancelled = false
			let split: SplitText | null = null
			let tween: gsap.core.Tween | null = null

			document.fonts.ready.then(() => {
				if (cancelled || !heading.isConnected) return

				split = SplitText.create(heading, { type: "chars" })
				const reducedMotion = window.matchMedia(
					"(prefers-reduced-motion: reduce)",
				).matches
				const order = deterministicCharacterOrder(split.chars.length)
				const rank = new Map(order.map((characterIndex, position) => [characterIndex, position]))

				gsap.set(heading, { autoAlpha: 1 })
				tween = gsap.fromTo(
					split.chars,
					{
						autoAlpha: 0,
						filter: reducedMotion ? "blur(0px)" : "blur(12px)",
					},
					{
						autoAlpha: 1,
						filter: "blur(0px)",
						duration: reducedMotion ? 0.16 : 0.8,
						delay,
						ease: "power2.out",
						stagger: reducedMotion
							? 0
							: (index) => (rank.get(index) ?? index) * 0.022,
						scrollTrigger: immediate
							? undefined
							: {
								trigger: heading,
								start: "top 88%",
								once: true,
								fastScrollEnd: true,
							},
					},
				)
			})

			return () => {
				cancelled = true
				tween?.scrollTrigger?.kill()
				tween?.kill()
				split?.revert()
			}
		},
		{ scope: ref, dependencies: [immediate, enabled, delay] },
	)
}
