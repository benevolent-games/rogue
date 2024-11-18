
import {LobbyView} from "./view.js"
import {gigapanel} from "../../utils/gigapanel.js"
import usersGroupSvg from "../../../../icons/tabler/users-group.svg.js"
import {MultiplayerClient} from "../../../../../logic/multiplayer/multiplayer-client.js"

export const LobbyPanel = gigapanel((multiplayerClient: MultiplayerClient) => ({
	label: "Lobby",
	button: () => usersGroupSvg,
	content: () => LobbyView([multiplayerClient]),
}))

