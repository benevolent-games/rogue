
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {constants} from "../../../constants.js"
import rotateClockwiseSvg from "../../../app/icons/tabler/rotate-clockwise.svg.js"

export const LoadingScreen = shadowView(use => (active: boolean) => {
	use.styles(themeCss, stylesCss)

	return html`
		<div class=plate ?data-show="${active}">
			<img class=benev src="${constants.urls.benevLogo}" alt="" draggable="false"/>
			<h2>benevolent.games</h2>
			<div>
				<p>now loading...</p>
				<span class=spin>${rotateClockwiseSvg}</span>
			</div>
		</div>
	`
})

