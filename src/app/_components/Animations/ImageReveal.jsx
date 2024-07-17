import { useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"

const ImageReveal = ({ src, alt }) => {
	const controls = useAnimation()
	const [ref, inView] = useInView()

	useEffect(() => {
		if (inView) {
			controls.start("visible")
			console.log(inView)
		}
	}, [controls, inView])

	const variants = {
		hidden: { opacity: 0, scale: 0.8 },
		visible: { opacity: 1, scale: 1 },
	}

	return (
		<motion.img
			ref={ref}
			initial='hidden'
			animate={controls}
			variants={variants}
			transition={{ duration: 0.5 }}
			src={src}
			alt={alt}
		/>
	)
}

export default ImageReveal
