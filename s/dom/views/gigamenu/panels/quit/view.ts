
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../../../theme.css.js"

export const QuitView = shadowView(use => (exit: () => void) => {
	use.styles(themeCss, stylesCss)

	return html`
		<section>
			<button class=angry x-exit @click="${exit}">
				Exit Game
			</button>
		</section>
	`
})

