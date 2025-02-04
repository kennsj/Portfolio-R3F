"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

import styles from "./styles/Homepage.module.scss"
import LetterAnimation from "./_components/Animations/LetterAnimation"
import HeadingAnimation from "./_components/Animations/HeadingAnimation"
import HeadingAnim from "./_components/Animations/HeadingAnim"
// import WordSkew from "./_components/Animations/WordSkew"

export default function Home() {
	const variants = { hidden: { opacity: 0 }, visible: { opacity: 1 } }

	const revealVariants = {
		// hidden: { opacity: 0, y: 50 },
		hidden: { opacity: 1 },
		visible: { opacity: 1, y: 0 },
		transition: {
			ease: "easeIn",
			type: "tween",
			delay: 1.3,
			duration: 0.8,
			repeat: 0,
		},
	}

	return (
		<>
			<header className={styles.header}>
				{/* <img src={Logo} /> */}
				<Image
					src={"./kj-logo.svg"}
					alt='Personal logo for Kenneth Jørgensen'
					width={150}
					height={200}
					// sizes='(min-width: 768px) 50vw, 100vw'
					// sizes='50vw'
					// style={{ width: "10%", height: "auto" }}
				/>
				<h2>
					Multidisciplinary <br />
					designer and <br />
					developer
				</h2>
			</header>
			<main>
				<section className={styles.intro}>
					<HeadingAnim>
						<h1>
							Multidisciplinary designer & developer with a passion for creating
							impactful digital experiences which focuses on enthralling and
							engaging users
						</h1>
					</HeadingAnim>
				</section>

				<section className={styles.work__section}>
					<h3>
						Selected <br /> works
						{/* <LetterAnimation value={"Selected" + `${(<p></p>)}` + "works"} /> */}
					</h3>

					<ProjectImage
						href='/dx'
						projectTitle='Dialog eXe'
						projectImageSrc='/projects/work-preview-cinema.png'
						alt='Preview image for a projected I worked with at Dialog eXe'
						projectTags={["UX", "UI"]}
					/>

					<ProjectImage
						href='/sno'
						projectTitle='SNØ Oslo'
						projectImageSrc='/projects/sno-preview.png'
						alt='Preview image for the concept I made for SNØ Oslo'
						projectTags={["VR", "Web"]}
					/>

					<ProjectImage
						href='/nfe'
						projectTitle='Norske Folkeeventyr'
						projectImageSrc='/projects/nfe-preview.png'
						alt='Preview image for the project Norske Folkeeventyr'
						projectTags={["3D", "Web"]}
					/>
				</section>

				<section
					className={styles.about__section}
					initial='hidden'
					transition={{
						ease: "easeIn",
						type: "tween",
						delay: 0.3,
						duration: 0.8,
						repeat: 0,
					}}
				>
					<div>
						<h3>
							Work <br /> experience
						</h3>
						<motion.div
							initial='hidden'
							transition={{
								ease: "easeIn",
								type: "tween",
								delay: 0,
								duration: 0.8,
								repeat: 0,
							}}
						>
							<div className={styles.experience__list}>
								<div className={styles.experience__info}>
									<span>Bodø, Norway</span>
									<h4>
										<Link href='https://www.dx.tech/' target='_blank'>
											DX
										</Link>
									</h4>
									<span>2019 - 2020</span>
								</div>

								<p>
									Worked as a designer and a developer at DX, developing
									websites for their cinema and culture clients across the
									country. In addition, I worked on further developing the
									design for the custom CMS platform.
								</p>
							</div>

							<div className={styles.experience__list}>
								<div className={styles.experience__info}>
									<span>Oslo, Norway</span>
									<h4>
										<Link href='https://www.unfold.no' target='_blank'>
											Unfold
										</Link>
									</h4>
									<span>2018</span>
								</div>

								<p>
									Worked with concept development for SNØ - an all-year arena
									for winter activities - where we developed a prototype in VR.
								</p>
							</div>

							<div className={styles.experience__list}>
								<div className={styles.experience__info}>
									<span>Oslo, Norway</span>
									<h4>
										<Link href='https://www.trigger.no/' target='_blank'>
											Trigger
										</Link>
									</h4>
									<span>2016</span>
								</div>

								<p>
									Worked with concept and UX/UI visualization for a social
									platform aimed at creative people.
								</p>
							</div>
						</motion.div>
					</div>

					<div>
						<h3>Education</h3>
						<motion.div
							initial='hidden'
							transition={{
								ease: "easeIn",
								type: "tween",
								delay: 0,
								duration: 0.8,
							}}
						>
							<div className={styles.experience__list}>
								<div className={styles.experience__info}>
									<span>Campus Kristiania</span>
									<h4>Interaction design</h4>
									<span>2016 - 2018</span>
								</div>
								<div>{/* <p>Studied interaction design</p> */}</div>
							</div>

							<div className={styles.experience__list}>
								<div className={styles.experience__info}>
									<span>Campus Kristiania</span>
									<h4>Graphic design</h4>
									<span>2014 - 2016</span>
								</div>
								<div>{/* <p>Studied graphic design</p> */}</div>
							</div>
						</motion.div>
					</div>
				</section>
			</main>
		</>
	)
}

const ProjectImage = ({
	href,
	projectTitle,
	projectImageSrc,
	alt,
	projectTags,
}) => {
	return (
		<motion.div
			className={styles.work__item}
			initial='hidden'
			transition={{
				ease: "easeIn",
				type: "tween",
				delay: 0.3,
				duration: 0.8,
				repeat: 0,
			}}
		>
			<Link href={href}>
				<Image
					className={styles.work__image}
					src={projectImageSrc}
					alt={alt}
					// width={1024}
					// height={768}
					fill={true}
					// sizes={"50vw"}
				/>
				<div className={styles.work__description}>
					<div>
						<h4 className={styles.work__title}>{projectTitle}</h4>

						<ul>
							{projectTags.map((tag, index) => (
								<li key={index}>{tag}</li>
							))}
						</ul>
					</div>
					<Image
						src={"icons/arrow.svg"}
						width={50}
						height={50}
						alt='Arrow icon which links to project page'
					/>
				</div>
			</Link>
		</motion.div>
	)
}
