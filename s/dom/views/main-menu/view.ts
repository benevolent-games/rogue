
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {Gigamenu} from "../gigamenu/view.js"
import {constants} from "../../../constants.js"
import {AccountPanel} from "../gigamenu/panels/account/panel.js"

export const MainMenu = shadowView(use => ({nav}: {
		nav: {
			play: () => void
		}
	}) => {

	use.styles(themeCss, stylesCss)

	return html`
		<div class=overlay>
			${Gigamenu([AccountPanel()])}
		</div>

		<section class=plate>
			<img src="${constants.urls.cover}" alt=""/>
			<div class=content>
				<h1>Righteous Fury</h1>
				<nav>
					<button class="naked flashy" @click="${nav.play}">
						Play
					</button>
				</nav>
			</div>
		</section>
	`
})

