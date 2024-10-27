
import {ev, html, shadowView} from "@benev/slate"

import {Panel} from "./panels.js"
import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import xSvg from "../../icons/tabler/x.svg.js"

export type PermabarOptions = {
	menu: null | {goToMainMenu: () => void}
}

export const Permabar = shadowView(use => (panels: Panel[]) => {
	use.styles(themeCss, stylesCss)

	const activePanel = use.signal<null | Panel>(null)
	const section = use.defer(() => use.shadow.querySelector("section"))

	use.mount(() => ev(window, {
		click: (event: PointerEvent) => {
			const path = event.composedPath()
			if (section.value && !path.includes(section.value))
				closePanel()
		},
	}))

	const closePanel = () => {
		activePanel.value = null
	}

	const clickButton = (panel: Panel) => {
		return () => {
			activePanel.value = (activePanel.value === panel)
				? null
				: panel
		}
	}

	return html`
		<nav>
			${panels.map(panel => html`
				<button
					@click="${clickButton(panel)}"
					?data-active="${activePanel.value === panel}">
						${panel.button()}
				</button>
			`)}
		</nav>

		${activePanel.value ? html`
			<section>
				<header>
					<button @click=${closePanel}>${xSvg}</button>
				</header>
				${activePanel.value.content()}
			</section>
		` : null}
	`
})

