import { Fragment } from "react"
import HeadingAnimation from "../../UI/HeadingAnimation/HeadingAnimation"
import styles from "./Expertise.module.scss"

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
]

const toolItems = [
	{
		title: "Figma",
		img: "/icons/tools/figma.png",
	},
	{
		title: "Adobe CC",
		img: "/icons/tools/adobecc.png",
	},
	{
		title: "Framer",
		img: "/icons/tools/framer.png",
	},
	{
		title: "React",
		img: "/icons/tools/react.png",
	},
	{
		title: "Sanity",
		img: "/icons/tools/sanity.png",
	},
	{
		title: "GSAP",
		img: "/icons/tools/gsap.png",
	},
	{
		title: "Shopify",
		img: "/icons/tools/shopify.png",
	},
]

const ExperienceTools = () => {
	return (
		<section aria-label='Experience and tools' data-background-black>
			<div className={styles.expertise}>
				<HeadingAnimation level={3}>Expertise</HeadingAnimation>
				<ul className={styles["experience-list"]}>
					{expertiseItems.map((item, index) => (
						<Fragment key={item.title}>
							<li key={item.title}>
								<h2>{item.title}</h2>
								<p>{item.description}</p>
							</li>
							{index < expertiseItems.length - 1 ? <hr /> : null}
						</Fragment>
					))}
				</ul>
				<div className={styles["tools-container"]}>
					<HeadingAnimation level={3}>Tools</HeadingAnimation>
					<ul>
						{toolItems.map((item, index) => (
							<Fragment key={item.title}>
								<li key={item.title}>
									<div className={styles["tool-icon"]}>
										<img src={item.img} alt={item.title} />
									</div>
									<span>{item.title}</span>
								</li>
							</Fragment>
						))}
					</ul>
				</div>
			</div>
		</section>
	)
}

export default ExperienceTools
