import HeadingAnimation from "../../UI/HeadingAnimation/HeadingAnimation"
import TextBlock from "../../UI/TextBlock/TextBlock"
import Aurora from "../Aurora/Aurora"
import styles from "./Contact.module.scss"

const Contact = () => {
	return (
		<section aria-label='Contact'>
			<div className={styles["contact-wrapper"]}>
				<HeadingAnimation level={3}>Contact</HeadingAnimation>
				<TextBlock>
					Now you know where the background <br /> comes from. And where I come
					from.
				</TextBlock>
				<Aurora />
			</div>
		</section>
	)
}

export default Contact
