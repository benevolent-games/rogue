
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../../../theme.css.js"

export const AccountView = shadowView(use => () => {
	use.styles(themeCss, stylesCss)

	return html`
		<section>
			<auth-login></auth-login>
		</section>
	`
})

