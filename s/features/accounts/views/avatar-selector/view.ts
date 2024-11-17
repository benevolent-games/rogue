
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import {Avatar} from "../../avatars.js"
import {AvatarView} from "../avatar/view.js"
import themeCss from "../../../../dom/theme.css.js"
import {Account, AccountRecord, isAvatarAllowed} from "../../sketch.js"

export const AvatarSelectorView = shadowView(use => (options: {
		account: Account
		accountRecord: AccountRecord
	}) => {

	use.styles(themeCss, stylesCss)

	const {account, accountRecord} = options

	const onClick = (avatar: Avatar) => {
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
			${avatars.map(avatar => {
				const selected = account.avatarId === avatar.id
				const locked = !isAvatarAllowed(avatar, accountRecord)
				return html`
					<li>
						${AvatarView([avatar, {selected, locked, onClick}])}
					</li>
				`
			})}
		</ol>
	`
})

