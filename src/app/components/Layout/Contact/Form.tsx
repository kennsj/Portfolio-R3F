import Button from "../../UI/Button/Button"

import styles from "./Form.module.scss"

const ZWSP = "\u200b"

const Form = () => {
	const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault()
	}
	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<div className={styles.field}>
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

			<div className={styles.field}>
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

			<div className={styles.field}>
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
