
import {IdView} from "@authlocal/authlocal"
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import {CharacterRecord} from "../../../types.js"
import {Context} from "../../../../../context.js"
import themeCss from "../../../../../theme.css.js"
import {Character} from "../../../parts/character.js"
import {trueDate} from "../../../../../../tools/true-date.js"
import {AvatarView} from "../../../../../views/avatar/view.js"

export const CharacterList = shadowView(use => (onSelect?: (character: Character) => void) => {
	use.name("character-list")
	use.styles(themeCss, stylesCss)

	const {accountManager, characterManager} = Context.context
	const session = accountManager.session.value
	const account = session?.account

	function renderCharacter(record: CharacterRecord) {
		const character = new Character(record)
		const isOwned = account && (account.thumbprint === character.ownerId)
		const del = () => () => characterManager.delete(record.id)
		const claim = () => () => characterManager.claim(record.id)
		const click = () => {
			if (onSelect)
				onSelect(character)
		}
		return html`
			<li id="${character.id}">
				<div class=card
					?data-selectable="${!!onSelect}"
					@click="${click}"
					?data-owned="${isOwned}">

					<div class=details>
						<h3>${character.name}</h3>
						<div class=infos>
							<div>${trueDate(character.created)}</div>
							<div>${IdView([character.id, character.id.slice(0, 8)])}</div>
							<div>${character.heightDisplay.full}</div>
						</div>
					</div>

					<div>${AvatarView([character.avatar])}</div>
				</div>
				<div class=controlbar>
					${account && (isOwned ? html`
						<button @click="${del()}">Delete</button>
					` : html`
						<button @click="${claim()}">Claim</button>
					`)}
				</div>
			</li>
		`
	}

	// const characters = [...characterManager.characters.value]
	// const ownedCharacters = characters.filter(character => {
	// 	if (!session)
	// 		return false
	// 	return session.account.thumbprint
	// })

	return html`
		<ol>
			${characterManager.characters.value.map(record => renderCharacter(record))}
		</ol>
	`
})

