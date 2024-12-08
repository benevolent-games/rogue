
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {Gigamenu} from "../gigamenu/view.js"
import {Realm} from "../../../logic2/realm/realm.js"
import {QuitPanel} from "../gigamenu/panels/quit/panel.js"
import {LobbyPanel} from "../gigamenu/panels/lobby/panel.js"
import {AccountPanel} from "../gigamenu/panels/account/panel.js"
import {dungeonDropper} from "../../../logic2/dungeons/ui/dropper.js"
import {MultiplayerClient} from "../../../archimedes/net/multiplayer/multiplayer-client.js"

export const Gameplay = shadowView(use => (o: {
		realm: Realm
		multiplayerClient: MultiplayerClient,
		exitToMainMenu: () => void
	}) => {

	use.styles(themeCss, stylesCss)

	const dropper = use.once(() => dungeonDropper(
		files => o.realm.onFilesDropped.publish(files))
	)

	const panels = o.multiplayerClient
		? [
			AccountPanel(),
			LobbyPanel(o.multiplayerClient),
			QuitPanel(o.exitToMainMenu),
		].filter(x => !!x)
		: [
			AccountPanel(),
			QuitPanel(o.exitToMainMenu),
		]

	return html`
		<div class=container
			?x-drop-hover="${dropper.indicator}"
			@dragover="${dropper.dragover}"
			@dragleave="${dropper.dragleave}"
			@drop="${dropper.drop}">

			${o.realm.world.canvas}

			<div class=overlay>
				${Gigamenu(panels)}
			</div>

			${(dropper.indicator || null) && html`
				<div class=drop-indicator>
					file drop detected
				</div>
			`}
		</div>
	`
})

