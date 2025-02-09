
import {LobbyView} from "./view.js"
import {gigapanel} from "../../utils/gigapanel.js"
import {Identity} from "../../../../features/accounts/ui/types.js"
import {MultiplayerClient} from "../../../../../packs/archimedes/net/multiplayer/multiplayer-client.js"

import usersGroupSvg from "../../../../icons/tabler/users-group.svg.js"

export const LobbyPanel = gigapanel((multiplayerClient: MultiplayerClient<Identity>) => ({
	label: "Lobby",
	button: () => usersGroupSvg,
	content: () => LobbyView([multiplayerClient]),
}))

