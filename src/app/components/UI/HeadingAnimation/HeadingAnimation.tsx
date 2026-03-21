import { useGSAP } from "@gsap/react"
import React, { useRef } from "react"
import SplitText from "gsap/SplitText"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import gsap from "gsap"

gsap.registerPlugin(SplitText, ScrollTrigger)

const HeadingAnimation = ({
	level = 1,
	children,
}: {
	level: 1 | 2 | 3 | 4 | 5 | 6
	children: React.ReactNode
}) => {
	const Tag = `h${level}` as `h${typeof level}`
	const ref = useRef<HTMLHeadingElement>(null)

	useGSAP(
		() => {
			document.fonts.ready.then(() => {
				const split = SplitText.create(ref.current, {
					type: "chars",
				})

				gsap.from(split.chars, {
					opacity: 0,
					filter: "blur(25px)",
					yPercent: 100,
					stagger: 0.005,
					duration: 1,
					scrollTrigger: {
						trigger: ref.current,
						start: "bottom 85%",
					},
				})
			})
		},
		{ scope: ref },
	)

	return <Tag ref={ref}>{children}</Tag>
}

export default HeadingAnimation
