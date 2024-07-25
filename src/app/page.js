"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, inView } from "framer-motion"

import styles from "./styles/Homepage.module.scss"
import LetterAnimation from "./_components/Animations/LetterAnimation"
import HeadingAnimation from "./_components/Animations/HeadingAnimation"
import WordSkew from "./_components/Animations/WordSkew"

export default function Home() {
	const variants = { hidden: { opacity: 0 }, visible: { opacity: 1 } }

	const revealVariants = {
		hidden: { opacity: 0, y: 50 },
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
				{/* <h2>
						<span className={styles.highlighted}>Multidisciplinary</span>{" "}
						designer & developer with a passion for creating exciting{" "}
						<span className={styles.highlighted}>concepts</span> &{" "}
						<span className={styles.highlighted}>products</span> which focuses
						on user-engagements.
            </h2> */}
			</header>
			<main>
				<section className={styles.intro}>
					<WordSkew value='Multidisciplinary designer & developer with a passion for creating impactful digital experiences which focuses on enthralling and engaging users.' />
					{/* <LetterAnimation
						// htmlTag={"h1"}
						value='Multidisciplinary designer & developer with a passion for creating impactful digital experiences which focuses on enthralling and engaging users.'
					/> */}
					{/* <h1 className={styles.intro__description}>
						<span className={"highlight"}></span>Multidisciplinary designer &
						developer with a <span className={"highlight"}>passion</span> for
						creating impactful digital{" "}
						<span className={"highlight"}>experiences</span> which focuses on
						enthralling and engaging users.
					</h1> */}
					{/* <h1 className={styles.intro__description}>
						I am Kenneth, a multidisciplinary designer and developer striving to
						create impactful digital experiences which enthralls and engages. I
						am currently available for hire and freelance projects, drop me an{" "}
						<a href='mailto:kennethsjorgensen@gmail.com'>email</a> if you're
						interested in working together.
					</h1> */}
				</section>

				<section className={styles.work__section}>
					<h3>
						Selected <br /> works
						{/* <LetterAnimation value={"Selected" + `${(<p></p>)}` + "works"} /> */}
					</h3>

					<motion.div
						className={styles.work__item}
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{
							ease: "easeIn",
							type: "tween",
							delay: 0.3,
							duration: 0.8,
							repeat: 0,
						}}
					>
						<Link href='/dx'>
							<Image
								className={styles.work__image}
								src={"/projects/work-preview-cinema.png"}
								alt='Preview image for a projected I worked with at Dialog eXe'
								width={1024}
								height={768}
							/>
							<div className={styles.work__description}>
								<div>
									<h4 className={styles.work__title}>Dialog eXe</h4>
									<ul>
										<li>UX</li>
										<li>UI</li>
										{/* <li>Web</li> */}
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

					<motion.div
						className={styles.work__item}
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{
							ease: "easeIn",
							type: "tween",
							delay: 0.3,
							duration: 0.8,
							repeat: 0,
						}}
					>
						<Link className={styles.work__link} href='/sno'>
							<Image
								className={styles.work__image}
								src={"/projects/sno-preview.png"}
								alt='Preview image for the concept I made for SNØ Oslo'
								width={1024}
								height={768}
							/>
							<div className={styles.work__description}>
								<div>
									<h4 className={styles.work__title}>SNØ Oslo</h4>

									<ul>
										<li>VR</li>
										<li>Web</li>
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
					<motion.div
						className={styles.work__item}
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{
							ease: "easeIn",
							type: "tween",
							delay: 0.3,
							duration: 0.8,
							repeat: 0,
						}}
					>
						<Link href='/nfe'>
							<Image
								className={styles.work__image}
								src={"/projects/nfe-preview.png"}
								alt='Preview image for the project Norske Folkeeventyr'
								width={1024}
								height={768}
							/>
							<div className={styles.work__description}>
								<div>
									<h4 className={styles.work__title}>Norske Folkeeventyr</h4>

									<ul>
										<li>3D</li>
										<li>Web</li>
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
				</section>

				<section
					className={styles.about__section}
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
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
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
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
										<Link href='https://www.dx.tech/'>DX</Link>
									</h4>
									<span>2019 - 2020</span>
								</div>
								<div>
									<p>
										Worked as a designer and a developer at DX, developing
										websites for their cinema and culture clients across the
										country. In addition, I worked on further developing the
										design for the custom CMS platform.
									</p>
								</div>
							</div>

							<div className={styles.experience__list}>
								<div className={styles.experience__info}>
									<span>Oslo, Norway</span>
									<h4>
										<Link href='https://www.unfold.no'>Unfold</Link>
									</h4>
									<span>2018</span>
								</div>
								<div>
									<p>
										Worked with concept development for SNØ - an all-year arena
										for winter activities - where we developed a prototype in
										VR.
									</p>
								</div>
							</div>

							<div className={styles.experience__list}>
								<div className={styles.experience__info}>
									<span>Oslo, Norway</span>
									<h4>
										<Link href='https://www.trigger.no/'>Trigger</Link>
									</h4>
									<span>2016</span>
								</div>
								<div>
									<p>
										Worked with concept and UX/UI visualization for a social
										platform aimed at creative people.
									</p>
								</div>
							</div>
						</motion.div>
					</div>

					<div>
						<h3>Education</h3>
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
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
