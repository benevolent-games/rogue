
import {html} from "@benev/slate"

import styles from "./styles.js"
import {nexus} from "../../nexus.js"
import {constants} from "../../../constants.js"
import rotateClockwiseSvg from "../../icons/tabler/rotate-clockwise.svg.js"

export const LoadingScreen = nexus.shadowView(use => (active: boolean) => {
	use.name("loading-screen")
	use.styles(styles)

	return html`
		<div class=plate ?data-show="${active}">
			<img class=benev src="${constants.urls.benevLogo}" alt=""/>
			<h2>benevolent.games</h2>
			<div>
				<p>now loading...</p>
				<span class=spin>${rotateClockwiseSvg}</span>
			</div>
		</div>
	`
})

