
import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {html, shadowView} from "@benev/slate"
import {Realm} from "../../../logic/realm/realm.js"

export const Gameplay = shadowView(use => ({realm, exitToMainMenu}: {
		realm: Realm
		exitToMainMenu: () => void,
	}) => {

	use.styles(themeCss, stylesCss)

	return html`
		${realm.world.canvas}
		<div class=overlay>
			<div class=topbar>
				<button @click="${exitToMainMenu}">menu</button>
			</div>
		</div>
	`
})

