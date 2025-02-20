
import {Hex, html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import {Context} from "../../../../../context.js"
import themeCss from "../../../../../theme.css.js"
import {Names} from "../../../../../../tools/names.js"

export const CharacterList = shadowView(use => () => {
	use.name("character-list")
	use.styles(themeCss, stylesCss)

	const {accountManager, characterManager} = Context.context

	// const login = use.computed(() => accountManager.session.value?.login)

	use.load(async() => {
		const session = accountManager.session.value
		if (session)
			await characterManager.downloadFromApi(session)
	})

	use.mount(() => accountManager.session.on(async session => {
		if (session)
			await characterManager.downloadFromApi(session)
	}))

	return html`
		<div>character-list</div>
		<ol>
			${characterManager.characters.value.map(character => html`
				<li>${Names.falrysk.generate(Hex.bytes(character.id))}</li>
			`)}
		</ol>
	`

	// ${login.value ? html`
	// 	<button @click="${() => characterManager.create(login.value!)}">add character</button>
	// ` : null}
})

