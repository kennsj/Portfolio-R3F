"use client"

import { useRef } from "react"
import { useScroll, motion, useTransform } from "framer-motion"

import styles from "../../styles/TextReveal.module.scss"

const HeadingAnimation = ({ value }) => {
	const element = useRef()
	const { scrollYProgress } = useScroll({
		target: element,
		offset: ["start 0.8", "start 0.5"],
	})

	const words = value.split(" ") // Split the string into an array of words

	return (
		<h1 ref={element} className={styles.paragraph}>
			{words.map((word, index) => {
				const start = index / words.length
				const end = start + 1 / words.length
				return (
					<Word key={index} range={[start, end]} progress={scrollYProgress}>
						{word}
					</Word>
				)
			})}
		</h1>
	)
}

const Word = ({ children, range, progress }) => {
	const opacity = useTransform(progress, range, [0, 1])

	return (
		<span className={styles.word}>
			<span className={styles.shadow}>{children}</span>
			<motion.span style={{ position: "relative", opacity }}>
				{children}
			</motion.span>
		</span>
	)
}

export default HeadingAnimation
