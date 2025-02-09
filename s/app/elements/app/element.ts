
import {html, opSignal, shadowComponent} from "@benev/slate"
import {ExhibitFn, Orchestrator, orchestratorStyles, OrchestratorView} from "@benev/toolbox/x/ui/orchestrator/exports.js"

import stylesCss from "./styles.css.js"
import {context} from "../../context.js"
import themeCss from "../../theme.css.js"
import {Invites} from "../../features/invites/invites.js"
import {constants} from "../../../constants.js"
import {Gameplay} from "../../views/gameplay/view.js"
import {MainMenu} from "../../views/main-menu/view.js"
import {DungeonStore} from "../../../logic/dungeons/store.js"
import {loadImage} from "../../../tools/loading/load-image.js"
import {LoadingScreen} from "../../views/loading-screen/view.js"
import {handleExhibitErrors} from "../../views/error-screen/view.js"
import {lagProfiles} from "../../../packs/archimedes/net/multiplayer/utils/lag-profiles.js"
import {MultiplayerHost} from "../../../packs/archimedes/net/multiplayer/multiplayer-host.js"
import {MultiplayerClient} from "../../../packs/archimedes/net/multiplayer/multiplayer-client.js"
import { Identity } from "../../features/accounts/ui/types.js"

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
					play: () => goExhibit.host(),
				},
			}], {content: html`<slot></slot>`}),
		})

		const loadingScreen = Orchestrator.makeLoadingScreen({
			render: ({active}) => LoadingScreen([active]),
		})

		const nullExhibit = Orchestrator.makeExhibit({
			dispose: () => {},
			template: () => null,
		})

		const invite = Invites.obtainFromWindow()

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

			lag: makeNav(async() => {
				const {playerHostFlow} = await import("../../../logic/flows/player-host.js")
				const lag = lagProfiles.bad
				const flow = await playerHostFlow({lag, identity})
				const {client, multiplayerClient, dispose} = flow
				return {
					template: () => Gameplay([{
						multiplayerClient,
						realm: client.realm,
						exitToMainMenu: () => goExhibit.mainMenu(),
					}]),
					dispose: () => {
						Invites.deleteInviteFromWindowHash()
						dispose()
					},
				}
			}),

			offline: makeNav(async() => {
				const {playerHostFlow} = await import("../../../logic/flows/player-host.js")
				const lag = lagProfiles.none
				const flow = await playerHostFlow({lag, identity})
				const {client, multiplayerClient, dispose} = flow
				return {
					template: () => Gameplay([{
						multiplayerClient,
						realm: client.realm,
						exitToMainMenu: () => goExhibit.mainMenu(),
					}]),
					dispose: () => {
						Invites.deleteInviteFromWindowHash()
						dispose()
					},
				}
			}),

			host: makeNav(async() => {
				const {playerHostFlow} = await import("../../../logic/flows/player-host.js")
				const flow = await playerHostFlow({lag: null, identity})
				const {host, multiplayerClient, client, dispose} = flow
				const multiplayerOp = opSignal<MultiplayerHost<Identity>>()

				multiplayerOp.load(async() => {
					const multiplayer = await host.startMultiplayer()
					const {invite} = multiplayer.cathedral
					if (invite)
						Invites.writeInviteToWindowHash(invite)
					return multiplayer
				})

				return {
					template: () => Gameplay([{
						realm: client.realm,
						multiplayerClient,
						exitToMainMenu: () => goExhibit.mainMenu(),
					}]),
					dispose: () => {
						Invites.deleteInviteFromWindowHash()
						dispose()
					},
				}
			}),

			client: makeNav(async(invite: string) => {
				const multiplayerClient = await MultiplayerClient.join(
					invite,
					identity,
					() => { goExhibit.mainMenu() },
				)
				const {clientFlow} = await import("../../../logic/flows/client.js")
				const dungeonStore = new DungeonStore()
				const {realm, dispose} = await clientFlow(multiplayerClient, dungeonStore)

				return {
					template: () => Gameplay([{
						realm,
						multiplayerClient,
						exitToMainMenu: () => goExhibit.mainMenu(),
					}]),
					dispose: () => {
						Invites.deleteInviteFromWindowHash()
						dispose()
					},
				}
			}),
		}

		if (invite)
			goExhibit.client(invite)

		if (location.hash.includes("offline"))
			goExhibit.offline()

		if (location.hash.includes("lag"))
			goExhibit.lag()

		else if (location.hash.includes("play"))
			goExhibit.host()

		return orchestrator
	})

	return html`
		${OrchestratorView(orchestrator)}
		<style>${orchestratorStyles}</style>
	`
})

