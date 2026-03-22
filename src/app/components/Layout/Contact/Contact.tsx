import { lazy, Suspense, useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import ArrowLink from "../../UI/ArrowLink/ArrowLink"
import Form from "./Form"
import styles from "./Contact.module.scss"

gsap.registerPlugin(ScrollTrigger)

const HeadingAnimation = lazy(
	() => import("../../UI/HeadingAnimation/HeadingAnimation"),
)
const TextBlock = lazy(() => import("../../UI/TextBlock/TextBlock"))
const Aurora = lazy(() => import("../Aurora/Aurora"))

const Contact = ({ showForecast = false }: { showForecast?: boolean }) => {
	const contactRevealRef = useRef<HTMLDivElement>(null)

	useGSAP(
		() => {
			const wrap = contactRevealRef.current
			if (!wrap) return

			const form = wrap.querySelector<HTMLFormElement>("form")
			const fields = form?.querySelectorAll<HTMLElement>("[data-contact-field]")
			const submit = form?.querySelector<HTMLElement>(
				'button[type="submit"]',
			)
			const formTargets: HTMLElement[] = []
			if (fields?.length) formTargets.push(...fields)
			if (submit) formTargets.push(submit)

			const portrait = wrap.querySelector<HTMLElement>("[data-contact-portrait]")
			const emailCol = wrap.querySelector<HTMLElement>("[data-contact-email]")

			const triggerEl = form ?? wrap

			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: triggerEl,
					start: "top bottom",
					toggleActions: "play none none none",
					invalidateOnRefresh: true,
				},
				defaults: { ease: "power2.out" },
			})

			if (formTargets.length) {
				tl.fromTo(
					formTargets,
					{
						opacity: 0,
						filter: "blur(22px)",
						yPercent: 18,
					},
					{
						opacity: 1,
						filter: "blur(0px)",
						yPercent: 0,
						duration: 0.85,
						stagger: 0.12,
					},
					0,
				)
			}

			if (portrait && emailCol) {
				tl.fromTo(
					portrait,
					{
						clipPath: "circle(0% at 50% 50%)",
						opacity: 0.35,
						filter: "blur(16px)",
					},
					{
						clipPath: "circle(50% at 50% 50%)",
						opacity: 1,
						filter: "blur(0px)",
						duration: 1.05,
					},
					formTargets.length ? "-=0.5" : 0,
				)
				tl.fromTo(
					emailCol,
					{
						opacity: 0,
						filter: "blur(22px)",
						yPercent: 22,
					},
					{
						opacity: 1,
						filter: "blur(0px)",
						yPercent: 0,
						duration: 0.9,
					},
					"-=0.55",
				)
			}

			requestAnimationFrame(() => {
				requestAnimationFrame(() => ScrollTrigger.refresh())
			})
		},
		{ scope: contactRevealRef },
	)

	return (
		<section aria-label='Contact'>
			<div ref={contactRevealRef} className={styles["contact-wrapper"]}>
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
						Available for freelance projects and the right full-time role. Share
						a bit about your project, timeline, and what a good outcome looks
						like. I'll get back to you as soon as I can. Or let me know if you
						want to go aurora hunting!
					</TextBlock>
				</Suspense>
				<Form />
				<div className={styles["contact-info"]}>
					<div
						className={styles["contact-info-image"]}
						data-contact-portrait
					>
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
					<div className={styles["contact-info-email"]} data-contact-email>
						<ArrowLink
							size='48'
							href='mailto:hello@kj.design'
							data-text='hello@kj.design'
						>
							hello@kj.design
						</ArrowLink>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Contact
