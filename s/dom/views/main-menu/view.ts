
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {Gigamenu} from "../gigamenu/view.js"
import {constants} from "../../../constants.js"
import {AccountPanel} from "../gigamenu/panels/account/panel.js"

export const MainMenu = shadowView(use => ({nav}: {
		nav: {solo: () => void}
	}) => {

	use.styles(themeCss, stylesCss)

	return html`
		${Gigamenu([AccountPanel()])}

		<section class=plate style="background-image: url('${constants.urls.cover}');">
			<h1>Righteous Fury</h1>
			<nav>
				<button class="naked flashy" @click="${nav.solo}">
					Play
				</button>
			</nav>
		</section>
	`
})

