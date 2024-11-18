
import {html, nap, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {Gigamenu} from "../gigamenu/view.js"
import {constants} from "../../../constants.js"
import {loadImage2} from "../../../tools/loading/load-image.js"
import {AccountPanel} from "../gigamenu/panels/account/panel.js"

export const MainMenu = shadowView(use => ({nav}: {
		nav: {
			play: () => void
		}
	}) => {

	use.styles(themeCss, stylesCss)

	const ready = use.signal(false)
	const img = use.once(() => loadImage2(constants.urls.cover))

	use.deferOnce(() => {
		nap()
			.then(() => nap())
			.then(() => img.promise)
			.finally(() => ready.value = true)
	})

	return html`
		<div class=overlay>
			${Gigamenu([AccountPanel()])}
		</div>

		<section class=plate ?x-ready="${ready.value}">
			${img.element}

			<div class=content>
				<h1>Rogue Crusade</h1>
				<nav>
					<button class=play @click="${nav.play}">
						Play
					</button>
				</nav>
			</div>
		</section>
	`
})

