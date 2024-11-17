
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import {Avatar} from "../../avatars.js"
import {Account} from "../../sketch.js"
import {AvatarView} from "../avatar/view.js"
import themeCss from "../../../../dom/theme.css.js"

export const AccountCardView = shadowView(use => (account: Account) => {
	use.styles(themeCss, stylesCss)

	const avatar = Avatar.library.get(account.avatarId) ?? Avatar.default
	// const thumbprintBytes = Hex.bytes(account.thumbprint).slice(0, 5)
	// const thumbprintName = Bytename.string(thumbprintBytes, "Xxxxxx Xxxxxxxxx ")

	return html`
		<div x-card x-status="${status}">
			${AvatarView([avatar])}

			<div x-info>
				<span x-name>${account.name}</span>
				<span x-thumbprint>${account.thumbprint.slice(0, 8)}</span>
				${account.tags.length > 0 ? html`
					<ul x-tags>
						${account.tags.map(tag => html`
							<li>${tag}</li>
						`)}
					</ul>
				` : null}
			</div>
		</div>
	`
})

