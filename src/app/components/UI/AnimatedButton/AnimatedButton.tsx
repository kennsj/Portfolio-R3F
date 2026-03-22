import { useRef, type RefObject } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import styles from "./AnimatedButton.module.scss"

gsap.registerPlugin(ScrollTrigger)

type AnimatedButtonProps = {
	label: string
	onClick?: () => void
	href?: string
	className?: string
	dataScrollDown?: boolean
	ariaDescribedBy?: string
	/** Delay after scroll trigger fires (hero CTA trails headline) */
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
	revealDuration = 0.8,
}: AnimatedButtonProps) => {
	const rootRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null)

	useGSAP(
		() => {
			const el = rootRef.current
			if (!el) return

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
		},
		{ scope: rootRef, dependencies: [revealDelay, revealDuration] },
	)

	const inner = (
		<>
			{label}
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

	const cls = `${styles.button} ${className ?? ""}`.trim()

	if (href) {
		return (
			<a
				ref={rootRef as RefObject<HTMLAnchorElement>}
				className={cls}
				href={href}
				aria-label={label}
				{...(ariaDescribedBy ? { "aria-describedby": ariaDescribedBy } : {})}
				data-scroll-down={dataScrollDown ? true : undefined}
			>
				{inner}
			</a>
		)
	}

	return (
		<button
			ref={rootRef as RefObject<HTMLButtonElement>}
			type='button'
			className={cls}
			onClick={onClick}
			aria-label={label}
			{...(ariaDescribedBy ? { "aria-describedby": ariaDescribedBy } : {})}
			data-scroll-down={dataScrollDown ? true : undefined}
		>
			{inner}
		</button>
	)
}

export default AnimatedButton
