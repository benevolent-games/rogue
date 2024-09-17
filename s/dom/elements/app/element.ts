
import {html} from "@benev/slate"
import {Orchestrator, orchestratorStyles, OrchestratorView} from "@benev/toolbox/x/ui/orchestrator/exports.js"

import styles from "./styles.js"
import {nexus} from "../../nexus.js"
import {constants} from "../../../constants.js"
import {loadImage} from "../../../tools/loading/load-image.js"

export const GameApp = nexus.shadowComponent(use => {
	use.styles(styles)

	// preload the benev logo
	use.load(async() => await loadImage(constants.urls.benevLogo))

	// setup the orchestrator, exhibits, loading screen
	const orchestrator = use.once(() => {
		const mainMenu = Orchestrator.makeExhibit({
			dispose: () => {},
			template: () => html`
				<h1>main menu</h1>
				<button @click="${() => goExhibit.solo()}">play solo</button>
			`,
		})

		const orchestrator = new Orchestrator({
			startingExhibit: mainMenu,
			animTime: constants.ui.animTime,
		})

		const loadingScreen = Orchestrator.makeLoadingScreen({
			render: ({active}) => html`
				<img class=logo src="${constants.urls.benevLogo}" alt=""/>
			`,
		})

		const goExhibit = {
			mainMenu: orchestrator.makeNavFn(loadingScreen, async() => {
				return mainMenu
			}),

			solo: orchestrator.makeNavFn(loadingScreen, async() => {
				return {
					dispose: () => {},
					template: () => html`
						<h1>solo gameplay mode</h1>
						<button @click="${() => goExhibit.mainMenu()}">back to menu</button>
					`,
				}
			}),
		}


		return orchestrator
	})

	return html`
		${OrchestratorView(orchestrator)}
		<style>${orchestratorStyles}</style>
	`
})

