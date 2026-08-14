import { createRootRoute } from "@tanstack/react-router"
import RootLayout from "./RootLayout"
import { I18nProvider, useI18n } from "./hooks/useI18n"

function RootComponent() {
	return (
		<I18nProvider>
			<RootLayout />
		</I18nProvider>
	)
}

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
	component: RootComponent,
	errorComponent: ({ error }) => (
		<I18nProvider>
			<RootError error={error} />
		</I18nProvider>
	),
})
