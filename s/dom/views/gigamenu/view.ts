
import {ev, html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {Gigapanel} from "./utils/gigapanel.js"
import menuSvg from "../../icons/tabler/menu.svg.js"

export const Gigamenu = shadowView(use => (...panels: Gigapanel[]) => {
	use.name("gigamenu")
	use.styles(themeCss, stylesCss)

	const menuOpen = use.signal(false)
	const activeIndex = use.signal(0)
	const activePanel = panels.at(activeIndex.value)

	const plate = use.defer(() => use.shadow.querySelector(".plate"))

	use.mount(() => ev(window, {
		click: (event: PointerEvent) => {
			const path = event.composedPath()
			if (plate.value && !path.includes(plate.value))
				menuOpen.value = false
		},
	}))

	function clickMenuButton() {
		return () => {
			menuOpen.value = !menuOpen.value
		}
	}

	function clickPanelButton(index: number) {
		return () => {
			activeIndex.value = index
		}
	}

	return html`
		<div class=plate ?x-menu-open="${menuOpen}">
			<nav>
				<button x-menu-button @click="${clickMenuButton()}" class="naked">
					${menuSvg}
				</button>

				${(menuOpen.value || null) && panels.map((panel, index) => html`
					<button
						x-tabs
						@click="${clickPanelButton(index)}"
						?x-active="${index === activeIndex.value}"
						class="naked">
							${panel.button()}
							<span>${panel.label}</span>
					</button>
				`)}
			</nav>

			${(menuOpen.value || null) && activePanel && html`
				<section>
					${activePanel.content()}
				</section>
			`}
		</div>
	`
})

