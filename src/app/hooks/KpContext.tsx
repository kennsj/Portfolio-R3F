import { createContext, useContext, useState } from "react"

type KpContextType = {
	manualKp: number | null
	setManualKp: (kp: number | null) => void
}

const KpContext = createContext<KpContextType>({
	manualKp: null,
	setManualKp: () => {},
})

export const KpProvider = ({ children }: { children: React.ReactNode }) => {
	const [manualKp, setManualKp] = useState<number | null>(null)
	return (
		<KpContext.Provider value={{ manualKp, setManualKp }}>
			{children}
		</KpContext.Provider>
	)
}

export const useManualKp = () => useContext(KpContext)
