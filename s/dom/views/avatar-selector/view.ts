
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import {AvatarView} from "../avatar/view.js"
import {context} from "../../../dom/context.js"
import themeCss from "../../../dom/theme.css.js"
import {Avatar} from "../../../features/accounts/avatars.js"
import {Account, AccountRecord, AccountTiers, isAvatarAllowed} from "../../../features/accounts/sketch.js"

export const AvatarSelectorView = shadowView(use => (options: {
		account: Account
		accountRecord: AccountRecord
	}) => {

	use.name("avatar-selector")
	use.styles(themeCss, stylesCss)

	const {account, accountRecord} = options

	const onClick = context.isSessionLoading
		? undefined
		: (avatar: Avatar) => {
			const unlocked = isAvatarAllowed(avatar, accountRecord)
			if (unlocked)
				context.changeAvatar(avatar.id)
		}

	const avatars = [...Avatar.library.values()]
		.filter(avatar => {
			if (!AccountTiers.isAdmin(account.tags))
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

