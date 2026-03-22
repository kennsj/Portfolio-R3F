import type { MouseEvent } from "react"
import { usePageTransition } from "../../../hooks/usePageTransition"
import styles from "./NavLink.module.scss"

const NavLink = ({
	href,
	children,
}: {
	href: string
	children: React.ReactNode
}) => {
	const { transitionTo } = usePageTransition()

	const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault()
		transitionTo(href)
	}

	return (
		<a href={href} onClick={onClick} className={styles["arrow-link"]}>
			<span className={styles["arrow-link-text"]}>{children}</span>
		</a>
	)
}

export default NavLink
