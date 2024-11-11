
import {html, shadowComponent} from "@benev/slate"
import {Orchestrator, orchestratorStyles, OrchestratorView} from "@benev/toolbox/x/ui/orchestrator/exports.js"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {constants} from "../../../constants.js"
import {Gameplay} from "../../views/gameplay/view.js"
import {MainMenu} from "../../views/main-menu/view.js"
import {loadImage} from "../../../tools/loading/load-image.js"
import {LoadingScreen} from "../../views/loading-screen/view.js"

export const GameApp = shadowComponent(use => {
	use.styles(themeCss, stylesCss)

	// preload the benev logo
	use.load(async() => await loadImage(constants.urls.benevLogo))

	// setup the orchestrator, exhibits, loading screen
	const orchestrator = use.once(() => {
		const mainMenu = Orchestrator.makeExhibit({
			dispose: () => {},
			template: () => MainMenu([{
				nav: {
					host: () => goExhibit.host(),
				},
			}]),
		})

		const orchestrator = new Orchestrator({
			startingExhibit: mainMenu,
			animTime: constants.ui.animTime,
		})

		const loadingScreen = Orchestrator.makeLoadingScreen({
			render: ({active}) => LoadingScreen([active]),
		})

		const goExhibit = {
			mainMenu: orchestrator.makeNavFn(loadingScreen, async() => {
				return mainMenu
			}),

			host: orchestrator.makeNavFn(loadingScreen, async() => {
				const {hostFlow} = await import("../../../flows/host.js")
				const {realm, lobby, dispose} = await hostFlow()
				return {
					dispose,
					template: () => Gameplay([{
						realm,
						lobby,
						exitToMainMenu: () => goExhibit.mainMenu(),
					}]),
				}
			}),
		}

		if (location.hash.includes("solo"))
			goExhibit.host()

		return orchestrator
	})

	return html`
		${OrchestratorView(orchestrator)}
		<style>${orchestratorStyles}</style>
	`
})

