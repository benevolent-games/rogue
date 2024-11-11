
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {Gigapanel} from "./utils/gigapanel.js"
import menuSvg from "../../icons/tabler/menu.svg.js"

export const Gigamenu = shadowView(use => (...panels: Gigapanel[]) => {
	use.name("gigamenu")
	use.styles(themeCss, stylesCss)

	const menuOpen = use.signal(false)
	const activePanel = use.signal<Gigapanel | undefined>(panels.at(0))

	function clickMenuButton() {
		return () => {
			menuOpen.value = !menuOpen.value
		}
	}

	function clickPanelButton(panel: Gigapanel) {
		return () => {
			activePanel.value = panel
		}
	}

	return html`
		<div class=plate ?x-menu-open="${menuOpen}">
			<nav>
				<button x-menu-button @click="${clickMenuButton()}">
					${menuSvg}
				</button>

				${(menuOpen.value || null) && panels.map(panel => html`
					<button x-tabs
						@click="${clickPanelButton(panel)}"
						?data-active="${panel === activePanel.value}">
							${panel.button()}
					</button>
				`)}
			</nav>

			${(menuOpen.value || null) && activePanel.value && html`
				<section>
					${activePanel.value.content()}
				</section>
			`}
		</div>
	`
})

