
import {auth} from "@authduo/authduo"
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {PanelName, renderPanels} from "./panels.js"

export const Permabar = shadowView(use => () => {
	use.styles(themeCss, stylesCss)

	const panels = renderPanels(auth)
	const activePanel = use.signal<null | PanelName>(null)

	const closePanel = () => {
		activePanel.value = null
	}

	const clickButton = (panelName: PanelName) => () => {
		activePanel.value = (activePanel.value === panelName)
			? null
			: panelName
	}

	return html`
		<nav>
			${Object.entries(panels).map(([panelName, panel]) => html`
				<button
					@click="${clickButton(panelName as PanelName)}"
					?data-active="${activePanel.value === panelName}">
						${panel.button}
				</button>
			`)}
		</nav>

		${activePanel.value ? html`
			<section>
				<header><button @click=${closePanel}>X</button></header>
				${panels[activePanel.value].content()}
			</section>
		` : null}
	`
})

