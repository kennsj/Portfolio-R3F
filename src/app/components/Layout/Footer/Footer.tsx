import { useMemo, useState, type FormEvent } from "react"
import styles from "./Footer.module.scss"

const Footer = () => {
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [phone, setPhone] = useState("")
	const [message, setMessage] = useState("")
	const [budget, setBudget] = useState<"" | "10k" | "40k" | "80k">("")
	const [sent, setSent] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const year = useMemo(() => new Date().getFullYear(), [])

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()
		setError(null)

		if (!name.trim()) return setError("Please enter your name.")
		if (!email.trim() || !email.includes("@"))
			return setError("Please enter a valid email address.")
		if (!phone.trim()) return setError("Please enter your phone number.")
		if (!message.trim()) return setError("Please write a short message.")

		setSent(true)
	}

	return (
		<footer id='footer' className={styles.footer}>
			<div className={styles.inner}>
				<div className={styles.layout}>
					<div className={styles.lead}>
						<p className={styles.eyebrow}>Contact</p>
						<h2 className={styles.title}>Say hello</h2>
						<p className={styles.intro}>
							Share a bit about your project, timeline, and what a good outcome
							looks like. I&apos;ll get back to you as soon as I can.
						</p>
					</div>

					<section className={styles.formSection} aria-label='Contact form'>
						<form className={styles.form} onSubmit={handleSubmit}>
							<div className={styles.fieldGrid}>
								<label className={styles.label}>
									Name
									<input
										value={name}
										onChange={(e) => setName(e.target.value)}
										disabled={sent}
										type='text'
										name='name'
										autoComplete='name'
									/>
								</label>

								<label className={styles.label}>
									Email
									<input
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										disabled={sent}
										type='email'
										name='email'
										autoComplete='email'
									/>
								</label>
							</div>

							<label className={styles.label}>
								Phone
								<input
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									disabled={sent}
									type='tel'
									name='phone'
									autoComplete='tel'
								/>
							</label>

							<label className={styles.label}>
								Message
								<textarea
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									disabled={sent}
									name='message'
									rows={5}
								/>
							</label>

							<fieldset className={styles.fieldset} disabled={sent}>
								<legend className={styles.legend}>Budget (optional)</legend>
								<div className={styles.radioGroup} role='radiogroup'>
									<label className={styles.radio}>
										<input
											type='radio'
											name='budget'
											value='10k'
											checked={budget === "10k"}
											onChange={() => setBudget("10k")}
										/>
										10k
									</label>
									<label className={styles.radio}>
										<input
											type='radio'
											name='budget'
											value='40k'
											checked={budget === "40k"}
											onChange={() => setBudget("40k")}
										/>
										40k
									</label>
									<label className={styles.radio}>
										<input
											type='radio'
											name='budget'
											value='80k'
											checked={budget === "80k"}
											onChange={() => setBudget("80k")}
										/>
										80k
									</label>
								</div>
							</fieldset>

							{error ? (
								<div className={styles.error} role='alert'>
									{error}
								</div>
							) : null}

							{sent ? (
								<div className={styles.success} role='status'>
									Thanks — message received. This form is front-end only for now.
								</div>
							) : (
								<button className={styles.submit} type='submit'>
									Send message
								</button>
							)}
						</form>
					</section>
				</div>

				<div className={styles.bottom}>
					<span>© {year} Kenneth Jørgensen</span>
					<span className={styles.location}>Bodø, Norway</span>
				</div>
			</div>
		</footer>
	)
}

export default Footer
