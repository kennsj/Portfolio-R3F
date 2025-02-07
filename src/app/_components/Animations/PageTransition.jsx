"use client"

import Link, { LinkProps } from "next/link"
import { useRouter } from "next/navigation"

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

const TransitionLink = ({ children, href, className, ...props }) => {
	const router = useRouter()

	const handleTransition = async (e) => {
		e.preventDefault()

		// Run some exit animation
		// Sleep for some time
		const main = document.querySelector("main")

		main?.classList.add("page__transition")
		await sleep(500)

		router.push(href)
		await sleep(500)

		// Run some enter animation
		main?.classList.remove("page__transition")
	}

	return (
		<Link
			className={className}
			onClick={handleTransition}
			href={href}
			{...props}
		>
			{children}
		</Link>
	)
}

export default TransitionLink
