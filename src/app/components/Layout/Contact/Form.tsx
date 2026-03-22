import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import Button from "../../UI/Button/Button"

import styles from "./Form.module.scss"

gsap.registerPlugin(ScrollTrigger)

const ZWSP = "\u200b"

const Form = () => {
	const formRef = useRef<HTMLFormElement>(null)

	useGSAP(
		() => {
			const form = formRef.current
			if (!form) return

			const fields = form.querySelectorAll<HTMLElement>("[data-contact-field]")
			const submit = form.querySelector<HTMLElement>(
				':scope > button[type="submit"]',
			)
			const targets = [...fields, ...(submit ? [submit] : [])]
			if (!targets.length) return

			gsap.fromTo(
				targets,
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
					ease: "power2.out",
					scrollTrigger: {
						trigger: form,
						start: "top bottom",
						toggleActions: "play none none none",
						invalidateOnRefresh: true,
					},
				},
			)

			requestAnimationFrame(() => {
				ScrollTrigger.refresh()
			})
		},
		{ scope: formRef },
	)

	const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault()
	}
	return (
		<form
			ref={formRef}
			className={styles.form}
			onSubmit={handleSubmit}
		>
			<div className={styles.field} data-contact-field>
				<input
					id='contact-name'
					className={styles.input}
					type='text'
					name='name'
					placeholder={ZWSP}
					aria-label='Name'
					autoComplete='name'
					required
				/>

				<label className={styles.label} htmlFor='contact-name'>
					Name
				</label>
			</div>

			<div className={styles.field} data-contact-field>
				<input
					id='contact-email'
					className={styles.input}
					type='email'
					name='email'
					placeholder={ZWSP}
					aria-label='Email'
					autoComplete='email'
					required
				/>

				<label className={styles.label} htmlFor='contact-email'>
					Email
				</label>
			</div>

			<div className={styles.field} data-contact-field>
				<textarea
					id='contact-message'
					className={styles.textarea}
					name='message'
					placeholder={ZWSP}
					aria-label='Message'
					rows={4}
					required
				/>

				<label className={styles.label} htmlFor='contact-message'>
					Message
				</label>
			</div>

			<Button
				type='submit'
				disabled={false}
				ariaLabel='Send'
				ariaDescribedby='contact-message'
				ariaRequired={true}
			>
				Send
			</Button>
		</form>
	)
}

export default Form
