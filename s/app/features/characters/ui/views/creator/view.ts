
import {shadowView, signal} from "@benev/slate"

import stylesCss from "./styles.css.js"
import {CharacterCard} from "../card/view.js"
import {Context} from "../../../../../context.js"
import themeCss from "../../../../../theme.css.js"
import {CharacterGenesis} from "../../../types.js"
import {Character} from "../../../parts/character.js"
import {CharacterDetails} from "../../../parts/character-details.js"

export const CharacterCreator = shadowView(use => (options: {
		onCreated?: (character: Character) => void,
	}) => {

	use.name("character-creator")
	use.styles(themeCss, stylesCss)

	const onCreated = options.onCreated ?? (() => {})
	const {accountManager, characterManager} = Context.context
	const account = accountManager.session.value.account
	const characterSignal = use.once(() => signal(CharacterDetails.roll()))
	const character = characterSignal.value

	function roll() {
		characterSignal.value = CharacterDetails.roll()
	}

	function create(genesis: CharacterGenesis) {
		return async() => {
			roll()
			const record = await characterManager.create(genesis)
			onCreated(new Character(record))
		}
	}

	return CharacterCard([{
		character,
		situation: "creatable",
		account,
		onClick: () => create(character.genesis),
		controlbar: {
			randomize: roll,
			create: create(character.genesis),
		},
	}])
})

