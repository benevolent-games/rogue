
import {html, nap, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {Gigamenu} from "../gigamenu/view.js"
import {constants} from "../../../constants.js"
import {loadImage2} from "../../../tools/loading/load-image.js"
import {AccountPanel} from "../gigamenu/panels/account/panel.js"

export const MainMenu = shadowView(use => ({nav}: {
		nav: {
			play: () => void
		}
	}) => {

	use.styles(themeCss, stylesCss)

	const ready = use.signal(false)
	const img = use.once(() => loadImage2(constants.urls.cover))

	use.deferOnce(() => {
		nap()
			.then(() => nap())
			.then(() => img.promise)
			.finally(() => ready.value = true)
	})

	return html`
		<div class=overlay>
			${Gigamenu([AccountPanel()])}
		</div>

		<header class=lead>
			<a href="https://benevolent.games/">
				<img class=benev src="${constants.urls.benevLogo}" alt="" draggable="false"/>
				<span>Benevolent Games</span>
			</a>
			<span>presents...</span>
		</header>

		<section class=plate ?x-ready="${ready.value}">
			${img.element}

			<div class=content>
				<h1>Rogue Crusade</h1>
				<nav>
					<button class=play @click="${nav.play}">
						Play
					</button>
				</nav>
			</div>
		</section>

		<footer class=info>
			<h2>The Ultimate Roguelike</h2>
			<p>3d. Permadeath. Solo and co-op. Procedurally generated dungeons. Mosters, loot, potions.</p>
			<p>See the project on <a href="https://github.com/benevolent-games/rogue-crusade">GitHub.</a></p>
			<p>Join our <a href="https://discord.gg/BnZx2utdev">Discord.</a></p>
		</footer>
	`
})

