
import {html, nap, requestAnimationFrameLoop, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {Gigamenu} from "../gigamenu/view.js"
import {constants} from "../../../constants.js"
import {loadImage2} from "../../../tools/loading/load-image.js"
import {AccountPanel} from "../gigamenu/panels/account/panel.js"
import {getMetaVersion} from "../../../tools/get-meta-version.js"
import {UserInputs} from "../../../logic/realm/inputs/user-inputs.js"

export const MainMenu = shadowView(use => ({nav}: {
		nav: {play: () => void}
	}) => {

	use.styles(themeCss, stylesCss)

	const menuOpen = use.signal(false)

	const userInputs = use.init(() => {
		const userInputs = new UserInputs(window)
		const stop = requestAnimationFrameLoop(() => userInputs.poll())
		return [userInputs, () => {
			stop()
			userInputs.dispose()
		}]
	})

	const gitTag = use.once(() => getMetaVersion())

	use.mount(() => userInputs.grip.state.normal.menu.pressed.on(pressed => {
		if (pressed)
			menuOpen.value = !menuOpen.value
	}))

	const ready = use.signal(false)
	const img = use.once(() => loadImage2(constants.urls.cover))

	use.deferOnce(() => {
		nap()
			.then(() => nap())
			.then(() => img.promise)
			.finally(() => ready.value = true)
	})

	return html`
		<section class=plate>
			<div class=overlay>
				${Gigamenu([menuOpen, [AccountPanel()]])}
			</div>

			<figure>
				<img alt="" draggable=false src="/assets/images/rogue-banner-6.webp"/>
			</figure>

			<nav>
				<button class=play @click="${nav.play}">
					Play
				</button>
				<span class=version>
					${gitTag}
				</span>
			</nav>

			<slot></slot>
		</section>
	`
})

