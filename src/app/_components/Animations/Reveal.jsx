"use client"
import { motion } from "framer-motion"

const revealVariants = {
	hidden: {
		opacity: 0,
		y: "10%",
	},
	visible: (i) => ({
		y: "0",
		opacity: 1,
		transition: {
			delay: 0.1 * i,
			duration: 1,
			ease: [0.76, 0, 0.24, 1],
			// ease: "easeInOut",
		},
	}),
}

const Reveal = ({ children }) => {
	return (
		<>
			{children.map((child, i) => (
				<motion.span
					className='experience__span'
					key={i}
					variants={revealVariants}
					initial='hidden'
					// animate={isInView ? "visible" : "hidden"}
					whileInView='visible'
					// exit='exit'
					viewport={{ once: true }}
					custom={i}
				>
					{child}
				</motion.span>
			))}
		</>
	)
}

export default Reveal
