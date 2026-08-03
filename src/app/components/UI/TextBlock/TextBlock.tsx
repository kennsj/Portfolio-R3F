import { useGSAP } from "@gsap/react"
import React, { useRef } from "react"
import SplitText from "gsap/SplitText"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import gsap from "gsap"

import styles from "./TextBlock.module.scss"

gsap.registerPlugin(SplitText, ScrollTrigger)

const TextBlock = ({
	children,
	className,
	textSize = "md",
}: {
	children: React.ReactNode
	className?: string
	textSize?: "sm" | "md" | "lg"
}) => {
	const ref = useRef<HTMLParagraphElement>(null)

	useGSAP(
		() => {
			const block = ref.current
			if (!block) return
			if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

			const splitInstances: SplitText[] = []
			let cancelled = false

			document.fonts.ready.then(() => {
				if (cancelled || !block.isConnected) return

				const splitP = SplitText.create(block, {
					type: "lines",
					mask: "lines",
					autoSplit: true,
					onSplit(self) {
					return gsap.from(self.lines, {
						yPercent: 110,
						rotationX: -28,
						skewY: 2,
						transformPerspective: 900,
						transformOrigin: "50% 100%",
						duration: 0.8,
							ease: "shiftReveal",
							stagger: 0.1,
							scrollTrigger: {
								trigger: block,
								start: "top 88%",
								invalidateOnRefresh: true,
							},
						})
					},
				})
				splitInstances.push(splitP)
			})

			return () => {
				cancelled = true
				splitInstances.splice(0).forEach((s) => s.revert())
			}
		},
		{ scope: ref },
	)
	return (
		<p
			ref={ref}
			className={`${styles["text-block"]} ${styles[textSize]} ${className ?? ""}`.trim()}
		>
			{children}
		</p>
	)
}

export default TextBlock
