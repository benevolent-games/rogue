
import {Hex, html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import {Context} from "../../../../../context.js"
import themeCss from "../../../../../theme.css.js"
import {Character} from "../../../parts/character.js"
import {Names} from "../../../../../../tools/names.js"
import { CharacterRecord } from "../../../types.js"
import { IdView } from "@authlocal/authlocal"

export const CharacterList = shadowView(use => (onSelect?: (character: Character) => void) => {
	use.name("character-list")
	use.styles(themeCss, stylesCss)

	const {accountManager, characterManager} = Context.context

	const login = use.computed(() => accountManager.session.value?.login)

	use.load(async() => {
		const session = accountManager.session.value
		if (session)
			await characterManager.downloadFromApi(session)
	})

	use.mount(() => accountManager.session.on(async session => {
		if (session)
			await characterManager.downloadFromApi(session)
	}))

	function renderCharacter(record: CharacterRecord) {
		const character = new Character(record)
		const isOwned = login.value && login.value.thumbprint === character.ownerId
		return html`
			<li id="${character.id}">
				<div class=card
					?data-selectable="${!!onSelect}"
					@click="${onSelect}"
					?data-owned="${isOwned}">
					<div class=details>
						<h3>${character.name}</h3>
						<div class=infos>
							<div>${IdView([character.id])}</div>
							<div>${character.heightDisplay.full}</div>
						</div>
					</div>
				</div>
				<div class=controlbar>
					<button>delete</button>
				</div>
			</li>
		`
	}

	return html`
		<div>character-list</div>
		<ol>
			${characterManager.characters.value.map(record => renderCharacter(record))}
		</ol>
	`

	// ${login.value ? html`
	// 	<button @click="${() => characterManager.create(login.value!)}">add character</button>
	// ` : null}
})

