"use client"

import { useRef } from "react"
import { useScroll, motion, useTransform } from "framer-motion"

import styles from "../../styles/TextReveal.module.scss"

const HeadingAnimation = ({ value }) => {
	const element = useRef()
	const words = value.split(" ") // Split the string into an array of words

	return (
		<h1 ref={element} className={styles.paragraph}>
			{words.map((word, index) => {
				return (
					<Word key={index} whileHover={{ scale: 0.5 }}>
						{word}
					</Word>
				)
			})}
		</h1>
	)
}

const Word = ({ children }) => {
	return (
		<span className={styles.word}>
			<span className={styles.shadow}>{children}</span>
			<motion.span>{children}</motion.span>
		</span>
	)
}

export default HeadingAnimation
