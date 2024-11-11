
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {Gigamenu} from "../gigamenu/view.js"
import {Lobby} from "../../../logic/lobby/lobby.js"
import {Realm} from "../../../logic/realm/realm.js"
import {QuitPanel} from "../gigamenu/panels/quit/panel.js"
import {LobbyPanel} from "../gigamenu/panels/lobby/panel.js"
import {AccountPanel} from "../gigamenu/panels/account/panel.js"

export const Gameplay = shadowView(use => ({realm, lobby, exitToMainMenu}: {
		realm: Realm
		lobby: Lobby
		exitToMainMenu: () => void,
	}) => {

	use.styles(themeCss, stylesCss)

	return html`
		${realm.world.canvas}

		<div class=overlay>
			${Gigamenu([
				AccountPanel(),
				LobbyPanel({lobby, lobbyDisplay: lobby.display}),
				QuitPanel(exitToMainMenu),
			])}
		</div>
	`
})

