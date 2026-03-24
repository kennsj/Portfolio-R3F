import { useEffect, useLayoutEffect, useRef } from "react"

import { useQueryClient } from "@tanstack/react-query"

import { useGSAP } from "@gsap/react"

import gsap from "gsap"

import { ScrollTrigger } from "gsap/ScrollTrigger"

import { kpIndexQueryOptions } from "../../../hooks/useKpIndex"

import HeadingAnimation from "../../UI/HeadingAnimation/HeadingAnimation"

import TextBlock from "../../UI/TextBlock/TextBlock"

import Aurora from "../Aurora/Aurora"

import ArrowLink from "../../UI/ArrowLink/ArrowLink"

import Form from "./Form"

import styles from "./Contact.module.scss"

gsap.registerPlugin(ScrollTrigger)

const Contact = ({ showForecast = false }: { showForecast?: boolean }) => {
	const contactRevealRef = useRef<HTMLDivElement>(null)

	const formRevealAnchorRef = useRef<HTMLDivElement>(null)

	const contactInfoRef = useRef<HTMLDivElement>(null)

	const queryClient = useQueryClient()

	useEffect(() => {
		if (!showForecast) return

		void queryClient.prefetchQuery(kpIndexQueryOptions)
	}, [showForecast, queryClient])

	useLayoutEffect(() => {
		const id = requestAnimationFrame(() => {
			requestAnimationFrame(() => ScrollTrigger.refresh())
		})

		return () => cancelAnimationFrame(id)
	}, [showForecast])

	useGSAP(
		() => {
			const wrap = contactRevealRef.current

			const anchor = formRevealAnchorRef.current

			if (!wrap || !anchor) return

			const form = wrap.querySelector<HTMLFormElement>("form")

			const fields = form?.querySelectorAll<HTMLElement>("[data-contact-field]")

			const submit = form?.querySelector<HTMLElement>('button[type="submit"]')

			const formTargets: HTMLElement[] = []

			if (fields?.length) formTargets.push(...Array.from(fields))

			if (submit) formTargets.push(submit)

			if (!formTargets.length) return

			gsap.set(formTargets, {
				opacity: 0,
				filter: "blur(22px)",
				yPercent: 18,
			})

			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: anchor,
					start: "top 88%",
					toggleActions: "play none none none",
					invalidateOnRefresh: true,
				},

				defaults: { ease: "power2.out" },
			})

			tl.to(formTargets, {
				opacity: 1,
				filter: "blur(0px)",
				yPercent: 0,
				duration: 0.85,
				stagger: 0.12,
			})

			requestAnimationFrame(() => {
				requestAnimationFrame(() => ScrollTrigger.refresh())
			})
		},

		{ scope: contactRevealRef, dependencies: [showForecast] },
	)

	useGSAP(
		() => {
			const wrap = contactRevealRef.current

			const info = contactInfoRef.current

			if (!wrap || !info) return

			const portrait = info.querySelector<HTMLElement>(
				"[data-contact-portrait]",
			)

			const emailCol = info.querySelector<HTMLElement>("[data-contact-email]")

			if (!portrait || !emailCol) return

			gsap.set(portrait, {
				opacity: 0,
				filter: "blur(16px)",
			})
			gsap.set(emailCol, {
				opacity: 0,
				filter: "blur(22px)",
				yPercent: 22,
			})

			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: info,

					start: "top 88%",

					toggleActions: "play none none none",

					invalidateOnRefresh: true,
				},

				defaults: { ease: "power2.out" },
			})

			tl.to(portrait, {
				opacity: 1,
				filter: "blur(0px)",
				duration: 1.05,
			})

			tl.to(
				emailCol,
				{
					opacity: 1,
					filter: "blur(0px)",
					yPercent: 0,
					duration: 0.9,
				},
				"-=0.55",
			)

			requestAnimationFrame(() => {
				requestAnimationFrame(() => ScrollTrigger.refresh())
			})
		},

		{ scope: contactRevealRef, dependencies: [showForecast] },
	)

	return (
		<section id='contact' aria-label='Contact'>
			<div ref={contactRevealRef} className={styles["contact-wrapper"]}>
				<HeadingAnimation level={3}>Contact</HeadingAnimation>

				{showForecast && (
					<>
						<TextBlock>
							Now you know where the background comes from. And where I come
							from.
						</TextBlock>

						<Aurora />
					</>
				)}

				<TextBlock className={styles["contact-text"]}>
					Available for freelance projects and the right full-time role. Share a
					bit about your project, timeline, and what a good outcome looks like.
					I'll get back to you as soon as I can. Or let me know if you want to
					go aurora hunting!
				</TextBlock>

				<div
					ref={formRevealAnchorRef}
					className={styles["form-reveal-anchor"]}
					aria-hidden
				/>

				<Form />

				<div ref={contactInfoRef} className={styles["contact-info"]}>
					<div className={styles["contact-info-image"]} data-contact-portrait>
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
