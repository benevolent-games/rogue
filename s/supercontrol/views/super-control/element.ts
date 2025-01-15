
import {html, shadowComponent} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {SuperController} from "../../aspects/super-controller.js"

export const SuperControl = shadowComponent(use => {
	use.styles(themeCss, stylesCss)

	// const gamepadManager = use.init(() => {
	// 	const gamepadManager = new SuperController()
	// 	return [gamepadManager, () => gamepadManager.dispose()]
	// })

	// return html`
	// 	<ol>
	// 		${gamepadManager.gamepadsSignal.value.map(gamepad => html`
	// 			<li>
	// 				<strong>${gamepad.id}</strong>
	// 			</li>
	// 		`)}
	// 	</ol>
	// `
})

