
import {html, Map2, RenderResult, shadowComponent} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {Server} from "../../../server/server.js"
import {CharacterList} from "../../../ui/characters/views/character-list/view.js"

const server = await Server.make()

export const GameDev = shadowComponent(use => {
	use.styles(themeCss, stylesCss)

	const tabs = use.once(() => new Map2<string, () => RenderResult>([
		["characters", () => CharacterList([])],
	]))

	const currentTab = use.signal([...tabs.keys()][0])

	return html`
		<slot></slot>

		<div class=battleship>
			<nav>
				${[...tabs.keys()].map(tab => html`
					<button
						class="play"
						?x-current="${tab === currentTab.value}"
						@click="${() => { currentTab.value = tab }}">
							${tab}
					</button>
				`)}
			</nav>
			<div class=deck>
				${tabs.require(currentTab.value)()}
			</div>
		</div>
	`
})

