import { useGSAP } from "@gsap/react"
import React, { useRef } from "react"
import SplitText from "gsap/SplitText"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import gsap from "gsap"

import styles from "./Heading.module.scss"

gsap.registerPlugin(SplitText, ScrollTrigger)

const HeadingAnimation = ({
	level = 1,
	children,
	className,
}: {
	level: 1 | 2 | 3 | 4 | 5 | 6
	children: React.ReactNode
	className?: string
}) => {
	const Tag = `h${level}` as `h${typeof level}`
	const ref = useRef<HTMLHeadingElement>(null)

	useGSAP(
		() => {
			const heading = ref.current
			if (!heading) return

			const splitInstances: SplitText[] = []
			let cancelled = false
			let introTween: gsap.core.Tween | null = null

			document.fonts.ready.then(() => {
				if (cancelled || !heading.isConnected) return

				const split = SplitText.create(heading, {
					type: "lines",
				})
				splitInstances.push(split)

				introTween = gsap.from(split.lines, {
					opacity: 0,
					filter: "blur(25px)",
					yPercent: 100,
					stagger: 0.001,
					duration: 1,
					ease: "power2.out",
					scrollTrigger: {
						trigger: heading,
						start: "top 80%",
						invalidateOnRefresh: true,
						fastScrollEnd: true,
						once: true,
					},
				})

				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						if (cancelled || !heading.isConnected) return
						ScrollTrigger.refresh()
					})
				})
			})

			return () => {
				cancelled = true
				introTween?.scrollTrigger?.kill()
				introTween?.kill()
				introTween = null
				splitInstances.splice(0).forEach((s) => s.revert())
			}
		},
		{ scope: ref },
	)

	return (
		<Tag ref={ref} className={`${styles["heading"]} ${className ?? ""}`.trim()}>
			{children}
		</Tag>
	)
}

export default HeadingAnimation
