
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {Gigamenu} from "../gigamenu/view.js"
import {Realm} from "../../../logic/realm/realm.js"
import {QuitPanel} from "../gigamenu/panels/quit/panel.js"
import {LobbyPanel} from "../gigamenu/panels/lobby/panel.js"
import {AccountPanel} from "../gigamenu/panels/account/panel.js"
import {MultiplayerHost} from "../../../logic/multiplayer/multiplayer-host.js"
import {MultiplayerClient} from "../../../logic/multiplayer/multiplayer-client.js"

export const Gameplay = shadowView(use => (o: {
		realm: Realm
		multiplayer: MultiplayerHost | MultiplayerClient
		exitToMainMenu: () => void
	}) => {

	use.styles(themeCss, stylesCss)

	return html`
		${o.realm.world.canvas}

		<div class=overlay>
			${Gigamenu([
				AccountPanel(),
				LobbyPanel(o.multiplayer),
				QuitPanel(o.exitToMainMenu),
			])}
		</div>
	`
})

