// import Experience from "./Experiences/Experience"
import Experience from "./Experience"
import { Canvas } from "@react-three/fiber"
import LightSource from "./LightSource"

const Background = ({ onReady }: { onReady: () => void }) => {
	return (
		<div>
			<div id='canvas'>
				<Canvas
					dpr={[1, 1.5]}
					gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}
					performance={{ min: 0.55, max: 1, debounce: 240 }}
					style={{ width: "100%", height: "100%", display: "block" }}
				>
					<LightSource />
					<Experience onReady={onReady} />
					{/* <Preload all /> */}
				</Canvas>
			</div>
		</div>
	)
}

export default Background

// const Background = memo(() => {
//   return (
//     <Canvas>
//       {/* your scene */}
//     </Canvas>
//   )
// })

// export default Background
