
import {html, shadowView, signal} from "@benev/slate"

import stylesCss from "./styles.css.js"
import {Context} from "../../../../../context.js"
import themeCss from "../../../../../theme.css.js"
import {CharacterDetails} from "../../../parts/character-details.js"

export const CharacterCreator = shadowView(use => () => {
	use.name("character-creator")
	use.styles(themeCss, stylesCss)

	const {accountManager, characterManager} = Context.context
	const characters = use.once(() => signal(CharacterDetails.roll()))

	function roll() {
		characters.value = CharacterDetails.roll()
	}

	const height = characters.value.heightDisplay

	return html`
		<div>character-creator</div>
		<p>${characters.value.seed.slice(0, 8)}</p>
		<p>${characters.value.name}</p>
		<p>${height.feetAndInches} (${height.centimeters}cm)</p>
		<button @click="${roll}">roll</button>
	`
})

