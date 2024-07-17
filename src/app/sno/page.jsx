import { motion } from "framer-motion"
import styles from "../styles/ProjectPage.module.scss"
import Image from "next/image"

const page = () => {
	return (
		<main>
			<header className={styles.work__header}>
				<div initial={{ opacity: 0 }} className={styles.heading__container}>
					<h4>VR / Concept</h4>
					<h1 className={styles.highlighted}>SNØ Oslo</h1>
					<p>
						Building an interactive portal for visitors to transcend through
					</p>
				</div>
			</header>

			<Image
				className='project_image__header'
				width={1920}
				height={1020}
				sizes='50vw'
				alt='...'
				src={"/projects/sno-preview.png"}
				style={{ width: "75%", height: "auto", objectFit: "cover" }}
			/>

			<section className={styles.work__section}>
				<div className={styles.project__info}>
					<div className={styles.project__when}>
						<h4>When</h4>
						<span>2016</span>
					</div>
					<div className={styles.project__who}>
						<h4>By</h4>
						<span>
							Kenneth Jørgensen
							<br />
							Robin Ingebrigtsen
						</span>
					</div>
					<div className={styles.project__tools}>
						<h4>Tools</h4>
						<span>
							Unreal Engine <br />
							HTC Vive
						</span>
					</div>
				</div>
				<h2>
					SNØ Oslo is building a year-long indoor skiing arena. How can we make
					an interactive experiences which transcends visitors from a
					potentional 30 degree celsius weather to a below freezing atmosphere
					inside?
				</h2>

				<p>
					We wanted to create a portal that would be an innovative, immersive
					and interactive experience. The thought was build up an expectation
					and introduce visitors to the experiences that lie within the hall and
					set an atmosphere that separates them from the real world.
				</p>

				<figure>
					<Image
						width={1280}
						height={768}
						style={{ width: "100%", height: "auto" }}
						src={"/projects/sno-low-fidelity.png"}
						alt='Low fidelity model of our concept'
					/>
					<figcaption>Low fidelity model of our concept</figcaption>
				</figure>

				<p>
					The portal would make it possible to create an atmosphere that can be
					intertwined to a theme, a season, an event, etc. through the visual
					and interactive. In addition, it could be used to manage user flow and
					introduce users to interactive systems used elsewhere within the
					arena.
				</p>

				<figure>
					<Image
						width={1280}
						height={768}
						style={{ width: "100%", height: "auto" }}
						src={"/projects/sno-low-fidelity-hallway.png"}
						alt='Low fidelity model of our concept'
					/>
					<figcaption>Low fidelity model of our concept</figcaption>
				</figure>

				{/* {isImage ? (
								<img src={props.url} />
							) : (
								<video>
									<source src={props.url} type='video/mp4' />
								</video>
							)} */}
			</section>
		</main>
	)
}

export default page
