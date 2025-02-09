
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../../../theme.css.js"
import {Realm} from "../../../../../game/realm/realm.js"

export const StatsView = shadowView(use => (realm: Realm) => {
	use.styles(themeCss, stylesCss)

	void realm.frame.value
	const {stats} = realm

	return html`
		<section>
			<ul>
				<li>
					<strong>framerate</strong>
					<span>${stats.framerate.average.toFixed(2)} hz</span>
				</li>
				<li>
					<strong>ticksAhead</strong>
					<span>${stats.ticksAhead.average.toFixed(2)}</span>
				</li>
				<li>
					<strong>tick</strong>
					<span>${stats.tick.average.toFixed(2)} ms</span>
				</li>
				<li>
					<strong>base</strong>
					<span>${stats.base.average.toFixed(2)} ms</span>
				</li>
				<li>
					<strong>prediction</strong>
					<span>${stats.prediction.average.toFixed(2)} ms</span>
				</li>
				<li>
					<strong>physics</strong>
					<span>${stats.physics.average.toFixed(2)} ms</span>
				</li>
				<li>
					<strong>physicsAwakes</strong>
					<span>${stats.physicsAwake.number.toFixed(0)}</span>
				</li>
			</ul>
		</section>
	`
})

