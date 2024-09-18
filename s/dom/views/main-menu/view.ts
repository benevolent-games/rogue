
import {html} from "@benev/slate"

import styles from "./styles.js"
import {nexus} from "../../nexus.js"
import {constants} from "../../../constants.js"

export const MainMenu = nexus.shadowView(use => ({nav}: {
		nav: {
			solo: () => void
		}
	}) => {

	use.name("main-menu")
	use.styles(styles)

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

