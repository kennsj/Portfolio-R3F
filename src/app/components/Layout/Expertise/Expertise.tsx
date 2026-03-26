import { Fragment, useRef } from "react"
import HeadingAnimation from "../../UI/HeadingAnimation/HeadingAnimation"
import styles from "./Expertise.module.scss"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import SplitText from "gsap/SplitText"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger, SplitText)

const expertiseItems = [
	{
		title: "Web design",
		description:
			"I obsess over the details most people won't notice — but will feel. The spacing, the timing, the way a page guides you without you realising it. I can't help it.",
	},
	{
		title: "Web development",
		description:
			"I write the code myself, because I've never found a shortcut that doesn't show up somewhere. React and custom development primarily. Webflow and Framer when it genuinely serves the project better.",
	},
	{
		title: "Graphic design",
		description:
			"I approach visual identity the same way I approach code; I can't let it go until it feels exactly right. It shows.",
	},
	{
		title: "Tools",
		tools: [
			{
				name: "Figma",
				img: "/icons/tools/figma.png",
			},
			{
				name: "Adobe CC",
				img: "/icons/tools/adobecc.png",
			},
			{
				name: "Framer",
				img: "/icons/tools/framer.png",
			},
			{
				name: "React",
				img: "/icons/tools/react.png",
			},
			{
				name: "Sanity",
				img: "/icons/tools/sanity.png",
			},
			{
				name: "GSAP",
				img: "/icons/tools/gsap.png",
			},
			{
				name: "Shopify",
				img: "/icons/tools/shopify.png",
			},
		],
	},
]

// const toolItems = [
// 	{
// 		title: "Figma",
// 		img: "/icons/tools/figma.png",
// 	},
// 	{
// 		title: "Adobe CC",
// 		img: "/icons/tools/adobecc.png",
// 	},
// 	{
// 		title: "Framer",
// 		img: "/icons/tools/framer.png",
// 	},
// 	{
// 		title: "React",
// 		img: "/icons/tools/react.png",
// 	},
// 	{
// 		title: "Sanity",
// 		img: "/icons/tools/sanity.png",
// 	},
// 	{
// 		title: "GSAP",
// 		img: "/icons/tools/gsap.png",
// 	},
// 	{
// 		title: "Shopify",
// 		img: "/icons/tools/shopify.png",
// 	},
// ]

const Expertise = () => {
	const sectionRef = useRef<HTMLElement>(null)
	const listRef = useRef<HTMLUListElement>(null)
	const toolsListRef = useRef<HTMLUListElement>(null)

	// useGSAP(
	// 	() => {
	// 		const section = sectionRef.current
	// 		if (!section) return

	// 		gsap.to(section, {
	// 			backgroundColor: "rgba(02, 02, 02, 0.85)",
	// 			ease: "none",
	// 			scrollTrigger: {
	// 				trigger: section,
	// 				start: "top 80%",
	// 				end: "top 40%",
	// 				scrub: true,
	// 			},
	// 		})
	// 	},
	// 	{ scope: sectionRef },
	// )

	useGSAP(
		() => {
			const list = listRef.current
			if (!list) return

			const splitInstances: SplitText[] = []
			let cancelled = false

			const rowStagger = 0.1

			document.fonts.ready.then(() => {
				if (cancelled || !list.isConnected) return

				const master = gsap.timeline({
					scrollTrigger: {
						trigger: list,
						start: "top 88%",
						invalidateOnRefresh: true,
						toggleActions: "play none none none",
					},
				})

				Array.from(list.children).forEach((child, i) => {
					const at = i * rowStagger

					if (child instanceof HTMLLIElement) {
						const h2 = child.querySelector("h2")
						const body = child.querySelector("p") as HTMLElement | null
						if (!h2) return

						const split = SplitText.create(h2, {
							type: "lines",
						})
						splitInstances.push(split)

						for (const line of split.lines) {
							line.classList.add(styles.revealTarget)
						}
						h2.classList.remove(styles.revealTarget)

						const lineReveal = {
							opacity: 1,
							visibility: "visible" as const,
							filter: "blur(0px)",
							y: 0,
							duration: 1,
							stagger: 0.001,
							ease: "power2.out" as const,
						}

						master.to(split.lines, lineReveal, at)

						if (body) {
							master.to(
								body,
								{
									opacity: 1,
									visibility: "visible",
									filter: "blur(0px)",
									y: 0,
									duration: 0.9,
									ease: "power2.out",
								},
								at + 0.05,
							)
						}
					} else if (child instanceof HTMLHRElement) {
						master.to(
							child,
							{
								scaleX: 1,
								filter: "blur(0px)",
								transformOrigin: "left",
								duration: 1,
								ease: "power2.out",
							},
							at,
						)
					}
				})

				/* If the list is already past the trigger when ST runs (common on mobile /
				   after resize), the timeline may never play — paragraphs would stay at
				   opacity:0 from immediateRender. Finish the timeline when already in view. */
				requestAnimationFrame(() => {
					ScrollTrigger.refresh()
					requestAnimationFrame(() => {
						if (cancelled || !list.isConnected) return
						const vh = window.innerHeight
						const top = list.getBoundingClientRect().top
						if (top <= vh * 0.88) {
							master.progress(1, false)
						}
					})
				})
			})

			return () => {
				cancelled = true
				splitInstances.splice(0).forEach((s) => s.revert())
			}
		},
		{ scope: listRef },
	)

	useGSAP(
		() => {
			const toolsList = toolsListRef.current
			if (!toolsList) return

			const items = toolsList.querySelectorAll<HTMLLIElement>(":scope > li")
			if (!items.length) return

			gsap.from(items, {
				opacity: 0,
				filter: "blur(25px)",
				yPercent: 28,
				duration: 0.9,
				stagger: 0.1,
				ease: "power2.out",
				scrollTrigger: {
					trigger: toolsList,
					start: "top 80%",
				},
			})
		},
		{ scope: toolsListRef },
	)

	return (
		<section ref={sectionRef} aria-label='Expertise'>
			<div className={styles.expertise}>
				<HeadingAnimation level={3}>Expertise</HeadingAnimation>
				<ul ref={listRef} className={styles["experience-list"]}>
					{expertiseItems.map((item, index) => (
						<Fragment key={item.title}>
							<li>
								<h2 className={styles.revealTarget}>{item.title}</h2>
								{item.description ? (
									<p className={styles.revealTargetParagraph}>
										{item.description}
									</p>
								) : null}
								{item.tools ? (
									<ul className={styles["tool-icons"]}>
										{item.tools.map((tool) => (
											<li className={styles["tool-icon"]}>
												<img src={tool.img} alt={tool.name} />
											</li>
										))}
									</ul>
								) : null}
							</li>
							{index < expertiseItems.length - 1 ? <hr /> : null}
						</Fragment>
					))}
				</ul>
				{/* <div className={styles["tools-container"]}>
					<HeadingAnimation level={3}>Tools</HeadingAnimation>
					<ul ref={toolsListRef}>
						{toolItems.map((item) => (
							<Fragment key={item.title}>
								<li>
									<div className={styles["tool-icon"]}>
										<img src={item.img} alt={item.title} />
									</div>
									<span>{item.title}</span>
								</li>
							</Fragment>
						))}
					</ul>
				</div> */}
			</div>
		</section>
	)
}

export default Expertise
