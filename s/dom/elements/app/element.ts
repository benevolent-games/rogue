
import Sparrow from "sparrow-rtc"
import {html, Op, opSignal, OpSignal, shadowComponent} from "@benev/slate"
import {ExhibitFn, Orchestrator, orchestratorStyles, OrchestratorView} from "@benev/toolbox/x/ui/orchestrator/exports.js"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {constants} from "../../../constants.js"
import {Gameplay} from "../../views/gameplay/view.js"
import {MainMenu} from "../../views/main-menu/view.js"
import {loadImage} from "../../../tools/loading/load-image.js"
import {LoadingScreen} from "../../views/loading-screen/view.js"
import { MultiplayerClient } from "../../../logic/multiplayer/multiplayer-client.js"
import { handleExhibitErrors } from "../../views/error-screen/view.js"

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

		const loadingScreen = Orchestrator.makeLoadingScreen({
			render: ({active}) => LoadingScreen([active]),
		})

		const nullExhibit = Orchestrator.makeExhibit({
			dispose: () => {},
			template: () => null,
		})

		const invite = Sparrow.invites.parse(window.location.hash)
		if (invite) window.location.hash = ""

		const orchestrator = new Orchestrator({
			animTime: constants.ui.animTime,
			startingExhibit: invite
				? nullExhibit
				: mainMenu,
		})

		function makeNav<Fn extends ExhibitFn>(fn: Fn) {
			const onClickBackButton = () => goExhibit.mainMenu()
			const exhibitor = ((...a: any[]) => handleExhibitErrors(
				onClickBackButton,
				async() => fn(...a),
			)) as Fn
			return orchestrator.makeNavFn(loadingScreen, exhibitor)
		}

		const goExhibit = {
			mainMenu: makeNav(async() => mainMenu),

			host: makeNav(async() => {
				// when hosting, we load babylon and the 3d stuff right away,
				// multiplayer connectivity happens secondarily.
				const {hostFlow} = await import("../../../flows/host.js")
				const {realm, multiplayerOp, dispose} = await hostFlow()

				return {
					dispose,
					template: () => Gameplay([{
						realm,
						multiplayerOp,
						exitToMainMenu: () => goExhibit.mainMenu(),
					}]),
				}
			}),

			join: makeNav(async(invite: string) => {
				// when joining, we establish connectivity primarily,
				// before the game is ready
				const multiplayer = await MultiplayerClient.join(invite)
				const multiplayerOp = opSignal(Op.ready(multiplayer))

				const {joinFlow} = await import("../../../flows/join.js")
				const {realm, dispose} = await joinFlow(multiplayer)

				return {
					dispose,
					template: () => Gameplay([{
						realm,
						multiplayerOp,
						exitToMainMenu: () => goExhibit.mainMenu(),
					}]),
				}
			}),
		}

		if (invite)
			goExhibit.join(invite)

		// if (location.hash.includes("solo"))
		// 	goExhibit.host()

		return orchestrator
	})

	return html`
		${OrchestratorView(orchestrator)}
		<style>${orchestratorStyles}</style>
	`
})

