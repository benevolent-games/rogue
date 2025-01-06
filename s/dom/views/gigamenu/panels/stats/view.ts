
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../../../theme.css.js"
import {Realm} from "../../../../../logic/realm/realm.js"

export const StatsView = shadowView(use => ({stats}: Realm) => {
	use.styles(themeCss, stylesCss)

	return html`
		<section>
			<ul>
				<li>
					<strong>framerate</strong>
					<span>${stats.timing.framerate.time.toFixed(0)} hz</span>
				</li>
				<li>
					<strong>tick</strong>
					<span>${stats.timing.tick.time.toFixed(2)} ms</span>
				</li>
				<li>
					<strong>base</strong>
					<span>${stats.timing.base.time.toFixed(2)} ms</span>
				</li>
				<li>
					<strong>prediction</strong>
					<span>${stats.timing.prediction.time.toFixed(2)} ms</span>
				</li>
				<li>
					<strong>physics</strong>
					<span>${stats.timing.physics.time.toFixed(2)} ms</span>
				</li>
			</ul>
		</section>
	`
})

