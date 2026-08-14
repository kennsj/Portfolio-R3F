import React, { useRef } from "react"
import { useCharacterReveal } from "../../../hooks/use-character-reveal"

import styles from "./Heading.module.scss"

const HeadingAnimation = ({
	level = 1,
	children,
	className,
	immediate = false,
	delay = 0,
	enabled = true,
}: {
	level: 1 | 2 | 3 | 4 | 5 | 6
	children: React.ReactNode
	className?: string
	immediate?: boolean
	delay?: number
	enabled?: boolean
}) => {
	const Tag = `h${level}` as `h${typeof level}`
	const ref = useRef<HTMLHeadingElement>(null)

	useCharacterReveal(ref, { immediate, delay, enabled })

	return (
		<Tag ref={ref} className={`${styles["heading"]} ${className ?? ""}`.trim()}>
			{children}
		</Tag>
	)
}

export default HeadingAnimation
