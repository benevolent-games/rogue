
import {Circular} from "@benev/toolbox"
import {Coordinates} from "../../../realm/utils/coordinates.js"

export class AttackZoneSim {
	radius = 1
	distance = 1
	attackCenter = Coordinates.zero()

	update(
			bipedCoordinates: Coordinates,
			bipedRotation: Circular,
		) {

		const offset = Coordinates
			.new(0, this.distance)
			.rotate(bipedRotation.x)

		this.attackCenter.set(
			bipedCoordinates
				.clone()
				.add(offset)
		)
	}
}

