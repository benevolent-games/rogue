
import {QuitView} from "./view.js"
import {gigapanel} from "../../utils/gigapanel.js"
import xSvg from "../../../../../app/icons/tabler/x.svg.js"

export const QuitPanel = gigapanel((exit: () => void) => ({
	label: "Quit",
	button: () => xSvg,
	content: () => QuitView([exit]),
}))

