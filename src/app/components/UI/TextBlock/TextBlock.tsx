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
}: {
	children: React.ReactNode
	className?: string
}) => {
	const ref = useRef<HTMLParagraphElement>(null)

	useGSAP(
		() => {
			const block = ref.current
			if (!block) return

			const splitInstances: SplitText[] = []
			let cancelled = false

			document.fonts.ready.then(() => {
				if (cancelled || !block.isConnected) return

				const splitP = SplitText.create(block, {
					type: "lines",
					autoSplit: true,
					onSplit(self) {
						return gsap.from(self.lines, {
							opacity: 0,
							filter: "blur(25px)",
							yPercent: 35,
							duration: 0.9,
							ease: "power2.out",
							scrollTrigger: {
								trigger: block,
								start: "top 80%",
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
			className={`${styles["text-block"]} ${className ?? ""}`.trim()}
		>
			{children}
		</p>
	)
}

export default TextBlock
