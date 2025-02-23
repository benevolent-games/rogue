
import {deep, html, shadowView} from "@benev/slate"
import {renderThumbprint} from "@authlocal/authlocal"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"

import {Context} from "../../context.js"
import {AvatarView} from "../avatar/view.js"
import {Identity} from "../../features/accounts/ui/types.js"
import {Avatar} from "../../features/accounts/avatars/avatar.js"
import {AccountDecrees} from "../../features/accounts/utils/account-decrees.js"

type Info = {
	loggedIn: boolean
	id: string
	name: string
	avatar: Avatar
	tags: string[]
}

async function ascertainPersonInfo(identity: Identity): Promise<Info> {
	const account = await AccountDecrees.verify(Context.context.commons.verifier, identity.accountDecree)
	const isRando = account.tags.includes("rando")
	return {
			loggedIn: !isRando,
			id: account.thumbprint,
			name: account.name,
			avatar: Avatar.get(account.avatarId),
			tags: account.tags,
	}
}

export const AccountCardView = shadowView(use => (
		identity_: Identity,
		isLoading: boolean,
	) => {

	use.name("account-card")
	use.styles(themeCss, stylesCss)

	const identity = use.signal(identity_)
	if (!deep.equal(identity.value, identity_))
		identity.value = identity_

	const infoOp = use.op<Info>()
	const info = infoOp.payload

	use.mount(() => {
		const reload = () => infoOp.load(
			async() => ascertainPersonInfo(identity.value)
		)
		reload()
		return identity.on(reload)
	})

	return html`
		<div class=card>
			${AvatarView([
				info?.avatar ?? Avatar.default,
				{loading: info ? isLoading : true},
			])}

			<div x-info>
				<span x-name>${info?.name ?? "~"}</span>

				<ul x-features>
					<li x-thumbprint>${info ? renderThumbprint(info.id) : "~"}</li>

					${info?.tags.map(tag => html`
						<span>~</span>
						<li x-tag>${tag}</li>
					`)}
				</ul>
			</div>
		</div>
	`
})

