
import {Bytename, Hex, html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import {Avatar} from "../../avatars.js"
import {Account} from "../../sketch.js"
import themeCss from "../../../../dom/theme.css.js"

export const AccountCardView = shadowView(use => (account: Account) => {
	use.styles(themeCss, stylesCss)

	const avatar = Avatar.library.get(account.avatarId) ?? Avatar.default
	const thumbprintBytes = Hex.bytes(account.thumbprint).slice(0, 5)
	const thumbprintName = Bytename.string(thumbprintBytes, "Xxxxxx Xxxxxxxxx ")

	return html`
		<div x-card>

			<div x-avatar x-kind="${avatar.kind}">
				<img src="${avatar.url}" alt=""/>
			</div>

			<div x-info>
				<span x-name>${account.name}</span>
				<span x-thumbprint>${thumbprintName}</span>
			</div>

		</div>
	`
})

