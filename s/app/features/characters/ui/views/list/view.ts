
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
		.sort((a, b) => a.created - b.created)

	const otherCharacters = characters
		.filter(character => character.ownerId !== account.thumbprint)
		.sort((a, b) => a.created - b.created)

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
			controlbar: {select, del, claim},
			onClick: select,
		}])
	}

	return html`
		<section class=plate>
			${(yourCharacters.length > 0) ? html`
				<section>
					<header>
						${onSelect
							? html`<h2>Choose a character:</h2>`
							: html`<h2>Your characters:</h2>`}
					</header>
					<div>
						${yourCharacters.map(renderCharacterCard)}
					</div>
				</section>
			` : null}

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
					<header>
						<h2>Create a new character:</h2>
					</header>
					<div>
						${CharacterCreator([{onCreated: onSelect}])}
					</div>
				</section>
			`}

			${(otherCharacters.length > 0) ? html`
				<section>
					<header>
						<h2>Characters from your other accounts</h2>
						${accountManager.isRando() ? html`
							<p>You're on a rando account. Login to a legit account and you can steal these characters.</p>
						` : html`
							<p>You can steal these characters, transferring them to your current account.</p>
						`}
					</header>
					<div>
						${otherCharacters.map(renderCharacterCard)}
					</div>
				</section>
			` : null}
		</section>
	`
})

