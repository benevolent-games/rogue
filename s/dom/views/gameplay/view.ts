
import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {Permabar} from "../permabar/view.js"
import {html, shadowView} from "@benev/slate"
import {Realm} from "../../../logic/realm/realm.js"
import {LoginPanel, MenuPanel} from "../permabar/panels.js"

export const Gameplay = shadowView(use => ({realm, exitToMainMenu}: {
		realm: Realm
		exitToMainMenu: () => void,
	}) => {

	use.styles(themeCss, stylesCss)

	return html`
		${realm.world.canvas}
		<div class=overlay>
			${Permabar([
				[
					new MenuPanel(exitToMainMenu),
					new LoginPanel(),
				]
			], {attrs: {class: "permabar"}})}
		</div>
	`
})

