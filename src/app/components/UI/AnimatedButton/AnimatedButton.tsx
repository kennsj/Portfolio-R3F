import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import SplitText from "gsap/SplitText"

import styles from "./AnimatedButton.module.scss"

gsap.registerPlugin(ScrollTrigger, SplitText)

type AnimatedButtonProps = {
	label: string
	onClick?: () => void
	href?: string
	className?: string
	dataScrollDown?: boolean
	ariaDescribedBy?: string
	revealDelay?: number
	revealDuration?: number
}

const AnimatedButton = ({
	label,
	onClick,
	href,
	className,
	dataScrollDown,
	ariaDescribedBy,
	revealDelay = 0,
	revealDuration = 0.1,
}: AnimatedButtonProps) => {
	const rootRef = useRef<HTMLButtonElement>(null)
	const anchorRef = useRef<HTMLAnchorElement>(null)
	const labelRef = useRef<HTMLSpanElement>(null)

	useGSAP(
		() => {
			console.log("rootRef", rootRef.current)
			console.log("anchorRef", anchorRef.current)
			console.log("labelRef", labelRef.current)
			const el = rootRef.current ?? anchorRef.current
			console.log("el", el)

			gsap.fromTo(
				el,
				{ opacity: 0 },
				{
					opacity: 1,
					duration: revealDuration,
					delay: revealDelay,
					ease: "power2.out",
					scrollTrigger: {
						trigger: el,
						start: "top 85%",
					},
				},
			)

			const split = new SplitText(labelRef.current, { type: "chars" })

			const tl = gsap.timeline({ paused: true })

			tl.to(split.chars, {
				yPercent: -100,
				filter: "blur(8px)",
				opacity: 0,
				duration: 0.5,
				stagger: 0.008,
				ease: "power2.in",
			})
				.set(split.chars, { yPercent: 100 })
				.to(split.chars, {
					yPercent: 0,
					filter: "blur(0px)",
					opacity: 1,
					duration: 0.5,
					stagger: 0.008,
					ease: "power2.out",
				})

			const onEnter = () => tl.play()
			const onLeave = () => tl.reverse()

			el.addEventListener("mouseenter", onEnter)
			el.addEventListener("mouseleave", onLeave)

			return () => {
				el.removeEventListener("mouseenter", onEnter)
				el.removeEventListener("mouseleave", onLeave)
				split.revert()
			}
		},
		{ dependencies: [revealDelay, revealDuration] }, // no scope
	)

	const cls = `${styles.button} ${className ?? ""}`.trim()

	const inner = (
		<>
			<span ref={labelRef}>{label}</span>
			<div className={styles["icon-container"]}>
				<span className={styles["button-dot"]}>
					<span className={styles["button-arrow"]}>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='10'
							height='10'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						>
							<path d='M5 19L19 5M8 5h11v11' />
						</svg>
					</span>
				</span>
			</div>
		</>
	)

	if (href) {
		return (
			<a
				ref={anchorRef}
				className={cls}
				href={href}
				aria-label={label}
				aria-describedby={ariaDescribedBy}
				data-scroll-down={dataScrollDown ? true : undefined}
			>
				{inner}
			</a>
		)
	}

	return (
		<button
			ref={rootRef}
			type='button'
			className={cls}
			onClick={onClick}
			aria-label={label}
			aria-describedby={ariaDescribedBy}
			data-scroll-down={dataScrollDown ? true : undefined}
		>
			{inner}
		</button>
	)
}

export default AnimatedButton
