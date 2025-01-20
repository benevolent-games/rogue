
import {Degrees} from "@benev/toolbox"

import {PimsleyAnims} from "./utils/pimsley-anims.js"
import {DrunkHeading} from "./utils/drunk-heading.js"
import {Pallet} from "../../../tools/babylon/logistics/pallet.js"

const rotationOffset = Degrees.toRadians(180)

export class Pimsley {
	pallet: Pallet
	anims: PimsleyAnims
	drunkHeading = new DrunkHeading()

	constructor(options: {
			pallet: Pallet
		}) {

		this.pallet = options.pallet
		this.anims = new PimsleyAnims(options.pallet)
	}
}

