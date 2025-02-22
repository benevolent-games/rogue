
import {IdView} from "@authlocal/authlocal"
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../../../../theme.css.js"
import {Account} from "../../../../accounts/types.js"
import {Character} from "../../../parts/character.js"
import {trueDate} from "../../../../../../tools/true-date.js"
import {AvatarView} from "../../../../../views/avatar/view.js"
import {CharacterDetails} from "../../../parts/character-details.js"

export type Controlbar = {
	del?: () => void
	claim?: () => void
	create?: () => void
	randomize?: () => void
}

export const CharacterCard = shadowView(use => (options: {
		account: Account
		character: Character | CharacterDetails
		onSelect?: () => void
		controlbar?: Controlbar
	}) => {

	use.name("character-card")
	use.styles(themeCss, stylesCss)
	const {character, controlbar} = options

	function renderControlbar({claim, del}: Controlbar) {
		return html`
			<div class=controlbar>

				${claim &&
					html`<button @click="${() => claim()}">Claim</button>`}

				${del &&
					html`<button @click="${() => del()}">Delete</button>`}
			</div>
		`
	}

	function renderFullCharacter(character: Character) {
		const isOwned = character.ownerId === options.account.thumbprint
		const isSelectable = !!options.onSelect
		const click = () => {
			if (options.onSelect)
				options.onSelect()
		}
		return html`
			<div class=card data-seed="${character.seed}">
				<div class=saucer
					@click="${click}"
					?data-owned="${isOwned}"
					?data-selectable="${isSelectable}">

					<div class=details>
						<h3>${character.name}</h3>
						<div class=infos>
							<div>${trueDate(character.created)}</div>
							<div>${IdView([character.seed, character.seed.slice(0, 8)])}</div>
							<div>${character.heightDisplay.full}</div>
						</div>
					</div>

					<div>${AvatarView([character.avatar])}</div>
				</div>

				${controlbar && renderControlbar(controlbar)}
			</div>
		`
	}

	function renderDraftCharacter(character: CharacterDetails) {
		return html`
			<div class=card data-seed="${character.seed}">
				<div class=saucer>

					<div class=details>
						<h3>${character.name}</h3>
						<div class=infos>
							<div>${IdView([character.seed, character.seed.slice(0, 8)])}</div>
							<div>${character.heightDisplay.full}</div>
						</div>
					</div>

					<div>${AvatarView([character.avatar])}</div>
				</div>

				${controlbar && renderControlbar(controlbar)}
			</div>
		`
	}

	return (character instanceof Character)
		? renderFullCharacter(character)
		: renderDraftCharacter(character)
})

