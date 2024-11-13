
import {html, Op, OpSignal, shadowView} from "@benev/slate"

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
		multiplayerOp?: OpSignal<MultiplayerHost | MultiplayerClient>
		exitToMainMenu: () => void
	}) => {

	use.styles(themeCss, stylesCss)

	const panels = o.multiplayerOp
		? [
			AccountPanel(),
			LobbyPanel(o.multiplayerOp),
			QuitPanel(o.exitToMainMenu),
		]
		: [
			AccountPanel(),
			QuitPanel(o.exitToMainMenu),
		]

	return html`
		${o.realm.world.canvas}

		<div class=overlay>
			${Gigamenu(panels)}
		</div>
	`
})

