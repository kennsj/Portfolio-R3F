import { lazy, Suspense } from "react"

import styles from "./Contact.module.scss"

const HeadingAnimation = lazy(
	() => import("../../UI/HeadingAnimation/HeadingAnimation"),
)
const TextBlock = lazy(() => import("../../UI/TextBlock/TextBlock"))
const Aurora = lazy(() => import("../Aurora/Aurora"))
const Form = lazy(() => import("./Form"))
const ArrowLink = lazy(() => import("../../UI/ArrowLink/ArrowLink"))

const Contact = ({ showForecast = false }: { showForecast?: boolean }) => {
	return (
		<section aria-label='Contact'>
			<div className={styles["contact-wrapper"]}>
				<Suspense fallback={null}>
					<HeadingAnimation level={3}>Contact</HeadingAnimation>
				</Suspense>

				{showForecast && (
					<>
						<Suspense fallback={null}>
							<TextBlock>
								Now you know where the background <br /> comes from. And where I
								come from.
							</TextBlock>
						</Suspense>
						<Suspense fallback={null}>
							<Aurora />
						</Suspense>
					</>
				)}
				<Suspense fallback={null}>
					<TextBlock className={styles["contact-text"]}>
						Share a bit about your project, timeline, and what a good outcome
						looks like. I'll get back to you as soon as I can. Or let me know if
						you want to go aurora hunting!
					</TextBlock>
				</Suspense>
				<Suspense fallback={null}>
					<Form />
				</Suspense>
				<div className={styles["contact-info"]}>
					<div className={styles["contact-info-image"]}>
						<svg viewBox='0 0 200 200' width='250' height='250'>
							<defs>
								<path
									id='circle-path'
									d='M 100,100 m -80,0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0'
								/>
							</defs>

							<image
								href='/images/y-so-serious.png'
								x='25'
								y='25'
								width='150'
								height='150'
								clipPath='url(#clip)'
							/>

							<clipPath id='clip'>
								<circle cx='100' cy='100' r='75' />
							</clipPath>

							<text fontSize='12' fill='#888' letterSpacing='1'>
								<textPath
									href='#circle-path'
									startOffset='15%'
									textAnchor='start'
								>
									My serious face, let's talk
								</textPath>
							</text>
						</svg>
					</div>
					<div className={styles["contact-info-email"]}>
						<Suspense fallback={null}>
							<ArrowLink
								size='48'
								href='mailto:hello@kj.design'
								data-text='hello@kj.design'
							>
								hello@kj.design
							</ArrowLink>
						</Suspense>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Contact
