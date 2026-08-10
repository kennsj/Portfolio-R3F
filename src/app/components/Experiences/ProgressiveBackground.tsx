import {
	Component,
	lazy,
	Suspense,
	useEffect,
	useState,
	type ErrorInfo,
	type ReactNode,
} from "react"
import { useHeroIntro } from "../../hooks/HeroIntroContext"

const Background = lazy(() => import("./Background"))

class BackgroundBoundary extends Component<
	{ children: ReactNode },
	{ failed: boolean }
> {
	state = { failed: false }

	static getDerivedStateFromError() {
		return { failed: true }
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		console.warn("Enhanced background unavailable; using static fallback.", {
			error,
			info,
		})
	}

	render() {
		return this.state.failed ? null : this.props.children
	}
}

export default function ProgressiveBackground() {
	const [enhance, setEnhance] = useState(false)
	const { markHomeHeroSceneReady } = useHeroIntro()

	useEffect(() => {
		const reduceMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches
		const saveData = (
			navigator as Navigator & { connection?: { saveData?: boolean } }
		).connection?.saveData

		if (reduceMotion || saveData) return

		const start = () => setEnhance(true)
		const idle = window.requestIdleCallback?.(start, { timeout: 1200 })
		const timer = idle === undefined ? window.setTimeout(start, 350) : undefined

		return () => {
			if (idle !== undefined) window.cancelIdleCallback?.(idle)
			if (timer !== undefined) window.clearTimeout(timer)
		}
	}, [])

	if (!enhance) return null

	return (
		<BackgroundBoundary>
			<Suspense fallback={null}>
				<Background onReady={markHomeHeroSceneReady} />
			</Suspense>
		</BackgroundBoundary>
	)
}
