
import {html, shadowComponent} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"

export const SuperControl = shadowComponent(use => {
	use.styles(themeCss, stylesCss)

	return html`
		supercontrol
	`
})

