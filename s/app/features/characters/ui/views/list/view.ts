
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import {CharacterCard} from "../card/view.js"
import {CharacterRecord} from "../../../types.js"
import {Context} from "../../../../../context.js"
import themeCss from "../../../../../theme.css.js"
import {CharacterCreator} from "../creator/view.js"
import {Character} from "../../../parts/character.js"

export const CharacterList = shadowView(use => (options: {
		allowEditing: boolean
		showForeigners: boolean
		onSelect: undefined | ((character: Character) => void)
	}) => {

	use.name("character-list")
	use.styles(themeCss, stylesCss)

	const {allowEditing, showForeigners, onSelect} = options
	const {accountant, roster: characterManager} = Context.context
	const isRando = accountant.isRando()
	const account = accountant.session.value.account
	const characters = [...characterManager.characters.value]

	const locals = characters
		.filter(character => character.ownerId === account.thumbprint)
		.sort((a, b) => b.created - a.created)

	const foreigners = characters
		.filter(character => character.ownerId !== account.thumbprint)
		.sort((a, b) => b.created - a.created)

	const maxCapacity = isRando
		? 2
		: 10

	const isOverCapacity = (locals.length >= maxCapacity)

	function renderCard(record: CharacterRecord) {
		const character = new Character(record)
		const isOwned = account.thumbprint === character.ownerId

		const select = (isOwned && onSelect)
			? (() => onSelect(character))
			: undefined

		const del = (allowEditing && isOwned)
			? (() => characterManager.delete(character.id))
			: undefined

		const claim = (allowEditing && !isRando && !isOwned)
			? (() => characterManager.claim(character.id))
			: undefined

		return CharacterCard([{
			character,
			variety: isOwned ? "standard" : "foreign",
			account,
			showOwner: !isOwned,
			controlbar: {select, del, claim},
			onClick: select,
		}])
	}

	function renderCreator() {
		if (!allowEditing) return null
		else if (isOverCapacity) return html`
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
		`
		else return html`
			<section>
				<div>
					${CharacterCreator([{onCreated: onSelect}])}
				</div>
			</section>
		`
	}

	function renderLocals() {
		if (locals.length === 0) return null
		else return html`
			<section>
				<div>
					${locals.map(renderCard)}
				</div>
			</section>
		`
	}

	function renderForeigners() {
		if (!showForeigners) return null
		else if (foreigners.length === 0) return null
		else return html`
			<section>
				<header>
					${allowEditing ? html`
						<h2>Transfer from your other accounts</h2>
						${isRando
							? html`<p>You must login to steal characters.</p>`
							: null}
					` : html`
						<h2>On your other accounts</h2>
					`}
				</header>
				<div>
					${foreigners.map(renderCard)}
				</div>
			</section>
		`
	}

	return html`
		<section class=plate>
			${renderCreator()}
			${renderLocals()}
			${renderForeigners()}
		</section>
	`
})

