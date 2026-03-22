import type { MouseEvent } from "react"
import { usePageTransition } from "../../../hooks/usePageTransition"
import styles from "./ArrowLink.module.scss"

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

	return (
		<a
			href={href}
			className={styles["arrow-link"]}
			target={target}
			rel={target === "_blank" ? "noreferrer noopener" : undefined}
			onClick={onClick}
		>
			<span className={styles["arrow-link-text"]}>{children}</span>
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
