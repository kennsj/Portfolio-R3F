// import Experience from "./Experiences/Experience"
import Experience from "./Experience"
import { Canvas } from "@react-three/fiber"
import LightSource from "./LightSource"

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

export default Background
