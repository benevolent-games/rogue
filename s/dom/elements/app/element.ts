
import Sparrow from "sparrow-rtc"
import {html, opSignal, shadowComponent} from "@benev/slate"
import {ExhibitFn, Orchestrator, orchestratorStyles, OrchestratorView} from "@benev/toolbox/x/ui/orchestrator/exports.js"

import stylesCss from "./styles.css.js"
import {context} from "../../context.js"
import themeCss from "../../theme.css.js"
import {constants} from "../../../constants.js"
import {Gameplay} from "../../views/gameplay/view.js"
import {MainMenu} from "../../views/main-menu/view.js"
import {loadImage} from "../../../tools/loading/load-image.js"
import {LoadingScreen} from "../../views/loading-screen/view.js"
import {handleExhibitErrors} from "../../views/error-screen/view.js"
import {lagProfiles} from "../../../archimedes/net/multiplayer/utils/lag-profiles.js"

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
					// TODO
					play: () => goExhibit.offline(),
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

		const identity = context.multiplayerIdentity

		const goExhibit = {
			mainMenu: makeNav(async() => mainMenu),

			offline: makeNav(async() => {
				const {playerHostFlow} = await import("../../../logic2/flows/player-host.js")
				const flow = await playerHostFlow({lag: lagProfiles.bad, identity})
				const {client, multiplayerClient, dispose} = flow
				return {
					dispose,
					template: () => Gameplay([{
						multiplayerClient,
						realm: client.realm,
						exitToMainMenu: () => goExhibit.mainMenu(),
					}]),
				}
			}),

			// host: makeNav(async() => {
			// 	const {playerHostFlow} = await import("../../../flows/player-host.js")
			// 	const flow = await playerHostFlow({lag: null, identity})
			// 	const {host, multiplayerClient, client, dispose} = flow
			//
			// 	const multiplayerOp = opSignal<MultiplayerHost>()
			// 	multiplayerOp.load(async() => host.startMultiplayer())
			//
			// 	return {
			// 		dispose,
			// 		template: () => Gameplay([{
			// 			realm: client.realm,
			// 			multiplayerClient,
			// 			exitToMainMenu: () => goExhibit.mainMenu(),
			// 		}]),
			// 	}
			// }),
			//
			// client: makeNav(async(invite: string) => {
			// 	const multiplayerClient = await MultiplayerClient.join(
			// 		invite,
			// 		identity,
			// 		() => { goExhibit.mainMenu() },
			// 	)
			// 	const {clientFlow} = await import("../../../flows/client.js")
			// 	const {realm, dispose} = await clientFlow(multiplayerClient)
			// 	return {
			// 		dispose,
			// 		template: () => Gameplay([{
			// 			realm,
			// 			multiplayerClient,
			// 			exitToMainMenu: () => goExhibit.mainMenu(),
			// 		}]),
			// 	}
			// }),
		}

		// if (invite)
		// 	goExhibit.client(invite)

		if (location.hash.includes("offline"))
			goExhibit.offline()

		// else if (location.hash.includes("play"))
		// 	goExhibit.host()

		return orchestrator
	})

	return html`
		${OrchestratorView(orchestrator)}
		<style>${orchestratorStyles}</style>
	`
})

