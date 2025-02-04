import { motion } from "framer-motion"

const HeadingAnim = ({ children }) => {
	const heading = children.props.children
	const headingText = heading.split(" ")
	console.log(children)

	return (
		<span>
			{headingText.map((text, index) => (
				<motion.span
					key={index}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, delay: index * 0.02 }}
				>
					{text + " "}
				</motion.span>
			))}
		</span>
	)
}

export default HeadingAnim
