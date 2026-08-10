import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
	type ReactNode,
} from "react"
import { useLocation } from "@tanstack/react-router"

type HeroIntroContextValue = {
	homeHeroSceneReady: boolean
	markHomeHeroSceneReady: () => void
	/** When true, the main nav may play its entrance (home hero finished at least once this session, or not on `/`). */
	homeHeroIntroReady: boolean
	markHomeHeroIntroComplete: () => void
}

const HeroIntroContext = createContext<HeroIntroContextValue | null>(null)

export function HeroIntroProvider({ children }: { children: ReactNode }) {
	const { pathname } = useLocation()
	const isHome = pathname === "/"
	const hasCompletedHomeHero = useRef(false)
	const [homeHeroSceneReady, setHomeHeroSceneReady] = useState(false)

	const [homeHeroIntroReady, setHomeHeroIntroReady] = useState(() => !isHome)

	useEffect(() => {
		setHomeHeroSceneReady(!isHome || hasCompletedHomeHero.current)
		if (!isHome) {
			setHomeHeroIntroReady(true)
			return
		}
		if (hasCompletedHomeHero.current) {
			setHomeHeroIntroReady(true)
		} else {
			setHomeHeroIntroReady(false)
		}
	}, [isHome, pathname])

	const markHomeHeroSceneReady = useCallback(() => {
		setHomeHeroSceneReady(true)
	}, [])

	useEffect(() => {
		if (!isHome || homeHeroSceneReady) return
		const fallback = window.setTimeout(() => {
			setHomeHeroSceneReady(true)
		}, 3500)
		return () => window.clearTimeout(fallback)
	}, [homeHeroSceneReady, isHome])

	const markHomeHeroIntroComplete = useCallback(() => {
		hasCompletedHomeHero.current = true
		setHomeHeroIntroReady(true)
	}, [])

	return (
		<HeroIntroContext.Provider
			value={{
				homeHeroSceneReady,
				homeHeroIntroReady,
				markHomeHeroSceneReady,
				markHomeHeroIntroComplete,
			}}
		>
			{children}
		</HeroIntroContext.Provider>
	)
}

export function useHeroIntro() {
	const ctx = useContext(HeroIntroContext)
	if (!ctx) {
		throw new Error("useHeroIntro must be used within HeroIntroProvider")
	}
	return ctx
}
