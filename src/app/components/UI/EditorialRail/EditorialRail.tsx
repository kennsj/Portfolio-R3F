import type { ReactNode } from "react"
import styles from "./EditorialRail.module.scss"

type EditorialRailProps = {
	label: ReactNode
	children: ReactNode
	copy?: ReactNode
	action?: ReactNode
	className?: string
}

export default function EditorialRail({ label, children, copy, action, className = "" }: EditorialRailProps) {
	return (
		<div className={`${styles.rail} ${className}`}>
			<div className={styles.label}>{label}</div>
			<div className={styles.content}>
				<div className={styles.statement}>{children}</div>
				{copy || action ? <div className={styles.supporting}>{copy ? <div className={styles.copy}>{copy}</div> : null}{action}</div> : null}
			</div>
		</div>
	)
}
