
import {CharactersView} from "./view.js"
import {gigapanel} from "../../utils/gigapanel.js"
import userSvg from "../../../../icons/tabler/user.svg.js"

export const CharactersPanel = gigapanel(() => ({
	label: "Characters",
	button: () => userSvg,
	content: () => CharactersView([]),
}))

