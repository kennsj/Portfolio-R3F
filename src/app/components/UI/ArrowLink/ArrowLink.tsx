import { useRef, type MouseEvent } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import SplitText from "gsap/SplitText"
import { usePageTransition } from "../../../hooks/usePageTransition"
import styles from "./ArrowLink.module.scss"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(SplitText, ScrollTrigger)

function isExternalHref(href: string, target?: string) {
	if (target === "_blank") return true
	const h = href.toLowerCase()
	return (
		h.startsWith("http://") ||
		h.startsWith("https://") ||
		h.startsWith("//") ||
		h.startsWith("mailto:") ||
		h.startsWith("tel:")
	)
}

const ArrowLink = ({
	href,
	children,
	target,
	size = "24",
}: {
	href: string
	children: React.ReactNode
	target?: string
	size?: string
}) => {
	const { transitionTo } = usePageTransition()
	const external = isExternalHref(href, target)

	const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
		if (!external) {
			e.preventDefault()
			transitionTo(href)
		}
	}

	const linkRef = useRef<HTMLSpanElement>(null)

	useGSAP(
		() => {
			const el = linkRef.current
			if (!el) return

			const splitLink = new SplitText(el, { type: "chars" })

			// Apply hidden state immediately so chars never flash at full opacity first.
			// fromTo + ScrollTrigger can defer the "from" render and show the end state briefly.
			gsap.set(splitLink.chars, {
				opacity: 0,
				filter: "blur(25px)",
			})

			gsap.to(splitLink.chars, {
				opacity: 1,
				filter: "blur(0px)",
				stagger: 0.001,
				duration: 0.9,
				ease: "power2.out",
				scrollTrigger: {
					trigger: el,
					start: "top 100%",
					once: true,
					invalidateOnRefresh: true,
					toggleActions: "play none none none",
				},
			})

			return () => splitLink.revert()
		},
		{ dependencies: [linkRef] },
	)

	return (
		<a
			href={href}
			className={styles["arrow-link"]}
			target={target}
			rel={target === "_blank" ? "noreferrer noopener" : undefined}
			onClick={onClick}
		>
			<span ref={linkRef} className={styles["arrow-link-text"]}>
				{children}
			</span>
			<span className={styles["arrow-link-icon"]}>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width={size}
					height={size}
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='1.5'
					strokeLinecap='round'
					strokeLinejoin='round'
				>
					<path d='M5 12h14M13 6l6 6-6 6' />
				</svg>
			</span>
		</a>
	)
}

export default ArrowLink
