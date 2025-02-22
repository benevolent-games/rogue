
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../../../../theme.css.js"
import {Character} from "../../../parts/character.js"
import {CharacterList} from "../list/view.js"
import {CharacterCreator} from "../creator/view.js"

export const CharacterSelector = shadowView(use => (
		onSelect?: (character: Character) => void
	) => {

	use.name("character-list")
	use.styles(themeCss, stylesCss)

	const mode = use.signal<"list" | "create">("list")

	if (mode.value === "list") return html`
		${CharacterList([onSelect])}
		<button @click="${() => mode.value = "create"}">Create Character</button>
	`

	else return html`
		${CharacterCreator([{onDone: () => mode.value = "list"}])}
	`
})

