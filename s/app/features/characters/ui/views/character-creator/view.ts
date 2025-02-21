
import {html, shadowView, signal} from "@benev/slate"

import stylesCss from "./styles.css.js"
import {Context} from "../../../../../context.js"
import themeCss from "../../../../../theme.css.js"
import {CharacterGenesis} from "../../../types.js"
import {AvatarView} from "../../../../../views/avatar/view.js"
import {CharacterDetails} from "../../../parts/character-details.js"

export const CharacterCreator = shadowView(use => (options: {
		onDone: () => void,
	}) => {

	use.name("character-creator")
	use.styles(themeCss, stylesCss)

	const {accountManager, characterManager} = Context.context
	const characterSignal = use.once(() => signal(CharacterDetails.roll()))
	const session = use.computed(() => accountManager.session.value)
	const height = characterSignal.value.heightDisplay.full

	function roll() {
		characterSignal.value = CharacterDetails.roll()
	}

	function create(genesis: CharacterGenesis) {
		return async() => {
			await characterManager.create(genesis)
			options.onDone()
		}
	}

	if (!session.value) return html`
		<button @click="${options.onDone}">Cancel</button>
	`

	const character = characterSignal.value

	return html`
		<p>${AvatarView([character.avatar])}</p>
		<p>${character.seed.slice(0, 8)}</p>
		<p>${character.name}</p>
		<p>${height}</p>
		<button @click="${options.onDone}">Cancel</button>
		<button @click="${roll}">Randomize</button>
		<button @click="${create(character.genesis)}">Create</button>
	`
})

