
import {html, Map2, RenderResult, shadowComponent} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {HashRouter} from "../../../tools/hash-router.js"
import {AccountView} from "../../views/gigamenu/panels/account/view.js"
import {CharacterList} from "../../features/characters/ui/views/list/view.js"

export const GameDev = shadowComponent(use => {
	use.styles(themeCss, stylesCss)

	const router = use.once(() => new HashRouter())

	const tabs = use.once(() => new Map2<string, () => RenderResult>([
		["/account", () => AccountView([])],
		["/characters", () => CharacterList([{
			onSelect: character => console.log(character)
		}])],
	]))

	const renderer = tabs.get(router.path.value)

	use.once(() => {
		if (!renderer)
			router.goto([...tabs.keys()][0])
	})

	return html`
		<slot></slot>

		<div class=battleship>
			<nav>
				${[...tabs.keys()].map(tab => html`
					<button
						class="play"
						?x-current="${tab === router.path.value}"
						@click="${() => { router.goto(tab) }}">
							${tab.slice(1)}
					</button>
				`)}
			</nav>

			<div class=deck>
				${renderer
					? renderer()
					: html`404 not found "${router.path.value}"`}
			</div>
		</div>
	`
})

