import styles from "./Button.module.scss"

type ButtonProps = {
	type: "button" | "submit" | "reset"
	onClick?: () => void
	disabled?: boolean
	ariaLabel: string
	ariaDescribedby: string
	ariaRequired?: boolean
	children: React.ReactNode
	className?: string
	dataScrollDown?: boolean
}

const Button = ({
	type,
	onClick,
	disabled,
	ariaLabel,
	ariaDescribedby,
	ariaRequired,
	children,
	className,
	dataScrollDown,
}: ButtonProps) => {
	return (
		<button
			type={type}
			className={`${styles.button} ${className}`}
			onClick={onClick}
			disabled={disabled}
			aria-label={ariaLabel}
			aria-describedby={ariaDescribedby}
			aria-required={ariaRequired}
			data-scroll-down={dataScrollDown}
		>
			{children}
			<div className={styles["icon-container"]}>
				<span className={styles["button-dot"]}>
					<span className={styles["button-arrow"]}>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='10'
							height='10'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						>
							<path d='M5 19L19 5M8 5h11v11' />
						</svg>
					</span>
				</span>
			</div>
		</button>
	)
}

export default Button
