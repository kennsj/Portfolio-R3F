import { useGSAP } from "@gsap/react"
import React, { useRef } from "react"
import SplitText from "gsap/SplitText"
import ScrollTrigger from "gsap/ScrollTrigger"
import gsap from "gsap"

gsap.registerPlugin(SplitText, ScrollTrigger)

const TextBlock = ({ children }: { children: React.ReactNode }) => {
	const ref = useRef<HTMLParagraphElement>(null)

	useGSAP(
		() => {
			document.fonts.ready.then(() => {
				const splitP = SplitText.create(ref.current, {
					type: "lines",
					// mask: "lines",
				})

				gsap.from(splitP.lines, {
					opacity: 0,
					filter: "blur(25px)",
					yPercent: 100,
					stagger: 0.1,
					duration: 1.1,
					scrollTrigger: {
						trigger: ref.current,
						start: "bottom 85%",
						end: "bottom 15%",
						markers: true,
					},
				})
			})
		},
		{ scope: ref },
	)
	return <p ref={ref}>{children}</p>
}

export default TextBlock
