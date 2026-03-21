import { Link } from "@tanstack/react-router"
import styles from "./ArrowLink.module.scss"

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
	return (
		<Link to={href} className={styles["arrow-link"]} target={target}>
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
		</Link>
	)
}

export default ArrowLink
