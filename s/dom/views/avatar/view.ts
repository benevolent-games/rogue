
import {html, shadowView} from "@benev/slate"
import {Avatar} from "../../../app/features/accounts/avatars/avatar.js"

import stylesCss from "./styles.css.js"
import themeCss from "../../../dom/theme.css.js"
import lockSvg from "../../../dom/icons/tabler/lock.svg.js"
import rotateClockwiseSvg from "../../../dom/icons/tabler/rotate-clockwise.svg.js"

export type AvatarOptions = {
	selected?: boolean
	locked?: boolean
	loading?: boolean
	disabled?: boolean
	onClick?: (avatar: Avatar) => void
}

export const AvatarView = shadowView(use => (avatar: Avatar, options: AvatarOptions = {}) => {
	use.name("avatar")
	use.styles(themeCss, stylesCss)

	const clickable = !!options.onClick
	const onClick = options.onClick ?? (() => {})

	return html`
		<div
			part=box
			x-id="${avatar.id}"
			x-kind="${avatar.kind}"
			?x-selected="${options.selected}"
			?x-loading="${options.loading}"
			?x-locked="${options.locked}"
			?x-clickable="${clickable}"
			@click="${() => onClick(avatar)}">

			<img part=img src="${avatar.url}" alt="" draggable="false"/>

			${options.locked
				? html`<div x-icon=lock>${lockSvg}</div>`
				: null}

			${options.loading
				? html`<div x-icon=loading class=spin>${rotateClockwiseSvg}</div>`
				: null}
		</div>
	`
})

