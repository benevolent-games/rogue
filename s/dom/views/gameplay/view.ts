
import {ev, html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {Gigamenu} from "../gigamenu/view.js"
import {Realm} from "../../../logic/realm/realm.js"
import {QuitPanel} from "../gigamenu/panels/quit/panel.js"
import {LobbyPanel} from "../gigamenu/panels/lobby/panel.js"
import {DragQueen} from "../../../tools/pointer/drag-queen.js"
import {AccountPanel} from "../gigamenu/panels/account/panel.js"
import {dungeonDropper} from "../../../logic/dungeons/ui/dropper.js"
import {MultiplayerClient} from "../../../archimedes/net/multiplayer/multiplayer-client.js"

export const Gameplay = shadowView(use => (o: {
		realm: Realm
		multiplayerClient: MultiplayerClient,
		exitToMainMenu: () => void
	}) => {

	use.styles(themeCss, stylesCss)
	use.mount(() => ev(document, {contextmenu: (e: Event) => e.preventDefault()}))

	// TODO extract this out into realm or something?
	const dragQueen = use.once(() => {
		const {cameraman} = o.realm
		const sensitivity = 0.002
		const isLeftMouse = (event: PointerEvent) => event.button === 0
		const isRightMouse = (event: PointerEvent) => event.button === 2
		const isMiddleMouse = (event: PointerEvent) => event.button === 1
		return new DragQueen({
			predicate: event => isLeftMouse(event) || isRightMouse(event) || isMiddleMouse(event),
			onAnyDrag: () => {},
			onAnyClick: () => {},
			onIntendedDrag: event => {
				cameraman.state.swivel -= event.movementX * sensitivity
				cameraman.state.tilt -= event.movementY * sensitivity
			},
			onIntendedClick: () => {},
		})
	})

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

			@blur="${dragQueen.events.blur}"
			@pointerup="${dragQueen.events.pointerup}"
			@pointerdown="${dragQueen.events.pointerdown}"
			@pointermove="${dragQueen.events.pointermove}"
			@pointerleave="${dragQueen.events.pointerleave}"

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

