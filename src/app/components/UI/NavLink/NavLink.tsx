import { Link } from "@tanstack/react-router"
import styles from "./NavLink.module.scss"

const NavLink = ({
	href,
	children,
}: {
	href: string
	children: React.ReactNode
}) => {
	return (
		<Link to={href} className={styles["arrow-link"]}>
			<span className={styles["arrow-link-text"]}>{children}</span>
		</Link>
	)
}

export default NavLink
