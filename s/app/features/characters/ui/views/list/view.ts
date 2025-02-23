
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import {CharacterCard} from "../card/view.js"
import {CharacterRecord} from "../../../types.js"
import {CharacterSituation} from "../../types.js"
import {Context} from "../../../../../context.js"
import themeCss from "../../../../../theme.css.js"
import {CharacterCreator} from "../creator/view.js"
import {Character} from "../../../parts/character.js"

export const CharacterList = shadowView(use => (options: {
		onSelect?: (character: Character) => void
	}) => {

	use.name("character-list")
	use.styles(themeCss, stylesCss)

	const {onSelect} = options
	const {accountManager, characterManager} = Context.context
	const isRando = accountManager.isRando()
	const account = accountManager.session.value.account
	const characters = [...characterManager.characters.value]

	const yourCharacters = characters
		.filter(character => character.ownerId === account.thumbprint)
		.sort((a, b) => b.created - a.created)

	const otherCharacters = characters
		.filter(character => character.ownerId !== account.thumbprint)
		.sort((a, b) => b.created - a.created)

	const maxCapacity = isRando
		? 2
		: 10

	const isOverCapacity = (yourCharacters.length >= maxCapacity)

	function renderCharacterCard(record: CharacterRecord) {
		const character = new Character(record)
		const isOwned = account.thumbprint === character.ownerId

		const situation: CharacterSituation = (
			(isOwned && onSelect) ?
				"selectable" :
			(isOwned) ?
				"manageable" :
				"foreign"
		)

		const select = (situation === "selectable" && onSelect)
			? (() => onSelect(character))
			: undefined

		const del = isOwned
			? (() => characterManager.delete(character.id))
			: undefined

		const claim = (!isRando && !isOwned)
			? (() => characterManager.claim(character.id))
			: undefined

		return CharacterCard([{
			character,
			situation,
			account,
			showOwner: situation === "foreign",
			controlbar: {select, del, claim},
			onClick: select,
		}])
	}

	return html`
		<section class=plate>
			${isOverCapacity ? html`
				<section>
					<header>
						<h2>You've used all your character slots</h2>
						${isRando ? html`
							<p>You're on a rando account, which has only ${maxCapacity} slots.</p>
						` : html`
							<p>Your account has ${maxCapacity} slots.</p>
						`}
					</header>
				</section>
			` : html`
				<section>
					<div>
						${CharacterCreator([{onCreated: onSelect}])}
					</div>
				</section>
			`}

			${(yourCharacters.length > 0) ? html`
				<section>
					<div>
						${yourCharacters.map(renderCharacterCard)}
					</div>
				</section>
			` : null}

			${(otherCharacters.length > 0) ? html`
				<section>
					<header>
						<h2>Transfer from your other accounts</h2>
						${isRando
							? html`<p>You must login to steal characters.</p>`
							: null}
					</header>
					<div>
						${otherCharacters.map(renderCharacterCard)}
					</div>
				</section>
			` : null}
		</section>
	`
})

