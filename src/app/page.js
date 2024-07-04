"use client"

import { useEffect } from "react"
import Image from "next/image"
// import styles from "./globals.scss"
import styles from "./styles/Home.module.scss"
import test from "./styles/Home.module.scss"

export default function Home() {
	return (
		<>
			<header className={test.header}>
				{/* <img src={Logo} /> */}
				<Image
					src={"./kj-logo.svg"}
					alt='Logo'
					width={0}
					height={0}
					// sizes='50vw'
					style={{ width: "10%", height: "10%" }}
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
				<section className='about'>
					<h4 className='about__title'>About me</h4>
					<h1 className='about__description'>
						I am Kenneth, a <b>multidisciplinary</b> designer and developer
						striving to create impactful digital experiences which enthralls and
						engages. I am currently available for hire and freelance projects,
						drop me an{" "}
						<a
							className={styles.anchor}
							href='mailto:kennethsjorgensen@gmail.com'
						>
							email
						</a>{" "}
						if you’re interested in working together.
					</h1>
				</section>

				<section className='work__section'>
					<h4>Work</h4>

					<div className='work__item'>
						<Image
							src={"/projects/work-preview-cinema.png"}
							alt='Logo'
							width={100}
							height={100}
							layout='responsive'
						/>
						<div className='work__description'>
							<h3 className='work__title'>NFE</h3>
						</div>
					</div>

					<div className='work__item'>
						<Image
							src={"/projects/work-preview-cinema.png"}
							alt='Logo'
							width={100}
							height={100}
							layout='responsive'
						/>
						<div className='work__description'>
							<h3 className='work__title'>NFE</h3>
						</div>
					</div>

					<div className='work__item'>
						<Image
							src={"/projects/work-preview-cinema.png"}
							alt='Logo'
							width={100}
							height={100}
							layout='responsive'
						/>
						<div className='work__description'>
							<h3 className='work__title'>NFE</h3>
						</div>
					</div>
				</section>
			</main>
		</>
	)
}
