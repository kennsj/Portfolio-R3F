"use client"

import Image from "next/image"
import styles from "./styles/Home.module.scss"

export default function Home() {
	return (
		<>
			<header className={styles.header}>
				{/* <img src={Logo} /> */}
				<Image
					src={"./kj-logo.svg"}
					alt='Logo'
					width={0}
					height={0}
					// sizes='50vw'
					style={{ width: "10%", height: "auto" }}
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
					<h1 className={styles.intro__description}>
						<span className={"highlight"}>Multidisciplinary</span> designer &
						developer with a passion for creating exciting{" "}
						<span className={"highlight"}>concepts</span> &{" "}
						<span className={"highlight"}>products</span> which focuses on
						user-engagements.
					</h1>
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
					</h3>

					<div className={styles.work__item}>
						<Image
							src={"/projects/work-preview-cinema.png"}
							alt='Logo'
							width={100}
							height={100}
							layout='responsive'
						/>
						<div className={styles.work__description}>
							<h4 className={styles.work__title}>Dialog eXe</h4>
							<ul>
								<li>UX</li>
								<li>UI</li>
								{/* <li>Web</li> */}
							</ul>
						</div>
					</div>

					<div className={styles.work__item}>
						<Image
							src={"/projects/sno-preview.png"}
							alt='Logo'
							width={100}
							height={100}
							layout='responsive'
						/>
						<div className={styles.work__description}>
							<h4 className={styles.work__title}>SNØ Oslo</h4>
							<ul>
								<li>VR</li>
								<li>Web</li>
							</ul>
						</div>
					</div>

					<div className={styles.work__item}>
						<Image
							src={"/projects/nfe-preview.png"}
							alt='Logo'
							width={100}
							height={100}
							layout='responsive'
						/>
						<div className={styles.work__description}>
							<h4 className={styles.work__title}>Norske Folkeeventyr</h4>
							<ul>
								<li>3D</li>
								<li>Web</li>
							</ul>
						</div>
					</div>
				</section>

				<section className={styles.about__section}>
					<div className='experience'>
						<h3>
							Work <br /> experience
						</h3>
						<div className={styles.experience__list}>
							<div className={styles.experience__info}>
								<span>Bodø, Norway</span>
								<h4>Dialog eXe</h4>
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
								<h4>Unfold</h4>
								<span>2018</span>
							</div>
							<div>
								<p>
									Worked with concept development for SNØ - an all-year arena
									for winter activities - where we developed a prototype in VR.
									The prototype we developed was nominated for the school's best
									student assignment.
								</p>
							</div>
						</div>

						<div className={styles.experience__list}>
							<div className={styles.experience__info}>
								<span>Oslo, Norway</span>
								<h4>Trigger</h4>
								<span>2016</span>
							</div>
							<div>
								<p>
									Worked with concept and UX/UI visualization for a social
									platform aimed at creative people.
								</p>
							</div>
						</div>
					</div>

					<div className='education'>
						<h3>Education</h3>
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
					</div>
				</section>
			</main>
		</>
	)
}
