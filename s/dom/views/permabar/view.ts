
import {auth} from "@authduo/authduo"
import {ev, html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import xSvg from "../../icons/tabler/x.svg.js"
import {PanelName, renderPanels} from "./panels.js"

export const Permabar = shadowView(use => () => {
	use.styles(themeCss, stylesCss)

	const panels = renderPanels(auth)
	const activePanel = use.signal<null | PanelName>(null)
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
				<header>
					<button @click=${closePanel}>${xSvg}</button>
				</header>
				${panels[activePanel.value].content()}
			</section>
		` : null}
	`
})

