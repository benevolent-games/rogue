
import {css, shadowComponent} from "@benev/slate"

import themeCss from "./theme.css.js"
import {VirtualGamepad} from "../../packs/grip/virtual-gamepad/view.js"
import {VirtualGamepadDevice} from "../../packs/grip/virtual-gamepad/device.js"

export const SuperControl = shadowComponent(use => {
	use.styles(themeCss, css`
		:host {
			position: absolute;
			inset: 0;
			width: 100%;
			height: 100%;
		}
	`)
	const device = use.once(() => new VirtualGamepadDevice())
	return VirtualGamepad([device])
})

