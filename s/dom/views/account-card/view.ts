
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import {AvatarView} from "../avatar/view.js"
import themeCss from "../../../dom/theme.css.js"
import {IdView} from "../../../dom/views/id/view.js"
import {Avatar} from "../../../features/accounts/avatars.js"
import {Account} from "../../../features/accounts/sketch.js"

export const AccountCardView = shadowView(use => (account: Account, isLoading: boolean) => {
	use.name("account-card")
	use.styles(themeCss, stylesCss)

	const avatar = Avatar.library.get(account.avatarId) ?? Avatar.default
	// const thumbprintBytes = Hex.bytes(account.thumbprint).slice(0, 8)
	// const thumbprint58 = Base58.string(thumbprintBytes)

	return html`
		<div x-card>
			${AvatarView([avatar, {loading: isLoading}])}

			<div x-info>
				<span x-name>${account.name}</span>
				<ul x-features>
					<li x-thumbprint>${IdView([account.thumbprint])}</li>
					${account.tags.map(tag => html`
						<li x-tag>${tag}</li>
					`)}
				</ul>
			</div>
		</div>
	`
})

