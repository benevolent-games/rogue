
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"

import {Context} from "../../context.js"
import {AvatarView} from "../avatar/view.js"
import {Avatar} from "../../features/accounts/avatars/avatar.js"
import {Account, AccountRecord} from "../../features/accounts/types.js"
import {AccountTiers} from "../../features/accounts/utils/account-tiers.js"
import {isAvatarAllowed} from "../../features/accounts/utils/is-avatar-allowed.js"

export const AvatarSelectorView = shadowView(use => (options: {
		account: Account
		accountRecord: AccountRecord
	}) => {

	use.name("avatar-selector")
	use.styles(themeCss, stylesCss)
	const {context} = Context

	const {account, accountRecord} = options

	const onClick = context.accountManager.isSessionLoading
		? undefined
		: (avatar: Avatar) => {
			const unlocked = isAvatarAllowed(avatar, accountRecord.privileges)
			if (unlocked)
				context.accountManager.savePreferences(avatar.id)
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
				const locked = !isAvatarAllowed(avatar, accountRecord.privileges)
				return html`
					<li>
						${AvatarView([avatar, {selected, locked, onClick}])}
					</li>
				`
			})}
		</ol>
	`
})

