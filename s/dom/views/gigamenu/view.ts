
import {ev, html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {Gigapanel} from "./utils/gigapanel.js"
import benevolent2Svg from "../../icons/benev/benevolent2.svg.js"

export const Gigamenu = shadowView(use => (...panels: Gigapanel[]) => {
	use.name("gigamenu")
	use.styles(themeCss, stylesCss)

	const menuOpen = use.signal(false)
	const activeIndex = use.signal(0)
	const activePanel = panels.at(activeIndex.value)

	use.mount(() => ev(window, {keydown: (event: KeyboardEvent) => {
		if (event.code === "Tab") {
			menuOpen.value = !menuOpen.value
			event.preventDefault()
		}
	}}))

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
		<div class=plate ?x-menu-open="${menuOpen}" x-panel="${activePanel?.label ?? ""}">
			<nav>
				<button x-menu-button @click="${clickMenuButton()}" class="naked">
					${benevolent2Svg}
				</button>

				${panels.map((panel, index) => html`
					<button
						x-tab
						@click="${clickPanelButton(index)}"
						?x-active="${index === activeIndex.value}"
						class="naked">
							${panel.button()}
							<span>${panel.label}</span>
					</button>
				`)}
			</nav>

			${activePanel && html`
				<section>
					${activePanel.content()}
				</section>
			`}
		</div>
	`
})

