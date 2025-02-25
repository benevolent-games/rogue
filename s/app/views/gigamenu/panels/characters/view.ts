
import {shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../../../theme.css.js"
import {CharacterList} from "../../../../features/characters/ui/views/list/view.js"

export const CharactersView = shadowView(use => () => {
	use.styles(themeCss, stylesCss)
	return CharacterList([{
		onSelect: undefined,
		allowEditing: true,
		showForeigners: true,
	}])
})

