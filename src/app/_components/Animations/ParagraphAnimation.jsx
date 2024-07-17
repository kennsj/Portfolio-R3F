"use client"

import { useEffect, useRef } from "react"
import { useScroll, motion } from "framer-motion"

const ParagraphAnimation = ({ value }) => {
	const element = useRef()
	const { scrollYProgress } = useScroll({
		target: element,
		offset: ["start 0.9", "start 0.25"],
	})

	useEffect(() => {
		scrollYProgress.on("change", (e) => console.log(e))
	}, [])

	return (
		<motion.h1
			className='something'
			ref={element}
			style={{ opacity: scrollYProgress }}
		>
			{value}
		</motion.h1>
	)
}

export default ParagraphAnimation
