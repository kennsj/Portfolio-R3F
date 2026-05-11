import { useEffect, useLayoutEffect, useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
	getKpColor,
	kpIndexQueryOptions,
	useKpIndex,
} from "../../../hooks/useKpIndex"
import HeadingAnimation from "../../UI/HeadingAnimation/HeadingAnimation"
import TextBlock from "../../UI/TextBlock/TextBlock"
import Aurora from "../Aurora/Aurora"
import ArrowLink from "../../UI/ArrowLink/ArrowLink"
import { useI18n } from "../../../hooks/useI18n"

import styles from "./Contact.module.scss"
import { useManualKp } from "@/app/hooks/KpContext"

gsap.registerPlugin(ScrollTrigger)

const Contact = ({ showForecast = false }: { showForecast?: boolean }) => {
	const { t } = useI18n()
	const contactRevealRef = useRef<HTMLDivElement>(null)
	const formRevealAnchorRef = useRef<HTMLDivElement>(null)
	const contactInfoRef = useRef<HTMLDivElement>(null)
	const queryClient = useQueryClient()
	const { data } = useKpIndex()
	const { manualKp } = useManualKp()
	const kp = manualKp ?? data?.latest ?? 0
	const color = getKpColor(kp)

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
		<section id='contact' aria-label={t.navContact}>
			<div ref={contactRevealRef} className={styles["contact-wrapper"]}>
				<HeadingAnimation level={3} className={styles["contact-title"]}>
					{t.contactTitle}
				</HeadingAnimation>

				<div ref={contactInfoRef} className={styles["contact-content"]}>
					<div className={styles["contact-text-container"]}>
						<TextBlock className={styles["contact-text"]} textSize='md'>
							{t.contactIntro}
						</TextBlock>
						<div className={styles["contact-text-small-container"]}>
							<TextBlock textSize='sm' className={styles["contact-text-small"]}>
								{t.contactAvailability}
							</TextBlock>
						</div>
						<div className={styles["contact-info-email"]} data-contact-email>
							<ArrowLink
								size='48'
								href='mailto:hei@kennethjorgensen.no'
								disableCharReveal
							>
								hei
								<span className='highlight'>@</span>
								kennethjorgensen.no
							</ArrowLink>
						</div>
						<TextBlock textSize='sm' className={styles["contact-email-note"]}>
							{t.contactEmailNote}
						</TextBlock>
					</div>
					<div className={styles["contact-image"]} data-contact-portrait>
						<svg viewBox='0 0 300 200' width='250' height='250'>
							<defs>
								<path
									id='circle-path'
									d='M 100,100 m -80,0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0'
								/>
							</defs>
							{t.contactAvailability}
							<image
								href='/images/y-so-serious.webp'
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
									{t.contactPortraitText}
								</textPath>
							</text>
						</svg>
					</div>
				</div>

				{showForecast && <Aurora />}
			</div>
		</section>
	)
}

export default Contact
