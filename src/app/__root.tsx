import { createRootRoute } from "@tanstack/react-router"
import RootLayout from "./RootLayout"
import { useI18n } from "./hooks/useI18n"

function RootError({ error }: { error: Error }) {
	const { t } = useI18n()

	return (
		<div>
			<p>{t.errorTitle}</p>
			<p>
				{t.errorPrefix}: {error.message}
			</p>
		</div>
	)
}

export const Route = createRootRoute({
	component: RootLayout,
	errorComponent: ({ error }) => <RootError error={error} />,
})
