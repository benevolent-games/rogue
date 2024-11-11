
import {loading, OpSignal} from "@benev/slate"

import {LobbyView} from "./view.js"
import {gigapanel} from "../../utils/gigapanel.js"
import usersGroupSvg from "../../../../icons/tabler/users-group.svg.js"
import {MultiplayerHost} from "../../../../../logic/multiplayer/multiplayer-host.js"
import {MultiplayerClient} from "../../../../../logic/multiplayer/multiplayer-client.js"

export const LobbyPanel = gigapanel((multiplayerOp: OpSignal<MultiplayerHost | MultiplayerClient>) => ({
	label: "Lobby",
	button: () => usersGroupSvg,
	content: () => loading.binary(
		multiplayerOp.value,
		multiplayer => LobbyView([multiplayer]),
	),
}))

