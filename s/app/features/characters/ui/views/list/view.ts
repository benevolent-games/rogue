
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import {CharacterCard} from "../card/view.js"
import {Context} from "../../../../../context.js"
import themeCss from "../../../../../theme.css.js"
import {Character} from "../../../parts/character.js"
import { CharacterRecord } from "../../../types.js"

export const CharacterList = shadowView(use => (
		onSelect?: (character: Character) => void
	) => {

	use.name("character-list")
	use.styles(themeCss, stylesCss)

	const {accountManager, characterManager} = Context.context
	const session = accountManager.session.value
	const account = session?.account

	const isRando = account.tags.includes("rando")

	const characters = [...characterManager.characters.value]

	const yourCharacters = characters
		.filter(character => character.ownerId === account.thumbprint)
		.sort((a, b) => b.created - a.created)

	const otherCharacters = characters
		.filter(character => character.ownerId !== account.thumbprint)
		.sort((a, b) => b.created - a.created)

	function renderCharacterCard(record: CharacterRecord) {
		const character = new Character(record)
		const isOwned = account.thumbprint === character.ownerId
		const canClaim = !isRando && !isOwned
		const canDelete = isOwned
		return CharacterCard([{
			account,
			character,
			onSelect: onSelect && (() => onSelect(character)),
			controlbar: {
				del: canDelete
					? () => characterManager.delete(character.id)
					: undefined,
				claim: canClaim
					? () => characterManager.claim(character.id)
					: undefined,
			},
		}])
	}

	return html`
		<h2>Your characters</h2>
		<div class=cardlist>
			${yourCharacters.map(renderCharacterCard)}
		</div>
		<h2>Characters on your other accounts</h2>
		<div class=cardlist>
			${otherCharacters.map(renderCharacterCard)}
		</div>
	`
})

