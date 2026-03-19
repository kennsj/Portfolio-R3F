import gsap from "gsap"
import SplitText from "gsap/SplitText"
import { useGSAP } from "@gsap/react"
import styles from "./Header.module.scss"
import { useRef } from "react"

gsap.registerPlugin(SplitText)

const Header = () => {
	const h4Ref = useRef<HTMLHeadingElement>(null)
	const h1Ref = useRef<HTMLHeadingElement>(null)
	const pRef = useRef<HTMLParagraphElement>(null)

	useGSAP(
		() => {
			const splitH4 = SplitText.create(h4Ref.current, {
				type: "chars",
			})

			const splitP = SplitText.create(pRef.current, {
				type: "chars",
			})

			const split = SplitText.create(h1Ref.current, {
				type: "lines, chars",
				// mask: "lines",
			})

			const tl = gsap.timeline({
				// delay: 0.5,
				ease: "cubic.bezier(0.165, 0.84, 0.44, 1)",
				defaults: {
					duration: 1.2,
					stagger: 0.01,
					yPercent: 20,
				},
			})

			tl.from(splitH4.chars, { opacity: 0, filter: "blur(25px)", yPercent: 20 })
			tl.from(
				split.chars,
				{ opacity: 0, filter: "blur(25px)", yPercent: 20 },
				"<+0.5s",
			)
			tl.from(
				splitP.chars,
				{ opacity: 0, filter: "blur(25px)", yPercent: 20 },
				"<+0.2s",
			)
		},
		{ scope: h1Ref },
	)

	return (
		<header className={styles.header}>
			<h4 ref={h4Ref}>Occasional gamer. Avid perfectionist.</h4>
			<h1 ref={h1Ref}>
				Designed in the <span className='highlight'>dark</span>.
				<br /> Built for the <span className='highlight'>light</span>.
			</h1>
			<p ref={pRef}>
				So nothing gets lost between <br /> the idea and the browser.
			</p>
		</header>
	)
}

export default Header
