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
	/** When true, the main nav may play its entrance (home hero finished at least once this session, or not on `/`). */
	homeHeroIntroReady: boolean
	markHomeHeroIntroComplete: () => void
}

const HeroIntroContext = createContext<HeroIntroContextValue | null>(null)

export function HeroIntroProvider({ children }: { children: ReactNode }) {
	const { pathname } = useLocation()
	const isHome = pathname === "/"
	const hasCompletedHomeHero = useRef(false)

	const [homeHeroIntroReady, setHomeHeroIntroReady] = useState(() => !isHome)

	useEffect(() => {
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

	const markHomeHeroIntroComplete = useCallback(() => {
		hasCompletedHomeHero.current = true
		setHomeHeroIntroReady(true)
	}, [])

	return (
		<HeroIntroContext.Provider
			value={{ homeHeroIntroReady, markHomeHeroIntroComplete }}
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
