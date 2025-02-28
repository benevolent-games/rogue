
import {Circular} from "@benev/toolbox"
import {Circle} from "../../../../physics/shapes/circle.js"
import {Coordinates} from "../../../../realm/utils/coordinates.js"

export class AttackZoneSim {
	distance = 1.3
	circle = new Circle(Coordinates.zero(), 0.8)

	update(
			bipedCoordinates: Coordinates,
			bipedRotation: Circular,
		) {

		const offset = Coordinates
			.new(0, this.distance)
			.rotate(bipedRotation.x)

		this.circle.center.set(
			bipedCoordinates
				.clone()
				.add(offset)
		)
	}
}

