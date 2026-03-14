import { Link, useRouter } from "@tanstack/react-router"

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

const TransitionLink = ({ children, to, className, ...props }) => {
	const router = useRouter()

	const handleTransition = async (e) => {
		e.preventDefault()

		const main = document.querySelector("main")

		main?.classList.add("page__transition")
		await sleep(500)

		router.navigate({ to })
		await sleep(500)

		main?.classList.remove("page__transition")
	}

	return (
		<Link
			className={className}
			onClick={handleTransition}
			to={to}
			{...props}
		>
			{children}
		</Link>
	)
}

export default TransitionLink
