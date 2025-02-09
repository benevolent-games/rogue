
import {StatsView} from "./view.js"
import {gigapanel} from "../../utils/gigapanel.js"
import {Realm} from "../../../../../game/realm/realm.js"
import chartInfographicSvg from "../../../../icons/tabler/chart-infographic.svg.js"

export const StatsPanel = gigapanel((realm: Realm) => ({
	label: "Stats",
	button: () => chartInfographicSvg,
	content: () => StatsView([realm]),
}))

