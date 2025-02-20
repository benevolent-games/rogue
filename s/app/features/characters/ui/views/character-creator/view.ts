
import {html, shadowView, signal} from "@benev/slate"

import stylesCss from "./styles.css.js"
import {Context} from "../../../../../context.js"
import themeCss from "../../../../../theme.css.js"
import {CharacterDetails} from "../../../parts/character-details.js"

export const CharacterCreator = shadowView(use => () => {
	use.name("character-creator")
	use.styles(themeCss, stylesCss)

	const {accountManager, characterManager} = Context.context
	const characterDetails = use.once(() => signal(CharacterDetails.roll()))

	function roll() {
		characterDetails.value = CharacterDetails.roll()
	}

	return html`
		<div>character-creator</div>
		<p>${characterDetails.value.seed.slice(0, 8)}</p>
		<p>${characterDetails.value.name}</p>
		<button @click="${roll}">roll</button>
	`
})

