
import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {html, shadowView} from "@benev/slate"

export const Permabar = shadowView(use => () => {
	use.styles(themeCss, stylesCss)

	return html`
		<p>Permabar</p>
	`
})

