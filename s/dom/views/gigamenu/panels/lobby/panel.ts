
import {gigapanel} from "../../utils/gigapanel.js"
import {LobbyView, LobbyViewOptions} from "./view.js"
import usersGroupSvg from "../../../../icons/tabler/users-group.svg.js"

export const LobbyPanel = gigapanel((options: LobbyViewOptions) => ({
	label: "lobby",
	button: () => usersGroupSvg,
	content: () => LobbyView([options]),
}))

