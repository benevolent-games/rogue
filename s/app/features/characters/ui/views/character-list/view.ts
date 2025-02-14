
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import {CharacterManager} from "../../manager.js"
import themeCss from "../../../../../theme.css.js"

export const CharacterList = shadowView(use => (characterManager: CharacterManager) => {
	use.name("character-list")
	use.styles(themeCss, stylesCss)

	return html`
		<div>character-list</div>
	`
})

