
import {html, loading, Map2, RenderResult, shadowComponent} from "@benev/slate"

import stylesCss from "./styles.css.js"
import {Mocks, prepareMocks} from "./mocks.js"
import themeCss from "../../theme.css.js"
import {CharacterManager} from "../../features/characters/ui/manager.js"
import {CharacterList} from "../../features/characters/ui/views/character-list/view.js"

type Stuff = Awaited<ReturnType<typeof prepareStuff>>

async function prepareStuff() {
	const mocks = await prepareMocks()
	const characterManager = new CharacterManager(mocks)
	return {...mocks, characterManager}
}

export const GameDev = shadowComponent(use => {
	use.styles(themeCss, stylesCss)

	const stuffOp = use.load(async() => {
		const mocks = await prepareMocks()
		const characterManager = new CharacterManager(mocks)
		return {...mocks, characterManager}
	})

	const tabs = use.once(() => new Map2<string, (stuff: Stuff) => RenderResult>([
		["characters", stuff => CharacterList([stuff.characterManager])],
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
			${loading.binary(stuffOp, stuff => html`
				<div class=deck>
					${tabs.require(currentTab.value)(stuff)}
				</div>
			`)}
		</div>
	`
})

