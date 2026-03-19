// import Experience from "./Experiences/Experience"
import Experience from "./Experience"
import { Canvas } from "@react-three/fiber"
import LightSource from "./LightSource"
import { memo } from "react"

const Background = () => {
	return (
		<div>
			<div id='canvas'>
				<Canvas>
					<LightSource />
					<Experience />
					{/* <Preload all /> */}
				</Canvas>
			</div>
		</div>
	)
}

export default memo(Background)

// const Background = memo(() => {
//   return (
//     <Canvas>
//       {/* your scene */}
//     </Canvas>
//   )
// })

// export default Background
