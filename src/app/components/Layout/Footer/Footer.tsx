import { usePageTransition } from "@/app/hooks/usePageTransition"
import styles from "./Footer.module.scss"

const Footer = () => {
	const { transitionTo } = usePageTransition()

	const goTo = (href: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault()
		transitionTo(href)
	}

	return (
		<footer id='footer' className={styles.footer}>
			<div className={styles.inner}>
				<p>© {new Date().getFullYear()} Kenneth Jørgensen</p>
				<nav aria-label='Footer navigation'>
					<a href='/' onClick={goTo('/')}>Index</a>
					<a href='/#work' onClick={goTo('/#work')}>Work</a>
					<a href='/#about' onClick={goTo('/#about')}>About</a>
					<a href='/#contact' onClick={goTo('/#contact')}>Contact</a>
				</nav>
				<a className={styles.top} href='#top'>Back to top ↑</a>
			</div>
		</footer>
	)
}

export default Footer
