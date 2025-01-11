
import {ev, html, shadowView} from "@benev/slate"
import {NubStick} from "@benev/toolbox/x/tact/nubs/stick/view.js"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {Gigamenu} from "../gigamenu/view.js"
import {Realm} from "../../../logic/realm/realm.js"
import {QuitPanel} from "../gigamenu/panels/quit/panel.js"
import {LobbyPanel} from "../gigamenu/panels/lobby/panel.js"
import {toggleFullscreen} from "./utils/toggle-fullscreen.js"
import {AccountPanel} from "../gigamenu/panels/account/panel.js"
import {dungeonDropper} from "../../../logic/dungeons/ui/dropper.js"
import {MultiplayerClient} from "../../../archimedes/net/multiplayer/multiplayer-client.js"

import {StatsPanel} from "../gigamenu/panels/stats/panel.js"
import maximizeSvg from "../../icons/tabler/maximize.svg.js"
import componentsSvg from "../../icons/tabler/components.svg.js"

export const Gameplay = shadowView(use => (o: {
		realm: Realm
		multiplayerClient: MultiplayerClient
		exitToMainMenu: () => void
	}) => {

	use.styles(themeCss, stylesCss)

	// prevent ctrl-w insta-killing the tab
	use.mount(() => ev(window, {
		beforeunload: (event: BeforeUnloadEvent) => {
			const message = "Are you sure you want to yeet this tab? You'll wreck any session you're currently playing!"
			event.preventDefault()
			return message
		},
	}))

	// prevent right-click context menu
	use.mount(() => ev(document, {
		contextmenu: (event: Event) => {
			event.preventDefault()
		},
	}))

	const dropper = use.once(() => dungeonDropper(
		files => o.realm.onFilesDropped.publish(files))
	)

	const panels = o.multiplayerClient
		? [
			AccountPanel(),
			LobbyPanel(o.multiplayerClient),
			StatsPanel(o.realm.stats),
			QuitPanel(o.exitToMainMenu),
		].filter(x => !!x)
		: [
			AccountPanel(),
			StatsPanel(o.realm.stats),
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

				<div class=buttonbar>
					<button class="naked" title="reset camera" @click="${() => o.realm.cameraman.reset()}">
						${componentsSvg}
					</button>
					<button class="naked" title="fullscreen" @click="${() => toggleFullscreen(use.element)}">
						${maximizeSvg}
					</button>
				</div>

				<div class=coolarea>
					${NubStick([o.realm.userInputs.stick])}
				</div>
			</div>

			${(dropper.indicator || null) && html`
				<div class=drop-indicator>
					file drop detected
				</div>
			`}
		</div>
	`
})

