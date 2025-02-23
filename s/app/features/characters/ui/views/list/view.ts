
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
	const account = accountManager.session.value.account
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
		const situation: CharacterSituation = (
			(isOwned && onSelect) ?
				"selectable" :
			(isOwned) ?
				"manageable" :
				"claimable"
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
			onClick: select,
			controlbar: {select, del, claim},
		}])
	}

	return html`
		<section class=plate>
			${(yourCharacters.length > 0) ? html`
				<section>
					<header>
						${onSelect
							? html`<h2>Select a character:</h2>`
							: html`<h2>Your characters:</h2>`}
					</header>
					<div>
						${yourCharacters.map(renderCharacterCard)}
					</div>
				</section>
			` : null}

			<section>
				<header>
					<h2>Create a new character:</h2>
				</header>
				<div>
					${CharacterCreator([{onCreated: onSelect}])}
				</div>
			</section>

			${(otherCharacters.length > 0) ? html`
				<section>
					<header>
						${accountManager.isRando() ? html`
							<h2>Characters from your other accounts</h2>
							<p>You're on a rando account, which cannot steal from legit accounts.</p>
						` : html`
							<h2>Characters from your other accounts</h2>
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

