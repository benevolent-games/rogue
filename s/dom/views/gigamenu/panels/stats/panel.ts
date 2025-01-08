
import {StatsView} from "./view.js"
import {gigapanel} from "../../utils/gigapanel.js"
import {GameStats} from "../../../../../logic/realm/parts/game-stats.js"
import chartInfographicSvg from "../../../../icons/tabler/chart-infographic.svg.js"

export const StatsPanel = gigapanel((stats: GameStats) => ({
	label: "Stats",
	button: () => chartInfographicSvg,
	content: () => StatsView([stats]),
}))

