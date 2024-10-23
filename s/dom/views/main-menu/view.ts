
import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {html, shadowView} from "@benev/slate"
import {constants} from "../../../constants.js"

export const MainMenu = shadowView(use => ({nav}: {
		nav: {
			solo: () => void
		}
	}) => {

	use.styles(themeCss, stylesCss)

	return html`
		<section class=plate style="background-image: url('${constants.urls.cover}');">
			<h1>Righteous Fury</h1>
			<nav>
				<button class="naked flashy" @click="${nav.solo}">
					Play Solo
				</button>
			</nav>
		</section>
	`
})

