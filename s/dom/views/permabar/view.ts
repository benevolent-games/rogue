
import styles from "./styles.css.js"
import {html, shadowView} from "@benev/slate"

export const Permabar = shadowView(use => () => {
	use.styles(styles)

	return html`
		<p>Permabar</p>
	`
})

