
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import {Avatar} from "../../avatars.js"
import themeCss from "../../../../dom/theme.css.js"
import {Account, AccountRecord, isAvatarAllowed} from "../../sketch.js"

export const AvatarSelectorView = shadowView(use => (options: {
		account: Account
		accountRecord: AccountRecord
	}) => {

	use.styles(themeCss, stylesCss)

	const {account, accountRecord} = options

	const onclick = (avatar: Avatar) => () => {
		const unlocked = isAvatarAllowed(avatar, accountRecord)
		if (unlocked)
			console.log("select avatar", avatar.id)
	}

	const avatars = [...Avatar.library.values()]
		.filter(avatar => {
			if (!account.tags.includes("admin"))
				return avatar.kind !== "rare"
			return true
		})

	return html`
		<ol>
			${avatars.map(avatar => html`
				<li
					x-id="${avatar.id}"
					x-kind="${avatar.kind}"
					?x-selected="${account.avatarId === avatar.id}"
					?x-locked="${!isAvatarAllowed(avatar, accountRecord)}"
					@click="${onclick(avatar)}">
						<img src="${avatar.url}" alt=""/>
				</li>
			`)}
		</ol>
	`
})

