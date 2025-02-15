
import {renderThumbprint} from "@authlocal/authlocal"
import {Barname, deep, Hex, html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"

import {context} from "../../context.js"
import {AvatarView} from "../avatar/view.js"
import {capitalize} from "../../../tools/capitalize.js"
import {Identity} from "../../features/accounts/ui/types.js"
import {Avatar} from "../../features/accounts/avatars/avatar.js"
import {isAvatarAllowed} from "../../features/accounts/utils/is-avatar-allowed.js"

type Info = {
	loggedIn: boolean
	id: string
	name: string
	avatar: Avatar
	tags: string[]
}

async function ascertainPersonInfo(identity: Identity): Promise<Info> {
	if (identity.kind === "rando") {
		const avatarPref = Avatar.get(identity.avatarId)
		const avatar = isAvatarAllowed(avatarPref, undefined)
			? avatarPref
			: Avatar.default
		const idBytes = Hex.bytes(identity.id)
		return {
			avatar,
			loggedIn: false,
			id: identity.id,
			name: `Rando ${capitalize(Barname.string(idBytes.slice(0, 2)))}`,
			tags: ["rando"],
		}
	}
	else {
		const account = await context.accountManager.verifyAccountDecree(identity.accountDecree)
		return {
			loggedIn: true,
			id: account.thumbprint,
			name: account.name,
			avatar: Avatar.get(account.avatarId),
			tags: account.tags,
		}
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
		${AvatarView([
			info?.avatar ?? Avatar.default,
			{loading: info ? isLoading : true},
		])}

		<div x-info>
			<span x-name>${info?.name ?? "~"}</span>

			<ul x-features>
				<li x-thumbprint>${info ? renderThumbprint(info.id) : "~"}</li>

				${info && info.tags.map(tag => html`
					<span>~</span>
					<li x-tag>${tag}</li>
				`)}
			</ul>
		</div>
	`
})

