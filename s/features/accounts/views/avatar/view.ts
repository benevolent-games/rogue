
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import {Avatar} from "../../avatars.js"
import themeCss from "../../../../dom/theme.css.js"

export type AvatarOptions = {
	selected?: boolean
	locked?: boolean
	onClick?: (avatar: Avatar) => void
}

export const AvatarView = shadowView(use => (avatar: Avatar, options: AvatarOptions = {}) => {
	use.name("avatar")
	use.styles(themeCss, stylesCss)

	const clickable = !!options.onClick
	const onClick = options.onClick ?? (() => {})

	return html`
		<div
			part=div
			x-id="${avatar.id}"
			x-kind="${avatar.kind}"
			?x-selected="${options.selected}"
			?x-locked="${options.locked}"
			?x-clickable="${clickable}"
			@click="${() => onClick(avatar)}"
			>
			<img part=img src="${avatar.url}" alt=""/>
		</div>
	`
})

