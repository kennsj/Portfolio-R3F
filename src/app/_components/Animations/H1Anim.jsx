import { motion } from "framer-motion"

const variants = {
	hidden: {
		opacity: 0,
		y: "100%",
		rotate: 10,
	},
	visible: (index) => ({
		opacity: 1,
		y: 0,
		rotate: 0,
		transition: {
			duration: 0.6,
			delay: 0.04 * index,
		},
	}),
}

const HeadingAnim = ({ children }) => {
	return (
		<h1
			style={{
				display: "inline-block",
				overflow: "hidden",
				whiteSpace: "pre-wrap",
				// ...style,
			}}
			aria-hidden='true'
		>
			{children.split(" ").map((text, index) => (
				<span
					key={index}
					style={{ overflow: "hidden", display: "inline-block" }}
				>
					<motion.span
						style={{ display: "inline-block" }}
						variants={variants}
						initial='hidden'
						custom={index}
						whileInView='visible'
						viewport={{ once: true }}
					>
						{text + " "}
					</motion.span>
				</span>
			))}
		</h1>
	)
}

export default HeadingAnim
