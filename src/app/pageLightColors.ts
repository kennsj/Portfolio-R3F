/** Background / directional light tint per route — keep in sync with navigation (`usePageTransition`). */

export const PAGE_LIGHT_COLORS: Record<string, string> = {
	"/": "#a6d59e",
	"/about": "#a6d59e",
	"/project/verchia": "#E4DCCB",
	"/project/pradelna": "#E4DCCB",
	"/project/dialog-exe": "#E4DCCB",
}

export const DEFAULT_PAGE_LIGHT_COLOR = "#a6d59e"

export function lightColorForPathname(pathname: string): string {
	const p = pathname.replace(/\/$/, "") || "/"
	return PAGE_LIGHT_COLORS[p] ?? DEFAULT_PAGE_LIGHT_COLOR
}
