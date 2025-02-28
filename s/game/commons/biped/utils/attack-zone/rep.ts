
import {Circular, Degrees, Prop, Quat, Vec3} from "@benev/toolbox"
import {Trashbin} from "@benev/slate"

import {AttackZoneSim} from "./sim.js"
import {BipedIndicatorStore} from "../biped-indicators.js"
import {Coordinates} from "../../../../realm/utils/coordinates.js"
import {applySpatial} from "../../../../../tools/babylon/logistics/apply-spatial.js"

export class AttackZoneRep extends AttackZoneSim {
	disc: Prop
	height = 1
	#trash = new Trashbin()

	constructor(public indicators: BipedIndicatorStore) {
		super()
		this.disc = indicators.attackDiscPool.borrow(this.#trash)
	}

	update(bipedCoordinates: Coordinates, bipedRotation: Circular) {
		super.update(bipedCoordinates, bipedRotation)
		applySpatial(this.disc, {
			scale: Vec3.all(this.circle.radius),
			rotation: Quat.rotate_(Degrees.toRadians(90), 0, 0),
			position: Coordinates.from(this.circle.center)
				.position()
				.add_(0, this.height, 0),
		})
	}

	dispose() {
		this.#trash.dispose()
	}
}

