
import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {Permabar} from "../permabar/view.js"
import {html, shadowView} from "@benev/slate"
import {Lobby} from "../../../logic/lobby/lobby.js"
import {Realm} from "../../../logic/realm/realm.js"
import {LobbyPanel, LoginPanel, MenuPanel} from "../permabar/panels.js"

export const Gameplay = shadowView(use => ({realm, lobby, exitToMainMenu}: {
		realm: Realm
		lobby: Lobby
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
					new LobbyPanel({lobby, lobbyDisplay: lobby.display}),
				]
			], {attrs: {class: "permabar"}})}
		</div>
	`
})

