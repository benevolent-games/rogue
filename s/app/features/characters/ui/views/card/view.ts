
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import {CharacterSituation} from "../../types.js"
import themeCss from "../../../../../theme.css.js"
import {Account} from "../../../../accounts/types.js"
import {Character} from "../../../parts/character.js"
import {trueDate} from "../../../../../../tools/true-date.js"
import {AvatarView} from "../../../../../views/avatar/view.js"
import {CharacterDetails} from "../../../parts/character-details.js"

export type Controlbar = {
	select?: () => void
	del?: () => void
	claim?: () => void
	create?: () => void
	randomize?: () => void
}

export const CharacterCard = shadowView(use => (options: {
		character: Character | CharacterDetails
		situation: CharacterSituation
		account: Account
		controlbar?: Controlbar
		onClick?: () => void
	}) => {

	use.name("character-card")
	use.styles(themeCss, stylesCss)

	const {character, situation, controlbar, account, onClick} = options

	const id = (character instanceof Character)
		? character.id
		: undefined

	const isOwned = (character instanceof Character)
		? character.ownerId === account.thumbprint
		: true

	const click = onClick ?? (() => {})

	function renderControlbar({claim, del, randomize}: Controlbar) {
		return html`
			<div class=controlbar>
				${randomize && html`
					<button class="naked" @click="${() => randomize()}">
						Randomize
					</button>
				`}

				${claim && html`
					<button class="naked" @click="${() => claim()}">
						Steal ${(character instanceof Character)
							? `from ${character.ownerBadge.preview}`
							: null}
					</button>
				`}

				${del && html`
					<button class="naked angry" @click="${() => del()}">
						Delete
					</button>
				`}
			</div>
		`
	}

	function renderCharacterInfo(character: Character) {
		return html`
			<div hidden>${trueDate(character.created)}</div>
			<div>owned by ${character.ownerBadge.preview}</div>
		`
	}


	return html`
		<div class=card
			data-situation="${situation}"
			data-seed="${character.seed}"
			data-id="${id}">

			<div class=brick>
				<div class=saucer
					@click="${click}"
					?data-owned="${isOwned}"
					?data-clickable="${!!onClick}">

					<div class=details>
						<h3 class=font-fancy>${character.name}</h3>
						<div class=infos>
							<div>${character.heightDisplay.full}</div>
							${(character instanceof Character)
								? renderCharacterInfo(character)
								: null}
						</div>
					</div>

					<div class=avatar>
						${AvatarView([character.avatar])}
					</div>
				</div>

				${controlbar && renderControlbar(controlbar)}
			</div>

			${controlbar?.create && html`
				<div class=action>
					<button class=happy @click="${controlbar.create}">
						Create
					</button>
				</div>
			`}
		</div>
	`
})

