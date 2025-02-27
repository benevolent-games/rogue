
import {Circular} from "@benev/toolbox"
import {Coordinates} from "../../../realm/utils/coordinates.js"

export class AttackZoneSim {
	radius = 0.8
	distance = 1.3
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

